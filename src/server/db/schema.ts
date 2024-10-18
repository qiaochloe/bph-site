import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  pgEnum,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `bph_site_${name}`);

// TEAMS, PUZZLES, and GUESSES
export const authorizationEnum = pgEnum("authorization_level", ["admin", "user"]);
export const interactionModeEnum = pgEnum("interaction_type", ["in-person", "remote"]);

export const teams = createTable(
  "team",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    authorization: authorizationEnum("authorization_level").notNull().default("user"),
    interactionMode: interactionModeEnum("interaction_type").notNull(),
    finishTime: timestamp("finish_time", { withTimezone: true }),
  }
)

export const puzzles = createTable(
  "puzzle",
  {
    // This is also the name of the puzzle
    id: varchar("name", { length: 255 }).notNull().primaryKey(),
    answer: varchar("answer", { length: 255 }).notNull(),
  }
)

export const guesses = createTable(
  "guess",
  {
    id: serial("id").primaryKey(),
    puzzleId: varchar("puzzle_id").notNull().references(() => puzzles.id),
    teamId: varchar("team_id").notNull().references(() => teams.id),
    guess: varchar("guess", { length: 255 }).notNull(),
    isCorrect: boolean("is_correct").notNull(),
  }
)

export const teamRelations = relations(teams, ({ many }) => ({
  guesses: many(guesses),
}));

export const puzzleRelations = relations(puzzles, ({ many }) => ({
  guesses: many(guesses),
}));

export const guessRelations = relations(guesses, ({ one }) => ({
  team: one(teams, {
    fields: [guesses.teamId],
    references: [teams.id],
  }),
  puzzle: one(puzzles, {
    fields: [guesses.puzzleId],
    references: [puzzles.id],
  }),
}));