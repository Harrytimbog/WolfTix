import createServerAxios from "@/lib/buildAxiosServer";
import { cookies } from "next/headers";

export async function getAllOrders() {
  const axiosServer = createServerAxios();

  try {
    // Get cookies from the request context
    const cookie = cookies().get("session");

    const url = "/api/orders";
    const response = await axiosServer.get(url, {
      headers: {
        Cookie: `session=${cookie?.value}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return null;
  }
}
