import React from 'react';
import AccountNavigation from "../components/AccountNavigation";
import useUserInfo from "../hooks/useUserInfo";
import { MdOutlineWavingHand } from "react-icons/md";
import usesignedin from '../hooks/usesignedin';
import '../../public/css/TextArea.css';
import useSubscriptionStatus from '../hooks/useSubscriptionStatus';
import PaymentHistory from '../stripeservices/PaymentHistory';
import PaymentMethods from '../stripeservices/PaymentMethods';
const Myaccount = () => {
  const { userInfo, loading: userLoading, error: userError } = usesignedin();
  const email = userInfo?.user?.email;
  const { status, loading: statusLoading, error: statusError } = useSubscriptionStatus(email);
  if (userLoading || statusLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-4 border-t-orange-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }
  if(userError || statusError) {
    return (
      <div>Please Sign in</div>
    );
  }

  
  return (
    <div>
      <AccountNavigation />
      
      <div className='zura1'>
        {userInfo && (
          <div className='zura'>
            <p className="flex flex-row justify-center" > Hi,  <strong>{userInfo.user.firstName} {userInfo.user.lastName}</strong> <MdOutlineWavingHand/></p>
            <p>Welcome to your account. Here you can manage your orders, passwords, devices and more.</p>
        
          </div>
        )}
      </div>
    
    </div>
  );
};

export default Myaccount;
