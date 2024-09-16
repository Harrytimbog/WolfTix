"use client";

import React, { useState, useEffect } from "react";
import useRequest from "@/hooks/use-request";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

const SigninForm = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUser();

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: { email, password },
    onSuccess: (user) => {
      setCurrentUser(user); // Update the user context
      router.push("/");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div className="container mt-5">
      <div className="row justify-center">
        <div className="col-md-8">
          <h1 className="text-center">Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
              />
            </div>
            {errors}
            <button className="btn btn-primary mt-2">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
