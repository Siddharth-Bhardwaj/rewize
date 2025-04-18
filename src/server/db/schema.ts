import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
// import { type AdapterAccount } from "next-auth/adapters";
import { type AdapterAccount } from "@auth/core/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  password: d.varchar({ length: 255 }),
}));

// Credit Card Types/Products table
export const creditCards = createTable("credit_card", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  issuer: d.varchar({ length: 255 }).notNull(),
  networkType: d.varchar({ length: 50 }).notNull(), // visa, mastercard, amex, discover, etc.
  annualFee: d.numeric({ precision: 10, scale: 2 }).default("0"),
  description: d.text(),
  imageUrl: d.varchar({ length: 255 }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
}));

// Spending Categories (groceries, dining, travel, etc.)
export const categories = createTable(
  "category",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.text(),
    iconName: d.varchar({ length: 100 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("category_name_idx").on(t.name)],
);

// Card Rewards - linking cards to categories with reward rates
export const cardRewards = createTable(
  "card_reward",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cardId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => creditCards.id, { onDelete: "cascade" }),
    categoryId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    rewardRate: d.numeric({ precision: 5, scale: 2 }).notNull(), // 2.50 = 2.5%
    isRotatingReward: d.boolean().default(false),
    quarterActive: d.integer(), // 1-4 for which quarter the reward is active (if rotating)
    startDate: d.date(), // For limited time promotions
    endDate: d.date(), // For limited time promotions
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("reward_card_idx").on(t.cardId),
    index("reward_category_idx").on(t.categoryId),
    index("card_category_idx").on(t.cardId, t.categoryId), // Composite index
  ],
);

// User's Credit Cards
export const userCards = createTable(
  "user_card",
  (d) => ({
    id: d
      .varchar({ length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cardId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => creditCards.id, { onDelete: "cascade" }),
    lastFourDigits: d.varchar({ length: 4 }),
    nickName: d.varchar({ length: 100 }),
    expiryMonth: d.integer(),
    expiryYear: d.integer(),
    isDefault: d.boolean().default(false),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("user_cards_idx").on(t.userId),
    index("user_card_unique_idx").on(t.userId, t.cardId, t.lastFourDigits), // To prevent duplicates
  ],
);

// Relations

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  userCards: many(userCards),
}));

export const creditCardsRelations = relations(creditCards, ({ many }) => ({
  rewards: many(cardRewards),
  userCards: many(userCards),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  cardRewards: many(cardRewards),
}));

export const cardRewardsRelations = relations(cardRewards, ({ one }) => ({
  card: one(creditCards, {
    fields: [cardRewards.cardId],
    references: [creditCards.id],
  }),
  category: one(categories, {
    fields: [cardRewards.categoryId],
    references: [categories.id],
  }),
}));

export const userCardsRelations = relations(userCards, ({ one }) => ({
  user: one(users, { fields: [userCards.userId], references: [users.id] }),
  card: one(creditCards, {
    fields: [userCards.cardId],
    references: [creditCards.id],
  }),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);
