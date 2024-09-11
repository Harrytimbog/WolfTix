import createServerAxios from "./buildAxiosServer";

export async function getCurrentUser() {
  const axiosServer = createServerAxios();

  try {
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
