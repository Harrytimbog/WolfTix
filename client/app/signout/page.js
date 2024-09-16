"use client";

import useRequest from "@/hooks/use-request";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useUser } from "@/app/context/UserContext";

const SignOut = () => {
  const router = useRouter();
  const { setCurrentUser } = useUser(); // Get the setter for currentUser
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      setCurrentUser(null); // Clear the currentUser
      router.push("/");
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignOut;
