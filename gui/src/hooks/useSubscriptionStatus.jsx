// src/hooks/useSubscriptionStatus.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useSubscriptionStatus = (email) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/subscription-status`, {
          params: { email },
        });
        setStatus(response.data);
      } catch (err) {
        
        setStatus(404);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchSubscriptionStatus();
    }
  }, [email]);

  return { status, loading, error };
};

export default useSubscriptionStatus;
