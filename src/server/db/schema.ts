import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
} from "drizzle-orm/pg-core";
import { ServiceType, MaterialType } from "@/lib/types";

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
    enum: ServiceType,
  }).notNull(),
  materialType: varchar("material_type", {
    enum: MaterialType,
  }).notNull(),

  // Core Rates
  baseRate: decimal("base_rate", { precision: 10, scale: 2 }).notNull(),
  dumpFee: decimal("dump_fee", { precision: 10, scale: 2 }),
  rentalRate: decimal("rental_rate", { precision: 10, scale: 2 }),
  additionalCost: decimal("additional_cost", { precision: 10, scale: 2 }),

  effectiveDate: timestamp("effective_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  notes: text("notes"),
});

export const customers = pgTable("customer", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }),
  phone: varchar("phone", { length: 20 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const serviceRequests = pgTable("service_request", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  customerId: integer("customer_id").references(() => customers.id),

  // Location (from Mapbox)
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),

  // Service Info
  binSize: integer("bin_size").notNull(),
  serviceType: varchar("service_type", {
    enum: ServiceType,
  }).notNull(),
  materialType: varchar("material_type", {
    enum: MaterialType,
  }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
