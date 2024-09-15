"use client";

import useRequest from "@/hooks/use-request";
import { useRouter } from "next/navigation";

const CreateOrderBtn = ({ ticketId }) => {
  const router = useRouter();
  // Handle order creation
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticketId },
    onSuccess: (order) => router.push(`/orders/${order.id}`),
  });

  return (
    <div>
      <p>{errors}</p>
      <button onClick={(e) => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

export default CreateOrderBtn;
