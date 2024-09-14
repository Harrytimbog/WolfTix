"use client";

import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children, initialUser }) => {
  const [currentUser, setCurrentUser] = useState(initialUser);

  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
