import React from "react";
import { getAllOrders } from "../actions/getAllOrders";

const OrdersPage = async () => {
  const orders = await getAllOrders();

  if (orders.length === 0) {
    return (
      <div className="text-center mt-5">
        <h1>You are yet to place any order!</h1>;
      </div>
    );
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
