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

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `bph_site_${name}`);

export const interactionTypeEnum = pgEnum("interaction_type", ["in-person", "remote"]);

export const teams = createTable(
  "team",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    finishTime: timestamp("finish_time", { withTimezone: true }),
    interactionType: interactionTypeEnum("interaction_type").notNull(),
  }
)

export const puzzles = createTable(
  "puzzle",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    answer: varchar("answer", { length: 256 }).notNull(),
  }
)

export const guesses = createTable(
  "guess",
  {
    id: serial("id").primaryKey(),
    puzzleId: integer("puzzle_id").notNull().references(() => puzzles.id),
    teamId: integer("team_id").notNull().references(() => teams.id),
    guess: varchar("guess", { length: 256 }).notNull(),
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
