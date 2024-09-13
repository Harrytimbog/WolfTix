import createServerAxios from "@/lib/buildAxiosServer";

export async function getAllTickets(url) {
  const axiosServer = createServerAxios();

  try {
    // Since Next14 components are all server-side components
    // const url = "/api/tickets/${ticketId}";
    const response = await axiosServer.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all tickets:", error);
    return null;
  }
}
