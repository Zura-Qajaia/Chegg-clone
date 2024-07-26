import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import postData from "../javascript/SearchEngine.js";
import './../../public/css/search.css'
const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [data, setData] = useState(null);
  console.log(state);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (state) {
          const result = await postData(state);
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [state]);

  return (
    <div>
      <h1 className="z">Search Page</h1>

      {data && (
        <div className="flex flex-col">
          <div>
            <h4>
              We found {data.length} similar questions that have already been
              answered!
            </h4>
            <br />
            <h4>
              Check these out and if you're still feeling stuck, send your
              question to an expert.
            </h4>
            <div className="flex flex-col bg-grey shadow-md rounded-lg p-4 transition duration-300 ease-in-out transform hover:scale-105">
              <h4 className="ml-80 font-bold">
                Not what you&apos;re looking for?
              </h4>
              <h4 className="ml-72">
                Submit your question to a subject-matter expert.
              </h4>
              <button
                className="bg-orange-500 rounded-md"
                onClick={() => navigate('/submit-question')}
              >
                Send to expert
              </button>
            </div>
            {data.map((el, index) => (
              <div
                key={index}
                className="bg-grey shadow-md rounded-lg p-4 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <p>Q: {el.questionText}</p>
                <button
                  className="text-blue-900"
                  onClick={() => navigate(`/question/${el.id}`)}
                >
                  Get the solution
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
