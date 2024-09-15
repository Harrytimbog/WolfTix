"use client";

import { useUser } from "@/app/context/UserContext";
import StripeCheckout from "react-stripe-checkout";

const StripeCheckoutComponent = ({ order }) => {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const { currentUser } = useUser();

  // Make sure currentUser is available before rendering
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <StripeCheckout
      token={(token) => console.log(token)}
      stripeKey={stripePublishableKey}
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
  );
};

export default StripeCheckoutComponent;
