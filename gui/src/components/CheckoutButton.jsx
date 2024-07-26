// src/components/CheckoutButton.js
import React from 'react';
import { createCheckoutSession } from '../api';

const CheckoutButton = ({ userId, email, name }) => {
  const handleCheckout = async () => {
    try {
      const { session } = await createCheckoutSession(userId, email, name);
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <button onClick={handleCheckout}>
      Subscribe Now
    </button>
  );
};

export default CheckoutButton;
