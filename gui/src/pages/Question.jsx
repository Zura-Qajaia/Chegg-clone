import React, { useState } from "react";

const Question = ({ question }) => {
  const [showSolution, setShowSolution] = useState(false);
  console.log(question.questionText);
  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  const renderTextParts = (text) => {
    const maxLength = 100;
    if (!text) return [];
    if (text.length <= maxLength) return [text];
    const parts = [];
    for (let i = 0; i < text.length; i += maxLength) {
      parts.push(text.slice(i, i + maxLength));
    }
    return parts;
  };

  const questionParts = renderTextParts(question?.questionText);
  const explanationParts = renderTextParts(question?.explanation);
  console.log(questionParts);
  console.log(explanationParts);
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        {question?.subject}: {question?.topic}
      </h2>
      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-2">Question:</h4>
        {questionParts.map((part, index) => (
          <p key={index} className="text-gray-700 mb-2">
            {part}
          </p>
        ))}
      </div>
      <button
        onClick={toggleSolution}
        className="w-full py-2 mb-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {showSolution ? "Hide Solution" : "Show Solution"}
      </button>
      {showSolution && (
        <div className="mb-6">
          <h4 className="text-xl font-semibold mb-2">Solution:</h4>
          <p className="text-green-700 font-medium mb-2">
            Correct Answer: {question?.answer}
          </p>
          {explanationParts.map((part, index) => (
            <p key={index} className="text-gray-700 mb-2">
              {part}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Question;
