"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation"; // Next.js 13+ uses this for navigation

const userProfile = ({ currentUser }) => {
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/signin");
    }
  }, [currentUser, router]);

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {currentUser.email}</p>
    </div>
  );
};

export default userProfile;
