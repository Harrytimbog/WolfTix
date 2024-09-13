"use server";

import axios from "axios";

const createServerAxios = (headers) => {
  const headersObj = {};

  if (headers) {
    headers.forEach((value, key) => {
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
