import axios from "axios";
import React from "react";

export default async function Home() {
  // Get User
  const user = await getUser();

  return (
    <main className="container mt-5">
      <h1 className="text-center">
        Hello Microservices: I need to go to RGU tomorrow
      </h1>
    </main>
  );
}

export async function getUser() {
 // Reach our ingress-nginx-controller service from inside the client pod
  const serviceName = http://ingress-nginx-controller.ingress-nginx.svc.cluster.local;


  const response = await axios.get(`${serviceName}/api/users/currentUser`);

  return response.data;
}
