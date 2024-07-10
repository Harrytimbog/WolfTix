import createServerAxios from "@/lib/buildAxiosServer";
import axios from "axios";
import { headers } from "next/headers";
import React from "react";

export default async function Home() {
  // Get User
  const user = await getUser();
  // console.log(user);
  return (
    <main className="container mt-5">
      <h1 className="text-center">
        Hello Microservices: I need to go to RGU tomorrow
      </h1>

      {user.currentUser ? (
        <h4>You are signed in</h4>
      ) : (
        <h4>You are not signed in</h4>
      )}
    </main>
  );
}

export async function getUser() {
  const axiosServer = createServerAxios(); // Use the custom Axios instance

  try {
    // const url =
    //   typeof window === "undefined"
    //     ? "/api/users/currentUser" // Server-side URL, axios instance is already configured with baseURL
    //     : "/api/users/currentUser"; // Client-side URL, relative because the same instance handles it.

    // Since Next14 components are all server-side components
    const url = "/api/users/currentUser";
    const response = await axiosServer.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}
