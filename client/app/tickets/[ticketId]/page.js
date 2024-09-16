import { headers as nextHeaders } from "next/headers";
import { getSingleTicket } from "@/app/actions/getSingleTicket";
import CreateOrderBtn from "@/components/createOrderBtn";
import { sign } from "jsonwebtoken";

const TicketShowPage = async ({ params }) => {
  const { ticketId } = params; // Get the ticketId from the dynamic route

  // Get the headers from the request context
  const requestHeaders = nextHeaders();

  // Construct the URL for fetching the single ticket
  const url = `/api/tickets/${ticketId}`;

  // Fetch the ticket data
  const ticket = await getSingleTicket(url, requestHeaders);
  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      <CreateOrderBtn ticketId={ticket.id} />
    </div>
  );
};

export default TicketShowPage;
