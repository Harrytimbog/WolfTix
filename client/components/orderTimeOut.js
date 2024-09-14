"use client";

import React, { useEffect, useState } from "react";

const OrderTimeOut = ({ message, order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  // Calculate the time left for the order to expire
  useEffect(() => {
    const findTimeLeft = () => {
      const timeLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(timeLeft / 1000));
    };

    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      {message} : {timeLeft} seconds
    </div>
  );
};

export default OrderTimeOut;
