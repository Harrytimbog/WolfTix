import Link from "next/link";
import { getAllTickets } from "./actions/getAllTickets";

export default async function Home() {
  // Fetch all tickets
  const tickets = await getAllTickets();

  // Map over tickets and display them in a table
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>
          <Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link>
        </td>
        <td>{ticket.price}</td>
      </tr>
    );
  });
  return (
    <main className="container mt-5">
      <h1 className="text-center">Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </main>
  );
}
