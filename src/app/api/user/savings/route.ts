import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { cardRewards, users } from "@/server/db/schema";

const updateSavingsSchema = z.object({
  cartValue: z.number(),
  cardId: z.string().uuid().min(1),
  categoryId: z.string().uuid().min(1),
});

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 400 });
    }

    const savings = user?.savings ?? "0.00";

    return Response.json(
      { savings: Math.round(parseFloat(savings)) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting savings details:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const { cardId, cartValue, categoryId } = updateSavingsSchema.parse(
      await request.json()
    );

    const cardReward = await db.query.cardRewards.findFirst({
      where: and(
        eq(cardRewards.cardId, cardId),
        eq(cardRewards.categoryId, categoryId)
      ),
    });

    if (!cardReward) {
      return Response.json(
        { error: "No such card exists for this category" },
        { status: 400 }
      );
    }

    const rewardRate = parseFloat(cardReward?.rewardRate);
    const savings = (rewardRate / 100) * cartValue;

    await db
      .update(users)
      .set({
        savings: sql`${users.savings} + ${savings}`,
      })
      .where(eq(users.id, userId));

    return Response.json(
      { message: "Payment simulated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating savings information:", error);
  }
}
