import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Recent() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/recent", {
          withCredentials: true,
        });
        setQuestions(response.data.data.temp);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching recent questions");
        setError(error);
        setIsLoading(false);
      }
    };

    fetchRecentQuestions();
  }, []);

  if (isLoading) {
    return  ( <div className="flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-t-4 border-t-orange-500 border-gray-200 rounded-full animate-spin"></div>
  </div>);
  }

  if (error) {
    return <Link to="/signin">Please Sign In</Link>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h1>Recent</h1>
      {questions && questions.length > 0 ? (
        <ul>
          {questions.map((question, index) => (
            <li key={index}>
              <p>{index}</p>
              <p>{question.questionText}</p>
              <p>{question.explanation}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent questions found.</p>
      )}
    </div>
  );
}
