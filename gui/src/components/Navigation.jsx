import { IoEarthOutline } from "react-icons/io5";
import useSubscriptionStatus from "../hooks/useSubscriptionStatus";
import useSignedIn from "../hooks/usesignedin";
import Navigation1 from "./Navigation1";
import UserDropdown from "./UserDropdown";
import { useNavigate } from "react-router-dom";
import useCheckout from "../hooks/useCheckout";
import axios from "axios";
import '../../public/css/Navigation.css'

export default function Navigation() {
  const navigate = useNavigate();
  const { userInfo, loading: userLoading, error: userError } = useSignedIn();
  const email = userInfo?.user?.email;
  const { status, loading: statusLoading, error: statusError } = useSubscriptionStatus(email);
  const { checkoutResponse, loading: checkoutLoading, error: checkoutError } = useCheckout();

 if (userError || statusError || checkoutError) {
  return <Navigation1 />;
}


  if (userLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-4 border-t-orange-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  

  async function handleClick() {
    if (checkoutResponse && userInfo) {
      const customerId = checkoutResponse.session.customer;
      try {
        const response = await axios.post(`http://localhost:3000/users/customer/${userInfo.user._id}`, { customerId });
        console.log('Customer ID updated:', response.data);
      
        window.location.href = checkoutResponse.session.url;
      } catch (error) {
        console.error('Error updating customer ID:', error);
      }
    }
  }

  const options = ["English (US)", "Español"];
  const userOptions = ["My Account", "Return Books", "Sell Books", "Math", "Writing", "Help", "Sign Out"];
 console.log(userInfo);
  return (
    <>
      {userInfo !== null && userInfo.status === "success"  && userInfo.message !== "No token provided" ? (
        <div className="flex justify-between items-center py-3 border-b border-solid border-slate-400 px-4">
          <h1 className="z">Chegg</h1>
          <div className="flex flex-row items-center space-x-4">
            <div className="flex flex-row">
              {status === 404 && (
                <button
                  onClick={handleClick}
                  className="mr-4 rounded-md bg-orange-500 border-spacing-2 border-radius-5 shadow-md"
                >
                  Resubscribe
                </button>
              )}
              <label className="block mr-4 text-gray-700 text-sm font-bold mb-2" htmlFor="select">
                <IoEarthOutline className="text-2xl" />
              </label>
              <select>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <UserDropdown options={userOptions} />
          </div>
        </div>
      ) : (
        <Navigation1 />
      )}
    </>
  );
}
