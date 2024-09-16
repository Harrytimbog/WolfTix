import React from "react";
import { getAllOrders } from "../actions/getAllOrders";

const OrdersPage = async () => {
  const orders = await getAllOrders();

  if (!orders) {
    return <h1>You are yet to play any order!</h1>;
  }

  return (
    <div>
      <h1>Your Orders</h1>
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              <h2>Order ID: {order.id}</h2>
              <p>
                Ticket Title: {order.ticket.title} - {order.status}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrdersPage;
