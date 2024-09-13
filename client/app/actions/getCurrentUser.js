import createServerAxios from "@/lib/buildAxiosServer";
import { headers } from "next/headers";

export async function getCurrentUser() {
  const requestHeaders = headers(); // Obtain headers from the current request context
  const axiosServer = createServerAxios(requestHeaders);

  try {
    const response = await axiosServer.get("/api/users/currentuser");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}
