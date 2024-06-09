"use client";

import React, { useState } from "react";
import axios from "axios";

const SignupPage = () => {
  // handle form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post("/api/users/signup", {
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign up</h1>
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
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default SignupPage;
