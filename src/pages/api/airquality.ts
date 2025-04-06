import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: { db: { url: "postgresql://postgres:root@localhost:5432/postgres?schema=public" } },
});

// -----------------------------------------------------------------------------
// Helper: Generate mock data with location filtering
// -----------------------------------------------------------------------------
function generateMockData(records: number, rangeHours: number, sites: string[]) {
  const now = new Date();
  const data = Array.from({ length: records }, (_, i) => {
    const randomOffset = Math.random() * rangeHours;
    const receivedTime = new Date(now.getTime() - randomOffset * 60 * 60 * 1000);

    return {
      id: i + 1,
      sitename: sites[Math.floor(Math.random() * sites.length)],
      receivedtime: receivedTime.toISOString(),
      pm2_5: parseFloat((Math.random() * 50).toFixed(2)),
      pm10: parseFloat((Math.random() * 80).toFixed(2)),
      temperature: parseFloat((Math.random() * 35).toFixed(1)),
      humidity: parseFloat((Math.random() * 100).toFixed(1)),
    };
  });

  return data.sort((a, b) => 
    new Date(a.receivedtime).getTime() - new Date(b.receivedtime).getTime()
  );
}

// -----------------------------------------------------------------------------
// API Handler with Location Filtering
// -----------------------------------------------------------------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  
  if (method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse and validate site filter
    const sites = parseSiteFilter(query.site);
    const rangeValue = parseRangeFilter(query.range);

    // Get latest timestamp
    const latestRecord = await prisma.air_quality.findFirst({
      orderBy: { receivedtime: "desc" },
      select: { receivedtime: true },
    });

    if (!latestRecord?.receivedtime) {
      return res.status(404).json({ message: "No data available" });
    }

    const latestTimestamp = new Date(latestRecord.receivedtime);
    const startDate = calculateStartDate(rangeValue, latestTimestamp);

    // Handle mock data requests
    if (shouldReturnMockData(rangeValue)) {
      const mockData = generateMockData(
        rangeValue === "24h" ? 100 : 200,
        rangeValue === "24h" ? 24 : 7 * 24,
        sites
      );
      return res.status(200).json(filterBySites(mockData, sites));
    }

    // Fetch from database
    const data = await prisma.air_quality.findMany({
      where: {
        receivedtime: { gte: startDate, lte: latestTimestamp },
        sitename: sites.length > 0 ? { in: sites } : undefined,
      },
      orderBy: { receivedtime: "asc" },
    });

    res.status(200).json(filterBySites(data, sites));
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Helper functions
function parseSiteFilter(siteParam: any): string[] {
  if (!siteParam) return [];
  const sites = Array.isArray(siteParam) ? siteParam : [siteParam];
  return sites.flatMap(s => typeof s === "string" ? s.split(',') : []);
}

function parseRangeFilter(rangeParam: any): string {
  if (typeof rangeParam === "string") return rangeParam.toLowerCase();
  if (Array.isArray(rangeParam)) return rangeParam[0]?.toLowerCase() || "";
  return "";
}

function calculateStartDate(range: string, latest: Date): Date {
  const start = new Date(latest);
  switch (range) {
    case "24h": return new Date(start.getTime() - 24 * 60 * 60 * 1000);
    case "7days": return new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "month": start.setMonth(start.getMonth() - 1); return start;
    default: return new Date(0);
  }
}

function shouldReturnMockData(range: string): boolean {
  return range === "24h" || range === "7days";
}

function filterBySites(data: any[], sites: string[]): any[] {
  return sites.length > 0 
    ? data.filter(item => sites.includes(item.sitename))
    : data;
}