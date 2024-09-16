"use client";

import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children, initialUser }) => {
  const [currentUser, setCurrentUser] = useState(initialUser);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
