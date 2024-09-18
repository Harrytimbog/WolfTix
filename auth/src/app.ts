import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

// Middlewares
import { errorHandler, NotFoundError } from "@clonedwolftickets/common";

const app = express();
// Trust the ingress-nginx proxy
app.set("trust proxy", true);
app.use(json());

// Disable the secure flag for the cookie session because this services might be needed
// to be accessed from other services that are written in different languages
app.use(
  // cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" }) // I used in development mode
  cookieSession({ signed: false, secure: false }) // I used in production mode before I had HTTPS set up so it doesn't break
);

// Route handlers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

// export the app

export { app };
