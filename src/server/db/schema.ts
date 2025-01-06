import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
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

export const subcontractors = pgTable("subcontractor", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  contact: varchar("contact", { length: 256 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 256 }),
  location: text("location").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const rates = pgTable("rate", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  subcontractorId: integer("subcontractor_id")
    .references(() => subcontractors.id)
    .notNull(),

  // Service Type Details
  binSize: integer("bin_size").notNull(),
  serviceType: varchar("service_type", {
    enum: ["rolloff", "frontend"],
  }).notNull(),
  materialType: varchar("material_type", {
    enum: ["waste", "recycling", "concrete", "dirt", "mixed"],
  }).notNull(),

  // Core Rates
  baseRate: decimal("base_rate", { precision: 10, scale: 2 }).notNull(),
  dumpFee: decimal("dump_fee", { precision: 10, scale: 2 }),
  rentalRate: decimal("rental_rate", { precision: 10, scale: 2 }),
  tonnageRate: decimal("tonnage_rate", { precision: 10, scale: 2 }),

  effectiveDate: timestamp("effective_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  notes: text("notes"),
});
