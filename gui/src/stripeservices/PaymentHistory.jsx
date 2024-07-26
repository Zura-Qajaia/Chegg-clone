// src/components/PaymentHistory.js
import React, { useState, useEffect } from 'react';
import { getPaymentHistory } from './apiService';
import AccountNavigation from '../components/AccountNavigation';
import usesignedin from '../hooks/usesignedin';

const PaymentHistory = () => {
  const { userInfo, loading: userLoading, error: userError } = usesignedin();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!userInfo) return;

      try {
        setLoading(true);
        const data = await getPaymentHistory(userInfo.user.email);
        setPaymentHistory(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [userInfo]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  if (userLoading || loading) return <div>Loading...</div>;
  if (userError || error) return <div>Error: {userError || error}</div>;

  return (
    <div>
      <AccountNavigation />
      <h2 className='text-2xl font-bold mb-4'>Payment History</h2>
      <ul className='space-y-4 border-4 border-gray-300 p-4 rounded-lg'>
        {paymentHistory.map((payment) => (
          <li key={payment.id} className='p-4 border border-gray-300 rounded-lg'>
            <p><strong>Amount:</strong> {payment.amount / 100}&euro;</p>
            <p><strong>Description:</strong> {payment.description}</p>
            <p><strong>Status:</strong> {payment.status}</p>
            <p><strong>Order Date:</strong> {formatDate(payment.created)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentHistory;
