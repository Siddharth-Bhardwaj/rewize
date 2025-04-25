import { z } from "zod";
import { eq, and, desc, inArray } from "drizzle-orm";

import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { cardRewards, userCards } from "@/server/db/schema";

// Define validation schema for recommendation input
const recommendationSchema = z.object({
  categoryIds: z.array(z.string()).min(1),
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const session = await auth();
    const userId = session?.user?.id;
    const body: unknown = await request.json();
    const { categoryIds } = recommendationSchema.parse(body);

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
          "You don't have any cards yet. Add cards to get recommendations!",
      });
    }

    // Get card IDs and store in map for faster lookup
    const userCardMap = new Map(userCardsList.map((uc) => [uc.cardId, uc]));
    const cardIds = Array.from(userCardMap.keys());

    // Find the best card for the category
    const bestUserRewards = await db.query.cardRewards.findMany({
      where: and(
        inArray(cardRewards.categoryId, categoryIds),
        inArray(cardRewards.cardId, cardIds)
        // Only include cards the user has AND
        // match any of the provided category IDs
      ),
      with: {
        card: true,
        category: true,
      },
      orderBy: [desc(cardRewards.rewardRate)],
    });

    // const uniqueCardsMap = new Map();

    // for (const reward of bestRewards) {
    //   if (!uniqueCardsMap.has(reward.cardId)) {
    //     uniqueCardsMap.set(reward.cardId, reward);
    //   }
    // }

    // const uniqueUserRewards = Array.from(uniqueCardsMap.values());

    // Filter to only cards the user owns and get the best one
    // const userRewards = bestRewards.filter((reward) =>
    //   cardIds.includes(reward.cardId)
    // );

    if (!bestUserRewards?.length) {
      return Response.json({
        message: "None of your cards offer rewards for this category!",
      });
    }

    // Get the best card (highest reward rate)
    // const bestCard = userRewards[0];

    // if (!bestCard) {
    //   return Response.json({
    //     message: "Could not determine the best card for this category.",
    //   });
    // }

    // Find the user card details to get last 4 digits etc.
    // const userCardDetails = userCardsList.filter(
    //   (uc) => uc.cardId === bestCard.cardId
    // );

    const recommendations = bestUserRewards.map((reward) => {
      const userCard = userCardMap.get(reward.cardId);

      return {
        cardId: reward.cardId,
        cardName: reward.card.name,
        issuer: reward.card.issuer,
        lastFourDigits: userCard?.lastFourDigits ?? null,
        nickName: userCard?.nickName ?? null,
        categoryName: reward.category.name,
        rewardRate: reward.rewardRate,
        imageUrl: reward.card.imageUrl,
        message: `Use your ${reward.card.name} for ${reward.rewardRate}% back on ${reward.category.name}`,
      };
    });

    return Response.json({ recommendations });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }

    console.error("Recommendation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
