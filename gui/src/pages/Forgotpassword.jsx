import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios"; // Make sure to import axios
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState(null); // Add state for error handling

    const navigate = useNavigate(); // Initialize useNavigate

    const mutation = useMutation(
        async (email) => {
            const response = await axios.post(
                "http://localhost:3000/forgotpassword",
                { email },
                {
                    withCredentials: true,
                }
            );
            console.log(response);
            return response.data;
        },
        {
            onError: (error) => {
                setError("Invalid email");
                console.error("Error resetting password:", error);
            },
            onSuccess: (data) => {
                console.log("Password reset successful:", data);
                navigate("/");
                // Handle successful password reset, e.g., redirect or display a message
            },
        }
    );

    async function handle(val) {
        
        setEmail(val);
        setShow(true);
        mutation.mutate(email);
    }

    return (
        <div>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
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
                <button
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-md mt-4"
                    onClick={() => handle(email)}
                >
                    Reset
                </button>
            </div>
            {show && (
                <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
                </div>
            )}
        </div>
    );
}
