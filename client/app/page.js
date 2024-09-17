import Link from "next/link";
import { getAllTickets } from "./actions/getAllTickets";
import { getAllOrders } from "./actions/getAllOrders";
import { getCurrentUser } from "./actions/getCurrentUser";
import { OrderStatus } from "@clonedwolftickets/common";

export default async function Home() {
  // Fetch all tickets
  const tickets = await getAllTickets();
  const { currentUser } = await getCurrentUser();

  let availableTickets;

  if (!currentUser) {
    // If user is not logged in, list all tickets
    availableTickets = tickets;
  } else {
    // Fetch user's orders
    const orders = await getAllOrders();
    const completedTicketIds = orders
      .filter((order) => order.status === OrderStatus.Complete)
      .map((order) => order.ticket.id);

    // Filter out tickets that have an order with status "Complete"
    availableTickets = tickets.filter(
      (ticket) => !completedTicketIds.includes(ticket.id)
    );
  }

  // Map over tickets and display them in a table
  const ticketList = availableTickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/${ticket.id}`}>View</Link>
        </td>
      </tr>
    );
  });

  return (
    <main className="container mt-5">
      <h2 className="text-center">Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>

      <Link href="/tickets/new" className="btn btn-primary">
        Create Ticket
      </Link>
    </main>
  );
}
