import React from "react";
import createServerAxios from "@/lib/buildAxiosServer";
import { headers as nextHeaders } from "next/headers";

const getSingleTicket = async (url, headers) => {
  const axiosInstance = createServerAxios(headers);
  return axiosInstance.get(url);
};

const TicketShowPage = async ({ params }) => {
  const { ticketId } = params; // Get the ticketId from the dynamic route

  // Get headers from the server context
  const headers = nextHeaders();

  // Fetch the ticket data using the ticketId
  const url = `/api/tickets/${ticketId}`;
  const response = await getSingleTicket(url, headers);
  const ticket = response.data;

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
    </div>
  );
};

export default TicketShowPage;
