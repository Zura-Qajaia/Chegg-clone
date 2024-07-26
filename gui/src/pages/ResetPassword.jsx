import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState(""); 
    const navigate = useNavigate();

    const mutation = useMutation(
        async (password) => {
          console.log(password);
          const response = await axios.post(
            `http://localhost:3000/api/v1/users/resetPassword/${token}`,{
            password,
            },
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
           
          },
        }
      );

      function handle(e) {
        e.preventDefault();
        // console.log(password);
       mutation.mutate({password});
       navigate("/");
      }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
         <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
             <button
              type="submit"
              className="w-full py-2 px-4 bg-orange-600 text-white font-bold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={handle}
            >
              Submit
            </button>
        </div>   
    );
}