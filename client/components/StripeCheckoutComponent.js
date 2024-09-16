"use client";

import { useUser } from "@/app/context/UserContext";
import useRequest from "@/hooks/use-request";
import { useRouter } from "next/navigation";
import StripeCheckout from "react-stripe-checkout";

const StripeCheckoutComponent = ({ order }) => {
  const router = useRouter();
  // Get the Stripe publishable key from the environment variables, I used kubernetes secrets
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const { currentUser } = useUser();

  // Make sure currentUser is available before rendering
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const { doRequest, errors } = useRequest({
    url: "/api/payments/new",
    method: "post",
    body: {
      orderId: order.id,
    },
    // onSuccess: (payment) => {
    //   console.log(payment);
    // },
    onSuccess: () => {
      router.push("/orders");
    },
  });

  return (
    <div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={stripePublishableKey}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

export default StripeCheckoutComponent;
