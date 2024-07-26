import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation(
    async (loginData) => {
      const response = await axios.post(
        "http://localhost:3000/login",
        loginData,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      return response.data;
    },
    {
      onError: (error) => {
        setError("Invalid email or password");
        console.error("Error logging in:", error);
      },
      onSuccess: (data) => {
        console.log("Login successful:", data);
        navigate("/");
        // Handle successful login, e.g., redirect or store user data
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate({ email, password });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
      <h4 className="text-xl text-center mb-6">to your Chegg account</h4>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Link to="/forgotPassword" className="text-blue-900">Forgot password?</Link>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Signing In..." : "Sign In"}
        </button>
        <div className="flex flex-row mt-5">
          <span>Don&apos;t have an account?</span>
          <br></br>
          <Link className="text-blue-800 ml-2" to="/signup">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
