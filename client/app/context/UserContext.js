"use client";

import { getCurrentUser } from "@/lib/getCurrentUser";
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(); // Create UserContext

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser(); // Fetch user data from your API
      setCurrentUser(user);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext); // Export the context and hook

export { UserContext };
