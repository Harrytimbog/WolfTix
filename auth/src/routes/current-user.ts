import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/currentuser", (req: Request, res: Response) => {
  if (!req.session?.jwt) {
    // If the user is not logged in, return null
    return res.send({ currentUser: null });
  }

  // If the user is logged in, verify the JWT token
  try {
    // If the token is invalid, an error will be thrown
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (error) {
    return res.send({ currentUser: null });
  }

  res.send("Hi there!");
});

export { router as currentUserRouter };
