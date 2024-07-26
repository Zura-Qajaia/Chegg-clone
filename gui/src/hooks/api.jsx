import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const createCheckoutSession = async (userId, email, name) => {
  const response = await axios.post(`${API_BASE_URL}/create-checkout-session`, {
    userId,
    email,
    name,
  });
  return response.data;
};

export const getSubscriptionStatus = async (email) => {
  const response = await axios.get(`${API_BASE_URL}/subscription-status`, {
    params: { email },
  });
  return response;
};

export const isSignedIn = async () => {
  const response = await axios.get(`${API_BASE_URL}/issignedin`);
  return response.data;
};

export const getPaymentHistory = async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment-history`, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  };
  
  export const getPaymentMethods = async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment-methods`, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  };
