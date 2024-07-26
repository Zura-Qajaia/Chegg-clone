import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0); 

  const mutation = useMutation(
    async (loginData) => {
      const response = await axios.post(
        "http://localhost:3000/signup",
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
        console.error("Error signing up:", error);
      },
      onSuccess: (data) => {
        console.log("Sign up successful:", data);
        navigate("/");
      },
    }
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Create an account</h2>
      <form>
        <div className="mb-4">
        <label htmlFor="firstname" className="block text-gray-700 mb-2">
            FirstName
          </label>
          <input
            type="firstname"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
           <label htmlFor="lastname" className="block text-gray-700 mb-2">
            LastName
          </label>
          <input
            type="lastname"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
           <label htmlFor="age" className="block text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            id="age"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />


          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
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
        <button
          type="submit"
          disabled={error}
          onClick={() => {
            mutation.mutate({ id: 5, firstName: firstName, lastName:lastName, password: password, email:email, age:age , role:'user'})}}
          className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Create account
        </button>
        <span>
          We respect your privacy. By clicking "Create account" you agree to the
          Terms and Privacy Policy.
        </span>
        <div className="flex flex-row mt-5">
          <span>Already have an account?</span>
          <Link className="text-blue-800 ml-2" to="/signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
