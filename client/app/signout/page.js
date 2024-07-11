"use client";

import useRequest from "@/hooks/use-request";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SignOut = () => {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignOut;
