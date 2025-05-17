import { relations } from "drizzle-orm";
import { subcontractors, rates, customers, serviceRequests } from "./schema";

// Relations
export const subcontractorsRelations = relations(
  subcontractors,
  ({ many }) => ({
    rates: many(rates),
    serviceRequests: many(serviceRequests),
  }),
);

export const ratesRelations = relations(rates, ({ one, many }) => ({
  subcontractor: one(subcontractors, {
    fields: [rates.subcontractorId],
    references: [subcontractors.id],
  }),
  serviceRequests: many(serviceRequests),
}));

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
    subcontractor: one(subcontractors, {
      fields: [serviceRequests.subcontractorId],
      references: [subcontractors.id],
    }),
    rate: one(rates, {
      fields: [serviceRequests.rateId],
      references: [rates.id],
    }),
  }),
);
