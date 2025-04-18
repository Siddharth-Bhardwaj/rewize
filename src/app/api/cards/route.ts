import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/server/db";
import { creditCards, cardRewards, categories } from "@/server/db/schema";
import { auth } from "@/server/auth";

// Schema for reward creation with category name
const rewardSchema = z.object({
  categoryName: z.string().min(1), // Changed from categoryId to categoryName
  rewardRate: z.number().positive().or(z.string().min(1)),
  isRotatingReward: z.boolean().optional(),
  quarterActive: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Enhanced schema for card creation and updates
const cardSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  networkType: z.string().min(1),
  annualFee: z.string(),
  description: z.string(),
  rewards: z.array(rewardSchema).optional(),
});

// GET remains unchanged

// POST - create new card with category names
export async function POST(request: Request) {
  try {
    const session = await auth();

    // Check authentication
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body

    const { name, issuer, networkType, annualFee, description, rewards } =
      cardSchema.parse(await request.json());

    // Create new card
    const newCard = await db
      .insert(creditCards)
      .values({
        name,
        issuer,
        networkType,
        annualFee,
        description,
      })
      .returning();

    const cardId = newCard[0].id;
    let createdRewards = [];

    // Process rewards if provided
    if (rewards && rewards.length > 0) {
      // Get all category names
      const categoryNames = rewards.map((reward) => reward.categoryName);

      // Find existing categories by name
      const existingCategories = await db.query.categories.findMany({
        where: (categories, { inArray }) =>
          inArray(categories.name, categoryNames),
      });

      // Create a map of category names to IDs
      const categoryNameToId = new Map<string, string>();
      existingCategories.forEach((cat) => {
        categoryNameToId.set(cat.name, cat.id);
      });

      // Create missing categories
      const missingCategoryNames = categoryNames.filter(
        (name) => !categoryNameToId.has(name)
      );

      for (const categoryName of missingCategoryNames) {
        // Generate a default iconName based on the category name
        const iconName = categoryName.toLowerCase().replace(/\s+/g, "-");

        // Create new category
        const newCategory = await db
          .insert(categories)
          .values({
            name: categoryName,
            iconName,
          })
          .returning();

        categoryNameToId.set(categoryName, newCategory[0].id);
      }

      // Create rewards using the resolved category IDs
      const rewardsData = rewards.map((reward) => ({
        cardId,
        categoryId: categoryNameToId.get(reward.categoryName),
        rewardRate:
          typeof reward.rewardRate === "string"
            ? reward.rewardRate
            : reward.rewardRate.toString(),
        isRotatingReward: reward.isRotatingReward,
        quarterActive: reward.quarterActive,
        startDate: reward.startDate ? new Date(reward.startDate) : undefined,
        endDate: reward.endDate ? new Date(reward.endDate) : undefined,
      }));

      createdRewards = await db
        .insert(cardRewards)
        .values(rewardsData)
        .returning();

      // Join with category information for the response
      const rewardsWithCategories = await Promise.all(
        createdRewards.map(async (reward) => {
          const category = await db.query.categories.findFirst({
            where: eq(categories.id, reward.categoryId),
          });
          return {
            ...reward,
            category,
          };
        })
      );

      createdRewards = rewardsWithCategories;
    }

    // Return card with rewards
    return Response.json(
      {
        card: newCard[0],
        rewards: createdRewards,
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating card:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - update existing card with category names
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    // Check authentication
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get card ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ error: "Card ID is required" }, { status: 400 });
    }

    // Check if card exists
    const existingCard = await db.query.creditCards.findFirst({
      where: eq(creditCards.id, id),
    });

    if (!existingCard) {
      return Response.json({ error: "Card not found" }, { status: 404 });
    }

    // Parse and validate request body
    const partialCardSchema = cardSchema.partial();
    const { rewards, ...cardData } = partialCardSchema.parse(
      await request.json()
    );

    // Update card details
    const updatedCard = await db
      .update(creditCards)
      .set(cardData)
      .where(eq(creditCards.id, id))
      .returning();

    let updatedRewards = [];

    // Process rewards if provided
    if (rewards && rewards.length > 0) {
      // Get all category names
      const categoryNames = rewards.map((reward) => reward.categoryName);

      // Find existing categories by name
      const existingCategories = await db.query.categories.findMany({
        where: (categories, { inArray }) =>
          inArray(categories.name, categoryNames),
      });

      // Create a map of category names to IDs
      const categoryNameToId = new Map<string, string>();
      existingCategories.forEach((cat) => {
        categoryNameToId.set(cat.name, cat.id);
      });

      // Create missing categories
      const missingCategoryNames = categoryNames.filter(
        (name) => !categoryNameToId.has(name)
      );

      for (const categoryName of missingCategoryNames) {
        // Generate a default iconName based on the category name
        const iconName = categoryName.toLowerCase().replace(/\s+/g, "-");

        // Create new category
        const newCategory = await db
          .insert(categories)
          .values({
            name: categoryName,
            iconName,
          })
          .returning();

        categoryNameToId.set(categoryName, newCategory[0].id);
      }

      // Option to replace all rewards
      const shouldReplaceAll = searchParams.get("replaceRewards") === "true";

      if (shouldReplaceAll) {
        // Delete existing rewards
        await db.delete(cardRewards).where(eq(cardRewards.cardId, id));

        // Create new rewards
        const rewardsData = rewards.map((reward) => ({
          cardId: id,
          categoryId: categoryNameToId.get(reward.categoryName),
          rewardRate:
            typeof reward.rewardRate === "string"
              ? reward.rewardRate
              : reward.rewardRate.toString(),
          isRotatingReward: reward.isRotatingReward,
          quarterActive: reward.quarterActive,
          startDate: reward.startDate ? new Date(reward.startDate) : undefined,
          endDate: reward.endDate ? new Date(reward.endDate) : undefined,
        }));

        updatedRewards = await db
          .insert(cardRewards)
          .values(rewardsData)
          .returning();
      } else {
        // Upsert each reward
        for (const reward of rewards) {
          const categoryId = categoryNameToId.get(reward.categoryName);

          const existingReward = await db.query.cardRewards.findFirst({
            where: and(
              eq(cardRewards.cardId, id),
              eq(cardRewards.categoryId, categoryId)
            ),
          });

          if (existingReward) {
            // Update existing reward
            const updated = await db
              .update(cardRewards)
              .set({
                rewardRate:
                  typeof reward.rewardRate === "string"
                    ? reward.rewardRate
                    : reward.rewardRate.toString(),
                isRotatingReward: reward.isRotatingReward,
                quarterActive: reward.quarterActive,
                startDate: reward.startDate
                  ? new Date(reward.startDate)
                  : undefined,
                endDate: reward.endDate ? new Date(reward.endDate) : undefined,
              })
              .where(
                and(
                  eq(cardRewards.cardId, id),
                  eq(cardRewards.categoryId, categoryId)
                )
              )
              .returning();

            updatedRewards.push(updated[0]);
          } else {
            // Create new reward
            const created = await db
              .insert(cardRewards)
              .values({
                cardId: id,
                categoryId,
                rewardRate:
                  typeof reward.rewardRate === "string"
                    ? reward.rewardRate
                    : reward.rewardRate.toString(),
                isRotatingReward: reward.isRotatingReward,
                quarterActive: reward.quarterActive,
                startDate: reward.startDate
                  ? new Date(reward.startDate)
                  : undefined,
                endDate: reward.endDate ? new Date(reward.endDate) : undefined,
              })
              .returning();

            updatedRewards.push(created[0]);
          }
        }
      }

      // Join with category information for the response
      const rewardsWithCategories = await Promise.all(
        updatedRewards.map(async (reward) => {
          const category = await db.query.categories.findFirst({
            where: eq(categories.id, reward.categoryId),
          });
          return {
            ...reward,
            category,
          };
        })
      );

      updatedRewards = rewardsWithCategories;
    }

    return Response.json({
      card: updatedCard[0],
      rewards: updatedRewards.length > 0 ? updatedRewards : undefined,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating card:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
