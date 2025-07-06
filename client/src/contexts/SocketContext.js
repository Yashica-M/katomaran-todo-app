import React, { createContext, useContext } from 'react';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket: null, connected: false }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
