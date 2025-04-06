// lib/auth.ts
import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = "30m"; // 30 minutes

export interface JwtPayload {
  userId: string;
  role: string;
}

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

export function setTokenCookie(res: NextApiResponse, token: string) {
  res.setHeader(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1800, // 30 minutes in seconds
      path: "/",
    })
  );
}

export function removeTokenCookie(res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    })
  );
}
