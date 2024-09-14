import createServerAxios from "@/lib/buildAxiosServer";

export async function getSingleTicket(url, headers) {
  const axiosServer = createServerAxios(headers);

  try {
    const response = await axiosServer.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch the ticket:", error);
    return null;
  }
}
