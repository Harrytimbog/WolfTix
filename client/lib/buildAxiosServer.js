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
    // baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local", // I used in development
    baseURL: "http://clonedwolf-ticketing-app.site",
    headers: {
      ...headersObj,
      Host: "www.clonedwolf-ticketing-app.site",
    },
  });
};

export default createServerAxios;
