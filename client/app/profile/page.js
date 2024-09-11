"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation"; // Next.js 13+ uses this for navigation
import { useUser } from "../context/UserContext";

const ProfilePage = () => {
  const { currentUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {currentUser.email}</p>
    </div>
  );
};

export default ProfilePage;
