import React, { useEffect } from "react";
import toast from "react-hot-toast";
import image4 from "./../../public/images/about-4.png";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Signout() {
  useEffect(() => {
    const fetchLogout = async () => {
      try {
        const response = await axios.get("http://localhost:3000/logout", {
          withCredentials: true,
        });
        // Assuming your backend returns a success message or status code on successful logout
        if (response.status === 200) {
          toast.success("You have been signed out.");
        } else {
          toast.error("Failed to sign out. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to sign out. Please try again.");
        console.error("Logout error:", error);
      }
    };
    fetchLogout();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h4 className="text-2xl font-bold text-center mb-6">
        You&apos;re signed out
      </h4>
      <img src={image4} alt="About" />
      <h4 className="text-xl text-center mb-6">
        22 random facts you need to know
      </h4>
      <Link to="/signin" className="underline">
        Sign back in
      </Link>
    </div>
  );
}
