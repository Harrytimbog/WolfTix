import axios from "axios";
import { headers } from "next/headers";
import React from "react";

export default async function Home() {
  // Get User
  const user = await getUser();
  console.log(user);
  return (
    <main className="container mt-5">
      <h1 className="text-center">
        Hello Microservices: I need to go to RGU tomorrow
      </h1>
    </main>
  );
}

export async function getUser() {
  const GET = async (url) => {
    const headersObj = {};

    const headersList = headers().forEach((header, key) => {
      headersObj[key] = header;
    });

    const res = await axios.get(url, { headers: headersObj }).catch((err) => {
      console.log(err);
    });
    return res;
  };

  const onTheServer = typeof window === "undefined";

  if (onTheServer) {
    // Reach our ingress-nginx-controller service from inside the client pod
    const serviceName =
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";

    const { data } = await GET(`${serviceName}/api/users/currentUser`);

    return data;
  } else {
    // We are on the browser

    // request can be made with a base url of ''
    const { data } = await GET("/api/users/currentUser");
    return data;
  }
  return {};
}
