import { isNotNull } from "drizzle-orm";
import { db } from "@/server/db";
import { creditCards } from "@/server/db/schema";

export async function GET() {
  try {
    // Fetch all cards
    const cards = await db.query.creditCards.findMany({
      where: isNotNull(creditCards.imageUrl),
    });

    return Response.json({ cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
