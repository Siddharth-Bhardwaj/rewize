import { db } from "@/server/db";
import { categories, creditCards, cardRewards } from "@/server/db/schema";

async function seedDatabase() {
  console.log("Seeding database...");

  // Seed categories
  const categoryData = [
    { name: "Groceries", iconName: "shopping-cart" },
    { name: "Dining", iconName: "utensils" },
    { name: "Gas", iconName: "gas-pump" },
    { name: "Travel", iconName: "plane" },
    { name: "Entertainment", iconName: "film" },
    { name: "Online Shopping", iconName: "shopping-bag" },
  ];

  console.log("Seeding categories...");
  const seededCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();

  // Map category names to IDs for easier reference
  const categoryMap = seededCategories.reduce(
    (map, cat) => {
      map[cat.name] = cat.id;
      return map;
    },
    {} as Record<string, string>
  );

  // Seed credit cards
  const cardData = [
    {
      name: "Freedom Unlimited",
      issuer: "Chase",
      networkType: "Visa",
      annualFee: "0",
      description:
        "1.5% cash back on all purchases, 3% on dining and drugstores",
    },
    {
      name: "Gold Card",
      issuer: "American Express",
      networkType: "Amex",
      annualFee: "250",
      description: "4x points on restaurants and groceries",
    },
    {
      name: "Platinum Card",
      issuer: "American Express",
      networkType: "Amex",
      annualFee: "695",
      description: "5x points on flights and prepaid hotels",
    },
    {
      name: "Double Cash",
      issuer: "Citi",
      networkType: "Mastercard",
      annualFee: "0",
      description:
        "2% cash back on everything (1% when you buy + 1% when you pay)",
    },
  ];

  console.log("Seeding credit cards...");
  const seededCards = await db.insert(creditCards).values(cardData).returning();

  // Map card names to IDs
  const cardMap = seededCards.reduce(
    (map, card) => {
      map[`${card.issuer} ${card.name}`] = card.id;
      return map;
    },
    {} as Record<string, string>
  );

  // Seed card rewards
  const rewardData = [
    // Chase Freedom Unlimited
    {
      cardId: cardMap["Chase Freedom Unlimited"],
      categoryId: categoryMap.Dining,
      rewardRate: 3.0,
    },
    {
      cardId: cardMap["Chase Freedom Unlimited"],
      categoryId: categoryMap.Gas,
      rewardRate: 1.5,
    },
    {
      cardId: cardMap["Chase Freedom Unlimited"],
      categoryId: categoryMap.Groceries,
      rewardRate: 1.5,
    },

    // Amex Gold
    {
      cardId: cardMap["American Express Gold Card"],
      categoryId: categoryMap.Dining,
      rewardRate: 4.0,
    },
    {
      cardId: cardMap["American Express Gold Card"],
      categoryId: categoryMap.Groceries,
      rewardRate: 4.0,
    },
    {
      cardId: cardMap["American Express Gold Card"],
      categoryId: categoryMap.Travel,
      rewardRate: 3.0,
    },

    // Amex Platinum
    {
      cardId: cardMap["American Express Platinum Card"],
      categoryId: categoryMap.Travel,
      rewardRate: 5.0,
    },

    // Citi Double Cash
    {
      cardId: cardMap["Citi Double Cash"],
      categoryId: categoryMap.Dining,
      rewardRate: 2.0,
    },
    {
      cardId: cardMap["Citi Double Cash"],
      categoryId: categoryMap.Gas,
      rewardRate: 2.0,
    },
    {
      cardId: cardMap["Citi Double Cash"],
      categoryId: categoryMap.Groceries,
      rewardRate: 2.0,
    },
    {
      cardId: cardMap["Citi Double Cash"],
      categoryId: categoryMap.Travel,
      rewardRate: 2.0,
    },
    {
      cardId: cardMap["Citi Double Cash"],
      categoryId: categoryMap.Entertainment,
      rewardRate: 2.0,
    },
    {
      cardId: cardMap["Citi Double Cash"],
      categoryId: categoryMap["Online Shopping"],
      rewardRate: 2.0,
    },
  ];

  console.log("Seeding card rewards...");
  // Filter out rewards with undefined cardId or categoryId and convert rewardRate to string
  const validRewardData = rewardData
    .filter(
      (reward) => reward.cardId !== undefined && reward.categoryId !== undefined
    )
    .map((reward) => ({
      ...reward,
      cardId: reward.cardId!,
      categoryId: reward.categoryId!,
      rewardRate: reward.rewardRate.toString(),
    }));

  await db.insert(cardRewards).values(validRewardData);

  console.log("Database seeding complete!");
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
