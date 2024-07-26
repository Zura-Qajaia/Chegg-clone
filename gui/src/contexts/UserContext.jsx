import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [router, setRouter] = useState("overview");

  const value = {
    router,
    setRouter,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  return useContext(UserContext);
};
