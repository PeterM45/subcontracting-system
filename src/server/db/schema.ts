import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  jsonb,
  index, // Added
  uniqueIndex, // Added
} from "drizzle-orm/pg-core";

// Import the actual enum values for use in table definitions
import { ServiceTypeValues, MaterialTypeValues } from "@/types/constants";
// Import the types for type checking if needed elsewhere, though $type is used for jsonb
import { type RateStructure } from "@/types/index";

export const subcontractors = pgTable(
  "subcontractor",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    contact: varchar("contact", { length: 256 }),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 256 }), // Consider making this unique if appropriate
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
  },
  (table) => ({
    nameIdx: index("subcontractor_name_idx").on(table.name),
    emailIdx: uniqueIndex("subcontractor_email_idx").on(table.email), // Added unique index for email
  }),
);

export const rates = pgTable(
  "rate",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    subcontractorId: integer("subcontractor_id")
      .references(() => subcontractors.id)
      .notNull(),

    // Service Type Details
    binSize: integer("bin_size").notNull(),
    serviceType: varchar("service_type", {
      enum: ServiceTypeValues, // Use the imported array of values
    }).notNull(),
    materialType: varchar("material_type", {
      enum: MaterialTypeValues, // Use the imported array of values
    }).notNull(),

    // New rate structure using JSON
    rateStructure: jsonb("rate_structure").$type<RateStructure>().notNull(),

    effectiveDate: timestamp("effective_date").notNull(),
    expiryDate: timestamp("expiry_date"),
    notes: text("notes"),
  },
  (table) => ({
    subcontractorIdIdx: index("rate_subcontractor_id_idx").on(
      table.subcontractorId,
    ),
    serviceMaterialBinIdx: index("rate_service_material_bin_idx").on(
      table.serviceType,
      table.materialType,
      table.binSize,
    ),
    effectiveDateIdx: index("rate_effective_date_idx").on(table.effectiveDate),
  }),
);

export const customers = pgTable(
  "customer",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }), // Consider making this unique
    phone: varchar("phone", { length: 20 }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    nameIdx: index("customer_name_idx").on(table.name),
    emailIdx: uniqueIndex("customer_email_idx").on(table.email), // Added unique index for email
  }),
);

export const serviceRequests = pgTable(
  "service_request",
  {
    // Existing fields
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    customerId: integer("customer_id").references(() => customers.id),

    // Location (from Mapbox)
    address: text("address").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 6 }),
    longitude: decimal("longitude", { precision: 10, scale: 6 }),

    // Service Info
    binSize: integer("bin_size").notNull(),
    serviceType: varchar("service_type", {
      enum: ServiceTypeValues,
    }).notNull(), // Use the imported array of values
    materialType: varchar("material_type", {
      enum: MaterialTypeValues,
    }).notNull(), // Use the imported array of values

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

    // Updated pricing structure to match rates
    appliedRateStructure: jsonb("applied_rate_structure")
      .$type<RateStructure>()
      .notNull(),

    // Additional Fields
    specialInstructions: text("special_instructions"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    customerIdIdx: index("sr_customer_id_idx").on(table.customerId),
    subcontractorIdIdx: index("sr_subcontractor_id_idx").on(
      table.subcontractorId,
    ),
    rateIdIdx: index("sr_rate_id_idx").on(table.rateId),
    serviceTypeIdx: index("sr_service_type_idx").on(table.serviceType),
    materialTypeIdx: index("sr_material_type_idx").on(table.materialType),
    scheduledStartIdx: index("sr_scheduled_start_idx").on(table.scheduledStart),
  }),
);

// Relations
