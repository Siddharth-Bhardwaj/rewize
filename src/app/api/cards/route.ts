import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { creditCards, cardRewards } from "@/server/db/schema";

// Schema for validating the card ID
const cardParamSchema = z.object({
  id: z.string().uuid(),
});

// GET - Retrieve a specific card with its details and rewards
export async function GET(request: Request) {
  try {
    // Extract the card ID from query parameters
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get("id");

    if (!cardId) {
      return Response.json({ error: "Card ID is required" }, { status: 400 });
    }

    // Validate the card ID
    try {
      cardParamSchema.parse({ id: cardId });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { error: "Invalid card ID format" },
          { status: 400 }
        );
      }
    }

    // Get the card details
    const card = await db.query.creditCards.findFirst({
      where: eq(creditCards.id, cardId),
    });

    if (!card) {
      return Response.json({ error: "Card not found" }, { status: 404 });
    }

    // Get the card rewards with categories
    const rewards = await db.query.cardRewards.findMany({
      where: eq(cardRewards.cardId, cardId),
      with: {
        category: true,
      },
    });

    // Format and return the response
    return Response.json({
      card: {
        ...card,
        rewards: rewards.map((reward) => ({
          categoryId: reward.categoryId,
          categoryName: reward.category.name,
          rewardRate: reward.rewardRate,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching card details:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
