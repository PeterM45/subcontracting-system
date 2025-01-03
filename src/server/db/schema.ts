import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const customers = pgTable(
  "customer",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }),
    phone: varchar("phone", { length: 20 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    emailIndex: index("email_idx").on(table.email),
  }),
);
