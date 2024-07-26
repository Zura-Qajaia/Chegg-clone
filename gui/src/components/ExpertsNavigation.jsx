import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function ExpertsNavigation() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown1, setShowDropdown1] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleMouseEnter1 = () => {
    setShowDropdown1(true);
  };

  const handleMouseLeave1 = () => {
    setShowDropdown1(false);
  };

  return (
    <div className="flex flex-row md:mt-3 space-x-4">
      <div className="flex items-center">
        <span className="text-orange-600 font-bold text-3xl">Chegg</span>
      </div>
      <div
        className="relative flex-grow flex flex-col items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center cursor-pointer">
          <span className="text-2xl font-bold">Learn</span>
          <RiArrowDropDownLine className="text-4xl" />
        </div>
        {showDropdown && (
          <div className="absolute top-full mt-2 bg-white shadow-md rounded-md z-10">
            <div className="flex flex-col items-center p-2">
              <span className="p-2">Chegg Study</span>
              <span className="p-2">Learn a Language</span>
            </div>
          </div>
        )}
      </div>
      <div
        className="relative flex-grow flex flex-col items-center justify-center"
        onMouseEnter={handleMouseEnter1}
        onMouseLeave={handleMouseLeave1}
      >
        <div className="flex items-center cursor-pointer">
          <span className="text-2xl font-bold">Earn</span>
          <RiArrowDropDownLine className="text-4xl" />
        </div>
        {showDropdown1 && (
          <div className="absolute top-full mt-2 bg-white shadow-md rounded-md z-10">
            <div className="flex flex-col items-center p-2">
              <span className="p-2">Experts Sign Up</span>
              <span className="p-2">Voice of Experts</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
