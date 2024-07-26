import { useState } from "react";
import { GiPadlock } from "react-icons/gi";
import AccountNavigation from "../components/AccountNavigation";
import usesignedin from "../hooks/usesignedin";
import { TiTick } from "react-icons/ti";
import axios from "axios";

export default function Security() {
  const { userInfo, loading, error } = usesignedin();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmNewEmail, setConfirmNewEmail] = useState("");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error...</div>;
  }

  const data = userInfo.user;
  console.log(data._id);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/users/security/${data._id}`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword,
        },
        { withCredentials: true }
      );

      alert("Password updated successfully");
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Error updating password");
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();

    if (newEmail !== confirmNewEmail) {
      alert("Emails do not match");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/users/security/changeemail/${data._id}`,
        {
          newEmail,
          confirmNewEmail,
        },
        { withCredentials: true }
      );

      alert("Email updated successfully");
      userInfo.user.email = newEmail;
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Error updating email");
    }
  };

  return (
    <>
      <AccountNavigation />
      <div className="flex flex-row">
        <div className="flex flex-col md:ml-16">
          <div className="flex flex-row md:ml-8">
            <GiPadlock className="text-3xl" />
            <span className="text-3xl font-bold">Security</span>
          </div>
          <span className="text-xl md:ml-8">Change password</span>
          <form
            className="flex flex-col md:ml-4 md:pt-4 space-y-4 md:w-96 border-4"
            onSubmit={handlePasswordChange}
          >
            <span className="md:ml-4">
              You&apos;re changing the password for:
            </span>
            <span className="font-bold md:ml-4">{data.email}</span>
            <div className="flex flex-col md:mr-4 md:ml-4">
              <label>Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border w-auto border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col md:mr-4 md:ml-4">
              <label>New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border w-auto border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col md:mr-4 md:ml-4">
              <label>Confirm new password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="border w-auto border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="inline-block md:ml-4">
              *Multi-factor authentication required to change password
            </span>
            <ul className="md:ml-4">
              <span className="font-bold">Your password must contain</span>
              <li className="flex flex-row">
                <TiTick />
                <span>At least 6 characters</span>
              </li>
              <li className="flex flex-row">
                <TiTick />
                <span>Uppercase and lowercase letters</span>
              </li>
              <li className="flex flex-row">
                <TiTick />
                <span>Number or special character</span>
              </li>
            </ul>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="px-2 md:mr-24 py-2 rounded-full bg-gray-500 text-white hover:bg-orange-600"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-col">
          <span className="px-32 mt-12">Change email</span>
          <form
            className="flex flex-col pr-4 md:pt-4 pl-4 md:ml-24 space-y-4 md:w-96 border-4"
            onSubmit={handleEmailChange}
          >
            <span>You&apos;re changing the email for:</span>
            <span className="font-bold">{data.email}</span>
            <div className="flex flex-col">
              <label>New email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border w-auto border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label>Confirm new email</label>
              <input
                type="email"
                value={confirmNewEmail}
                onChange={(e) => setConfirmNewEmail(e.target.value)}
                className="border w-auto border-gray-300 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="inline-block">
              *Multi-factor authentication required to change email
            </span>
            <button
              type="submit"
              className="px-2 md:ml-24 py-2 w-32 rounded-full bg-gray-500 text-white hover:bg-orange-600"
            >
              Save changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
