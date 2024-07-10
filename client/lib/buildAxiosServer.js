// lib/buildAxiosServer.js
import axios from "axios";
import { headers as nextHeaders } from "next/headers";

const createServerAxios = () => {
  // We can assume headers is fetched server-side; adjust as per actual API if needed.
  const headersObj = {};
  if (typeof window === "undefined") {
    // Ensure this runs server-side
    nextHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });
  }

  return axios.create({
    baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    headers: {
      ...headersObj,
      Host: "wolfticketing.dev",
    },
  });
};

export default createServerAxios;
