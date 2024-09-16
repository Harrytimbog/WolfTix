"use client";

import useRequest from "@/hooks/use-request";
import { useRouter } from "next/navigation";

const CreateOrderBtn = ({ ticketId }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId }, // This will be { ticketId: "some_ticket_id" }
    onSuccess: (order) => router.push(`/orders/${order.id}`),
  });

  const handleClick = async () => {
    await doRequest();
  };

  return (
    <div>
      {errors && <div className="alert alert-danger">{errors}</div>}
      <button onClick={handleClick} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

export default CreateOrderBtn;
