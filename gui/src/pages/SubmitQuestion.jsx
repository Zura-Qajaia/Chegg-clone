import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const SubmitQuestion = () => {
  const [questionText, setQuestionText] = useState('');
  const [subject, setSubject] = useState('');
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket.io');
    });

    newSocket.on("question-answered", (arg1) => {
      console.log(arg1);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/send-to-expert', {
        questionText,
        subject,
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        socket.emit('new-question', {
          questionText,
          subject,
        });
        alert('Question sent to expert successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error sending question to expert:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-orange-600">Submit Your Question</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Question:</label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              rows="4"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange-600 text-white font-bold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitQuestion;
