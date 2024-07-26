import { Link } from "react-router-dom";
import React, { useState } from "react";
import usesignedin from "../hooks/usesignedin";
import axios from 'axios';
import AccountNavigation from "../components/AccountNavigation";

export default function ProfileInfo() {
  const { userInfo, loading, error } = usesignedin();
  const data = userInfo?.user;
  const [count, setCount] = useState(0);
  const [firstName, setFirstName] = useState(data?.firstName || '');
  const [lastName, setLastName] = useState(data?.lastName || '');
  const [collegeName, setCollegeName] = useState(data?.collegeName || '');
  const [GraduationYear, setGraduationYear] = useState(data?.GraduationYear || '');
  const [YearAtCollege, setYearAtCollege] = useState(data?.YearAtCollege || '');

  const handleSaveChanges = async (e) => {
    setCount(0);
    e.preventDefault();
    const updatedData = {
      firstName,
      lastName,
      collegeName,
      GraduationYear,
      YearAtCollege,
    };
    try {
      await axios.patch(`http://localhost:3000/users/${data._id}`, updatedData);
      alert('Profile updated successfully');
    } catch (error) {
      alert('Error updating profile');
    }
  };

  if (!data) 
    return <div>Please Sign In</div>;

  return (
    <>
    <AccountNavigation />
      {!data ? (
        <Link to="/signin" className="text-blue-500 hover:text-blue-700">
          Sign In
        </Link>
      ) : (
        <form className="flex flex-col ml-8 gap-2 mt-8" onSubmit={handleSaveChanges}>
          <span className="text-2xl font-bold">Profile Info</span>
          <label>First name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => {setFirstName(e.target.value); setCount((c) => c + 1);}}
            className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
            placeholder={data.firstName}
          />
          <label>Last name</label>
          <input
            type="text"
            value={lastName}
            placeholder={data.lastName}
            onChange={(e) => {setLastName(e.target.value); setCount((c) => c + 1);}}
            className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
            
          />
          <label>Email address</label>
          <input
            type="text"
            placeholder={data.email}
            className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
            disabled
          />
          <label>College name</label>
          <input
            type="text"
            value={collegeName}
            onChange={(e) => {setCollegeName(e.target.value); setCount((c) => c + 1);}}
            className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
            placeholder={data.collegeName}
          />
          <label>What year are you in?</label>
          <select
            value={YearAtCollege}
            onChange={(e) => {setYearAtCollege(e.target.value); setCount((c) => c + 1);}}
            className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
        >
            <option>Select academic year</option>
            <option>Freshman</option>
            <option>Sophomore</option>
            <option>Junior</option>
            <option>Senior</option>
            <option>5th+ year</option>
          </select>
          <label>What year are you planning to graduate?</label>
          <select
            value={GraduationYear}
            onChange={(e) => {setGraduationYear(e.target.value); setCount((c) => c + 1);}}
            className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option>Select year</option>
            <option>2024</option>
            <option>2025</option>
            <option>2026</option>
            <option>2027</option>
            <option>2028</option>
          </select>
          <button 
            type="submit" 
            className={count === 0 ? "ml-auto rounded-md shadow-md bg-gray-500 text-white px-4 py-2"
              :"ml-auto rounded-md shadow-md bg-orange-500 text-white px-4 py-2 hover:bg-orange-600"}
            disabled={count === 0}
          >
            Save changes
          </button>
        </form>
      )}
    </>
  );
}
