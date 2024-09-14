"use client";

import useRequest from "@/hooks/use-request";

const CreateOrderBtn = ({ ticketId }) => {
  console.log(ticketId);
  // Handle order creation
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticketId },
    onSuccess: (order) => console.log(order),
  });

  return (
    <div>
      {errors}
      <button onClick={doRequest} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

export default CreateOrderBtn;
