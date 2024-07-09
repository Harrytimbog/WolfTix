import jwt from "jsonwebtoken";
import { parse } from "cookie";

export function parseCookies(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return {};
  return parse(cookieHeader);
}

export async function validateToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
}
