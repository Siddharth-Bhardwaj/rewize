import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { userCards, creditCards } from "@/server/db/schema";

// Schema for adding a card to user's collection
const addCardSchema = z.object({
  cardId: z.string().uuid().min(1),
  userId: z.string().uuid().min(1), // Added userId to request body
});

// POST - Add a card to user's collection
export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const { cardId, userId } = addCardSchema.parse(await request.json());

    // Check if the card exists
    const card = await db.query.creditCards.findFirst({
      where: eq(creditCards.id, cardId),
    });

    if (!card) {
      return Response.json({ error: "Card not found" }, { status: 404 });
    }

    // Check if user already has this card
    const existingUserCard = await db.query.userCards.findFirst({
      where: and(eq(userCards.userId, userId), eq(userCards.cardId, cardId)),
    });

    if (existingUserCard) {
      return Response.json(
        { error: "Card already added to your collection" },
        { status: 409 }
      );
    }

    // Add card to user's collection
    const userCard = await db
      .insert(userCards)
      .values({
        userId,
        cardId,
      })
      .returning();

    return Response.json({ userCard: userCard[0] }, { status: 201 });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error adding card to user:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Remove a card from user's collection
export async function DELETE(request: Request) {
  try {
    // Get params from URL
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get("cardId");
    const userId = searchParams.get("userId");

    if (!cardId) {
      return Response.json({ error: "Card ID is required" }, { status: 400 });
    }

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if the user-card association exists
    const existingUserCard = await db.query.userCards.findFirst({
      where: and(eq(userCards.userId, userId), eq(userCards.cardId, cardId)),
    });

    if (!existingUserCard) {
      return Response.json(
        { error: "Card not found in your collection" },
        { status: 404 }
      );
    }

    // Remove card from user's collection
    await db
      .delete(userCards)
      .where(and(eq(userCards.userId, userId), eq(userCards.cardId, cardId)));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error removing card from user:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET - Get all cards for a user
export async function GET(request: Request) {
  try {
    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get user's cards with card details
    const userCardList = await db.query.userCards.findMany({
      where: eq(userCards.userId, userId),
      with: {
        card: true,
      },
    });

    return Response.json({
      cards: userCardList.map((uc) => uc.card),
    });
  } catch (error) {
    console.error("Error fetching user cards:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
