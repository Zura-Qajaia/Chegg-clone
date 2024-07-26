// src/hooks/usesignedin.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const usesignedin = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/issignedin", {
          withCredentials: true,
        });
        console.log(userInfo);
        setUserInfo(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading, error };
};

export default usesignedin;
