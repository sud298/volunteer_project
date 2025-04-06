import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

// 1. Create a PrismaClient instance with query logging enabled
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:root@localhost:5432/postgres?schema=public",
    },
  },
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

// 2. Listen for Prisma query events
prisma.$on("query", (e) => {
  console.log("====================================");
  console.log("Query:", e.query);
  console.log("Params:", e.params);
  console.log("Duration:", e.duration, "ms");
  console.log("====================================");
});

// 3. Simple GET handler to fetch all rows from water_quality
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Select * from water_quality
    const data = await prisma.water_quality.findMany();

    const cleanedData = data.map((record) => ({
      ...record,
      payload: record.payload ?? {}, // ✅ Replace null with an empty object
    }));

    res.status(200).json(cleanedData);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
