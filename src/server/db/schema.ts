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
  foreignKey,
} from "drizzle-orm/pg-core";

/* Naming conventions:
- Table names in TS are pluralized and camelCase (`teamRelations`)
- Column names in TS are singular and camelCase (`teamId`)
- All identfiers in Postgres are singular and snake_case (`team_relation` and `team_id`)
- Verbs are present tense (`createTime` instead of `createdTime` or `creationTime`)
- All `time` columns are absolute datatime with timezone, not an offset of some time
*/

export const createTable = pgTableCreator((name) => `bph_site_${name}`);

// TEAMS, PUZZLES, and GUESSES
export const roleEnum = pgEnum("role", ["admin", "user"]);
export const interactionModeEnum = pgEnum("interaction_type", [
  "in-person",
  "remote",
]);
export const hintStatusEnum = pgEnum("status", [
  "no_response",
  "answered",
  "refunded",
]);

export const teams = createTable("team", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  username: varchar("username", { length: 255 }).notNull(), // For login
  displayName: varchar("display_name", { length: 255 }).notNull(), // For display
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").notNull().default("user"),
  interactionMode: interactionModeEnum("interaction_type").notNull(),
  finishTime: timestamp("finish_time", { withTimezone: true }),

  // Time of creation of team
  createTime: timestamp("create_time", { withTimezone: true }),
  // When this team should start the hunt for early-testing purposes
  // If this is null, the team will start at the global start time
  startTime: timestamp("start_offset", { withTimezone: true }),

  // Not included:
  // allow_time_unlocks, total_hints_awarded, total_free_answers_awarded
  // last_solve_time, is_prerelease_testsolver, is_hidden
});

export const puzzles = createTable("puzzle", {
  // This is also the slug used in URLS to identify this puzzle
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  // Human-readable name that can be changed at any time
  name: varchar("name", { length: 255 }).notNull(),
  answer: varchar("answer", { length: 255 }).notNull(),

  // Not included:
  // body_template, round, order, is_meta, emoji
  // unlock_hours, unlock_global, unlock_local
});

export const guesses = createTable("guess", {
  id: serial("id").primaryKey(),

  puzzleId: varchar("puzzle_id")
    .notNull()
    .references(() => puzzles.id, { onDelete: "cascade" }),

  teamId: varchar("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),

  guess: varchar("guess", { length: 255 }).notNull(),
  isCorrect: boolean("is_correct").notNull(),
  submitTime: timestamp("submit_time", { withTimezone: true }).notNull(),

  // Not included:
  // used_free_answer
});

export const hints = createTable("hint", {
  id: serial("id").primaryKey(),

  puzzleId: varchar("puzzle_id")
    .notNull()
    .references(() => puzzles.id, { onDelete: "cascade" }),

  teamId: varchar("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),

  request: text("request").notNull(),
  requestTime: timestamp("request_time", { withTimezone: true }),

  claimer: varchar("claimer", { length: 255 }),
  claimTime: timestamp("claim_time", { withTimezone: true }),

  response: text("response"),
  responseTime: timestamp("response_time", { withTimezone: true }),

  status: hintStatusEnum("status").notNull().default("no_response"),

  // Not included:
  // refunded or obsolute statuses
  // notify_emails, discord_id, is_followup
});

export const teamRelations = relations(teams, ({ many }) => ({
  guesses: many(guesses),
  hints: many(hints),
}));

export const puzzleRelations = relations(puzzles, ({ many }) => ({
  guesses: many(guesses),
  hints: many(hints),
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

export const hintRelations = relations(hints, ({ one }) => ({
  team: one(teams, {
    fields: [hints.teamId],
    references: [teams.id],
  }),
  puzzle: one(puzzles, {
    fields: [hints.puzzleId],
    references: [puzzles.id],
  }),
}));
