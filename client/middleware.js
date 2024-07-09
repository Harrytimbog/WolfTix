import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Parse the cookie header manually to get the session cookie
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => cookie.split("="))
  );
  const token = cookies["session"];

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // matcher: ['/protected/:path*'], // Define the routes that need authentication
  matcher: ["/profile"], // Define the routes that need authentication
};
