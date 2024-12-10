import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTableCreator,
  pgEnum,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/* Naming conventions:
- Table names in TS are pluralized and camelCase (`teamRelations`)
- Column names in TS are singular and camelCase (`teamId`)
- All identfiers in Postgres are singular and snake_case (`team_relation` and `team_id`)
- Verbs are present tense (`createTime` instead of `createdTime` or `creationTime`)
- All `time` columns are absolute datatime with timezone, not an offset of some time
*/

export const createTable = pgTableCreator((name) => `bph_site_${name}`);

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

export const unlocks = createTable(
  "unlock",
  {
    id: serial("id").primaryKey(),
    puzzleId: varchar("puzzle_id")
      .notNull()
      .references(() => puzzles.id, { onDelete: "cascade" }),
    teamId: varchar("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    unlockTime: timestamp("unlock_time", { withTimezone: true }),
    // NOTE: Storing the solve time is probably more efficient for querying
    // But it's also generally a bad idea to have the same information
    // in two different places.
    // solveTime: timestamp("solve_time", { withTimezone: true }).notNull(),
  },
  (table) => {
    return {
      team_and_puzzle_idx: index("unlocks_team_puzzle_idx").on(
        table.teamId,
        table.puzzleId,
      ),
    };
  },
);

export const guesses = createTable(
  "guess",
  {
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
  },
  (table) => {
    return {
      team_and_puzzle_idx: index("guesses_team_and_puzzle_idx").on(
        table.teamId,
        table.puzzleId,
      ),
    };
  },
);

export const hints = createTable(
  "hint",
  {
    id: serial("id").primaryKey(),
    puzzleId: varchar("puzzle_id")
      .notNull()
      .references(() => puzzles.id, { onDelete: "cascade" }),
    teamId: varchar("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    request: text("request").notNull(),
    requestTime: timestamp("request_time", { withTimezone: true }),
    claimer: varchar("claimer").references(() => teams.id),
    claimTime: timestamp("claim_time", { withTimezone: true }),
    response: text("response"),
    responseTime: timestamp("response_time", { withTimezone: true }),
    status: hintStatusEnum("status").notNull().default("no_response"),
    // Not included:
    // obsolute statuses
    // notify_emails, discord_id, is_followup
  },
  (table) => {
    return {
      team_and_puzzle_idx: index("hints_team_and_puzzle_idx").on(
        table.teamId,
        table.puzzleId,
      ),
    };
  },
);

export const followUps = createTable(
  "follow_up",
  {
    id: serial("id").primaryKey(),
    hintId: serial("hint_id")
      .notNull()
      .references(() => hints.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    message: text("message").notNull(),
    time: timestamp("time", { withTimezone: true }).notNull(),
  },
  (table) => {
    return {
      hint_idx: index("hint_idx").on(table.hintId),
    };
  },
);

export const errata = createTable(
  "erratum",
  {
    id: serial("id").primaryKey(),
    puzzleId: varchar("puzzle_id")
      .notNull()
      .references(() => puzzles.id, { onDelete: "cascade" }),
    timestamp: timestamp("timestamp", { withTimezone: true })
      .notNull()
      .$defaultFn(() => new Date()),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      puzzle_idx: index("errata_puzzle_idx").on(table.puzzleId),
    };
  },
);

export const feedback = createTable("feedback", {
  id: serial("id").primaryKey(),
  teamId: varchar("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date()),
  description: text("feedback").notNull(),
});

export const teamRelations = relations(teams, ({ many }) => ({
  unlocks: many(unlocks),
  guesses: many(guesses),
  // Hints requested by this team
  requestedHints: many(hints, { relationName: "requested_hints" }),
  // Hints claimed by this admin "team"
  claimedHints: many(hints, { relationName: "claimed_hints" }),
}));

export const puzzleRelations = relations(puzzles, ({ many }) => ({
  unlocks: many(unlocks),
  guesses: many(guesses),
  hints: many(hints),
  errata: many(errata),
}));

export const unlockRelations = relations(unlocks, ({ one }) => ({
  team: one(teams, {
    fields: [unlocks.teamId],
    references: [teams.id],
  }),
  puzzle: one(puzzles, {
    fields: [unlocks.puzzleId],
    references: [puzzles.id],
  }),
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

export const hintRelations = relations(hints, ({ one, many }) => ({
  team: one(teams, {
    fields: [hints.teamId],
    references: [teams.id],
    relationName: "requested_hints",
  }),
  puzzle: one(puzzles, {
    fields: [hints.puzzleId],
    references: [puzzles.id],
  }),
  claimer: one(teams, {
    fields: [hints.claimer],
    references: [teams.id],
    relationName: "claimed_hints",
  }),
  followUps: many(followUps),
}));

export const followUpRelations = relations(followUps, ({ one }) => ({
  hint: one(hints, {
    fields: [followUps.hintId],
    references: [hints.id],
  }),
}));

export const erratumRelations = relations(errata, ({ one }) => ({
  puzzle: one(puzzles, {
    fields: [errata.puzzleId],
    references: [puzzles.id],
  }),
}));
