import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request) {
  const cookieHeader = request.headers.get("cookie");

  // Redirect to sign-in page if there is no cookie header
  if (!cookieHeader) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Extract the session cookie from the cookie header
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => cookie.split("="))
  );
  const token = cookies["session"];

  // Redirect to sign-in page if there is no session token
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    // Verify the JWT using the same secret used in your auth service
    const payload = jwt.verify(token, process.env.JWT_KEY);

    // Optionally, attach user info to the request for further use in your application
    request.user = payload;

    // Continue to the requested page if verification is successful
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    // Redirect to sign-in if JWT verification fails
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: [], // Apply the middleware to /profile and any route under /protected/
};
