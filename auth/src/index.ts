import express from "express";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

// Middlewares

import { errorhandler } from "./middlewares/error-handler";
const app = express();
app.use(json());

// Route handlers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(errorhandler);

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
