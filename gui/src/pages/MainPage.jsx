import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import io from 'socket.io-client';
import TextArea from '../components/TextArea';

export default function MainPage() {
  const { isLoading, error, data, refetch } = useQuery(['questions'], async () => {
    const response = await axios.get('http://localhost:3000/questions', {
      withCredentials: true,
    });
    return response.data;
  });

  const [socket, setSocket] = useState(null);
  const [questionsWithNoAnswers, setQuestionsWithNoAnswers] = useState([]);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket.io');
    });

    newSocket.on('new-question', () => {
      refetch();
    });

    newSocket.on('question-answered', (questionId) => {
      setQuestionsWithNoAnswers(prevQuestions => 
        prevQuestions.filter(question => question._id !== questionId)
      );
    });

    newSocket.on("new-question", (arg1) => {
      alert(`New question has been added ${arg1}. If you do not see it, please reload the page :)`);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [refetch]);

  useEffect(() => {
    if (data) {
      setQuestionsWithNoAnswers(data.filter(question => !question.answer));
    }
  }, [data]);

  const handleAnswerButtonClick = (question) => {
    setSelectedQuestion(question);
    setShowAnswerForm(true);
    socket.emit('answer-question', question._id);
  };

  const handleAnswerSubmit = async () => {
    if (!selectedQuestion) return;

    try {
      await axios.post('http://localhost:3000/update-question-status', {
        questionId: selectedQuestion._id,
        status: 'completed',
        answer: answerText,
      }, {
        withCredentials: true,
      });
      await refetch(); // Refresh the question list after answering
      setShowAnswerForm(false);
      setAnswerText('');
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleCancelAnswer = () => {
    setShowAnswerForm(false);
    setAnswerText('');
  };

  if (isLoading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-lg text-red-600">Error: {error.message}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-4xl text-orange-500 font-bold">Chegg</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Questions</h2>
          {questionsWithNoAnswers.length > 0 ? (
            questionsWithNoAnswers.map((question) => (
              <div key={question._id} className="mb-4 p-4 border rounded-lg shadow">
                <h3 className="text-xl font-medium">{question.subject}</h3>
                <p className="mb-2">{question.questionText}</p>
                <button
                  onClick={() => handleAnswerButtonClick(question)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Answer Question
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No questions available</p>
          )}
        </div>
        <div>
          {showAnswerForm && (
            <div className="p-4 border rounded-lg shadow">
              <h3 className="text-xl font-medium mb-2">Answering Question:</h3>
              <p className="mb-4">{selectedQuestion?.questionText}</p>
              <TextArea
                showKeyboard={true}
                text={answerText}
                setShowKeyboard={() => {}}
                setText={setAnswerText}
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={handleAnswerSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Submit Answer
                </button>
                <button
                  onClick={handleCancelAnswer}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
