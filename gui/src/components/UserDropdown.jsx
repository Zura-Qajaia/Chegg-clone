import React, { useEffect, useRef, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import useSignedIn from "../hooks/usesignedin"; // Corrected hook name
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function UserDropdown({ options }) {
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSignedIn(); // Corrected hook name
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const data = userInfo?.user;

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  if (loading) {
    return <span>Loading...</span>;
  }

  if (error) {
    return <span>Error loading user info</span>;
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)} // Toggle isOpen state
        className="flex items-center space-x-2 focus:outline-none"
        aria-label="User Dropdown"
      >
        <RxAvatar className="text-2xl text-orange-500" />
        <span>V</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-purple-900 ring-1 ring-black ring-opacity-5 z-50">
          <Link to="/my/account" className="flex items-center p-4 text-white">
            <RxAvatar className="text-6xl text-orange-500 mr-4" />
            <div className="flex flex-col">
              <span>{data.firstName} {data.lastName}</span>
              <span className="text-gray-400 text-sm">{data.email}</span>
            </div>
            <BsThreeDotsVertical className="text-3xl ml-auto" />
          </Link>
          <div className="flex flex-col bg-white">
            {options.map((option, index) => (
              <button
                key={index}
                className="py-2 px-4 text-black hover:border-l-8 border-orange-500 transition duration-300 focus:outline-none"
                onClick={() => {
                  if(option === "Sign Out")
                    navigate("/signout");
                  if(option === "My Account")
                    navigate("/my/account");

                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
