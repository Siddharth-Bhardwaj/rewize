import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";

import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { cardRewards, userCards } from "@/server/db/schema";

// Define validation schema for recommendation input
const recommendationSchema = z.object({
  categoryId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const session = await auth();
    const userId = session?.user?.id;
    const body: unknown = await request.json();
    const { categoryId } = recommendationSchema.parse(body);

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get user's cards
    const userCardsList = await db.query.userCards.findMany({
      where: eq(userCards.userId, userId),
      with: {
        card: true,
      },
    });

    if (!userCardsList?.length) {
      return Response.json({
        message:
          "You don't have any cards yet. Add cards to get recommendations.",
      });
    }

    // Get card IDs
    const cardIds = userCardsList.map((uc) => uc.cardId);

    // Find the best card for the category
    const bestRewards = await db.query.cardRewards.findMany({
      where: and(
        eq(cardRewards.categoryId, categoryId)
        // Only include cards the user has
        // This is simplified - in SQL we'd use "IN" but here we're just finding all matching rewards
      ),
      with: {
        card: true,
        category: true,
      },
      orderBy: [desc(cardRewards.rewardRate)],
    });

    // Filter to only cards the user owns and get the best one
    const userRewards = bestRewards.filter((reward) =>
      cardIds.includes(reward.cardId)
    );

    if (!userRewards?.length) {
      return Response.json({
        message: "None of your cards offer rewards for this category.",
      });
    }

    // Get the best card (highest reward rate)
    const bestCard = userRewards[0];

    if (!bestCard) {
      return Response.json({
        message: "Could not determine the best card for this category.",
      });
    }

    // Find the user card details to get last 4 digits etc.
    const userCardDetails = userCardsList.find(
      (uc) => uc.cardId === bestCard.cardId
    );

    return Response.json({
      recommendation: {
        cardId: bestCard.cardId,
        cardName: bestCard.card.name,
        issuer: bestCard.card.issuer,
        lastFourDigits: userCardDetails?.lastFourDigits ?? null,
        nickName: userCardDetails?.nickName ?? null,
        categoryName: bestCard.category.name,
        rewardRate: bestCard.rewardRate,
        message: `Use your ${bestCard.card.issuer} ${bestCard.card.name} for ${bestCard.rewardRate}% back on ${bestCard.category.name}`,
      },
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }

    console.error("Recommendation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
