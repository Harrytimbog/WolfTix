
import createServerAxios from "./buildAxiosServer";

export default async function getUser() {
  const axiosServer = createServerAxios();

  try {
    // const url =
    //   typeof window === "undefined"
    //     ? "/api/users/currentUser" // Server-side URL, axios instance is already configured with baseURL
    //     : "/api/users/currentUser"; // Client-side URL, relative because the same instance handles it.

    // Since Next14 components are all server-side components
    const url = "/api/users/currentUser";
    const response = await axiosServer.get(url);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}
