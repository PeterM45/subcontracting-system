import { sql, relations } from "drizzle-orm";
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
  // Existing fields
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  customerId: integer("customer_id").references(() => customers.id),

  // Location (from Mapbox)
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),

  // Service Info
  binSize: integer("bin_size").notNull(),
  serviceType: varchar("service_type", { enum: ServiceType }).notNull(),
  materialType: varchar("material_type", { enum: MaterialType }).notNull(),

  // Subcontractor and Rate Reference
  subcontractorId: integer("subcontractor_id")
    .references(() => subcontractors.id)
    .notNull(),
  rateId: integer("rate_id")
    .references(() => rates.id)
    .notNull(),

  // Service Schedule
  scheduledStart: timestamp("scheduled_start", {
    withTimezone: true,
  }).notNull(),
  scheduledRemoval: timestamp("scheduled_removal", { withTimezone: true }),

  // Pricing Adjustments (can override rate table values)
  appliedBaseRate: decimal("applied_base_rate", {
    precision: 10,
    scale: 2,
  }).notNull(),
  appliedDumpFee: decimal("applied_dump_fee", { precision: 10, scale: 2 }),
  appliedRentalRate: decimal("applied_rental_rate", {
    precision: 10,
    scale: 2,
  }),
  appliedAdditionalCost: decimal("applied_additional_cost", {
    precision: 10,
    scale: 2,
  }),

  // Additional Fields
  specialInstructions: text("special_instructions"),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const customersRelations = relations(customers, ({ many }) => ({
  serviceRequests: many(serviceRequests),
}));

export const serviceRequestsRelations = relations(
  serviceRequests,
  ({ one }) => ({
    customer: one(customers, {
      fields: [serviceRequests.customerId],
      references: [customers.id],
    }),
  }),
);
