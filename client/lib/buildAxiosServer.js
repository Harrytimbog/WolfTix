"use server";

import axios from "axios";
import { headers as nextHeaders } from "next/headers";

const createServerAxios = () => {
  const headersObj = {};
  const isServer = typeof window === "undefined";

  if (isServer) {
    // Importing headers within the server check
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
