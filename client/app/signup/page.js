"use client";

import React, { useState } from "react";
import axios from "axios";
import useRequest from "@/hooks/use-request";

const SignupPage = () => {
  // handle form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/signup", {
        email,
        password,
      });
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.errors);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-center">
        <div className="col-md-8">
          <h1 className="text-center">Sign up</h1>

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
            {errors && (
              <div className="alert alert-danger mt-2">
                <h4>Ooops....</h4>
                <ul className="my-0">
                  {errors.map((error) => (
                    <li key={error.message}>{error.message}</li>
                  ))}
                </ul>
              </div>
            )}
            <button className="btn btn-primary mt-2">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
