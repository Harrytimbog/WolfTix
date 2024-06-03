import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  // Destroy the session to log the user out
  req.session = null;
  // Send an empty object to indicate that the user has been logged out
  res.send({});
});

export { router as signoutRouter };
