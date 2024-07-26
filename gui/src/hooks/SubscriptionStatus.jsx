// src/components/SubscriptionStatus.js
import React, { useEffect, useState } from 'react';
import { getSubscriptionStatus } from './api'; 

const SubscriptionStatus = ({ email }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const result = await getSubscriptionStatus(email);
        setStatus(result.status);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSubscriptionStatus();
  }, [email]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!status) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      Subscription Status: {status}
    </div>
  );
};

export default SubscriptionStatus;
