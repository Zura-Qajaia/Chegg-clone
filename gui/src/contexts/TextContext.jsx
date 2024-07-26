import React, { createContext, useState, useContext } from 'react';

const TextContext = createContext();
export const TextProvider = ({ children }) => {
  const [tex, setTex] = useState(" ");

  const value = {
    tex,
    setTex,
  };

  return (
    <TextContext.Provider value={value}>
      {children}
    </TextContext.Provider>
  );
};


export const useText = () => {
  return useContext(TextContext);
};
