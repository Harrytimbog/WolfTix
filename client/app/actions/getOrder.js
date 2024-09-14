import createServerAxios from "@/lib/buildAxiosServer";

// Utility to get an order
export async function getOrder(url, headers) {
  const axiosServer = createServerAxios(headers);

  try {
    const response = await axiosServer.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch order data:", error);
    return null;
  }
}
