"use client";

import React, { useState } from "react";
import useRequest from "@/hooks/use-request";
import { useRouter } from "next/navigation";

const NewTicket = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => router.push("/"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  // onblur event to convert price to number
  const onBlur = () => {
    const value = parseFloat(price);
    // if value is not a number, return
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control mt-2"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="text"
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary mt-2">Submit</button>
        {errors}
      </form>
    </div>
  );
};

export default NewTicket;
