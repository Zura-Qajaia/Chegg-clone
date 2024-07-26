// src/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

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
