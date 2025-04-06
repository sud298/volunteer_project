import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { signJwt, setTokenCookie } from "../../../../lib/auth";

// const prisma = new PrismaClient({
//   log: ['query', 'error', 'warn'],
// });

const prisma = new PrismaClient({ datasources: {  db: { url: "postgresql://postgres:root@localhost:5432/postgres?schema=public" } } });
// Optionally, attach an event listener for more detailed logging.
// prisma.$on('query', (e) => {
//   console.log('Query:', e.query);
//   console.log('Params:', e.params);
//   console.log('Duration:', e.duration, 'ms');
// });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  //console.log("DATABASE_URL:", process.env.DATABASE_URL);
  //console.log("JWT_SECRET:", process.env.JWT_SECRET);

  //console.log("Received request with method:", req.method);
  //console.log("Request body:", req.body);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "admin",
      },
    });

    const token = signJwt({ userId: newUser.id, role: newUser.role });
    //const payload = { userId: "1", role: "admin" };
    //console.log("Hardcoded payload:", payload);
    //const token = signJwt(payload);
    //console.log("JWT token created with hardcoded payload:", token);
    setTokenCookie(res, token);

    return res.status(201).json({ message: "User created", token });
  } catch {
    //console.error("Simple handler error:", error);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await prisma.$disconnect();
  }
}
