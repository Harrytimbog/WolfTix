import createServerAxios from "@/lib/buildAxiosServer";
import axios from "axios";
import { headers } from "next/headers";

export default async function Home() {
  return (
    <main className="container mt-5">
      <h1 className="text-center">
        Hello Microservices: I need to go to RGU tomorrow
      </h1>
    </main>
  );
}
