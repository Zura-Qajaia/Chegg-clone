// src/components/PaymentMethods.js
import React, { useState, useEffect } from 'react';
import { getPaymentMethods } from './apiService';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import AccountNavigation from '../components/AccountNavigation';
import usesignedin from '../hooks/usesignedin';

const PaymentMethods = () => {
  const { userInfo, loading: userLoading, error: userError } = usesignedin();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!userInfo) return;
      try {
        const data = await getPaymentMethods(userInfo.user.email);
        setPaymentMethods(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchPaymentMethods();
    }
  }, [userInfo]);

  if (userLoading || loading) return <div>Loading...</div>;
  if (userError || error) return <div>Error: {userError || error}</div>;

  const getCardLogo = (brand) => {
    switch (brand) {
      case 'visa':
        return <FaCcVisa className="text-blue-600 text-3xl" />;
      case 'mastercard':
        return <FaCcMastercard className="text-red-600 text-3xl" />;
      case 'amex':
        return <FaCcAmex className="text-blue-800 text-3xl" />;
      case 'discover':
        return <FaCcDiscover className="text-orange-600 text-3xl" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <AccountNavigation />
      <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
      <ul className="space-y-4 border-4 border-gray-300 p-4 rounded-lg">
        {paymentMethods.map((method) => (
          <li key={method.id} className="p-4 border border-gray-300 rounded-lg shadow flex items-center">
            {getCardLogo(method.card.brand)}
            <div className="ml-4">
              <p><strong>Brand:</strong> {method.card.brand}</p>
              <p><strong>Last4:</strong> ***{method.card.last4}</p>
              <p><strong>Expiry:</strong> {method.card.exp_month}/{method.card.exp_year}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMethods;
