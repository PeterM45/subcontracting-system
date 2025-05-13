import { z } from "zod";
import { eq, or, gt, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { subcontractors, rates } from "~/server/db/schema";
import { ServiceType, MaterialType } from "~/lib/types";

export const subcontractorRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.subcontractors.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.subcontractors.findFirst({
        where: eq(subcontractors.id, input.id),
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        contact: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        location: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(subcontractors).values({
        ...input,
        latitude: input.latitude.toString(),
        longitude: input.longitude.toString(),
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        contact: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        location: z.string(),
        latitude: z.string(),
        longitude: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db
        .update(subcontractors)
        .set(data)
        .where(eq(subcontractors.id, id));
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // First delete all associated rates
      await ctx.db.delete(rates).where(eq(rates.subcontractorId, input.id));
      // Then delete the subcontractor
      return await ctx.db
        .delete(subcontractors)
        .where(eq(subcontractors.id, input.id));
    }),

  getNearbyWithRates: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        binSize: z.number(),
        serviceType: z.enum(ServiceType),
        materialType: z.enum(MaterialType),
      }),
    )
    .query(async ({ ctx }) => {
      // Get all subcontractors
      const allSubcontractors = await ctx.db.select().from(subcontractors);

      // Get all valid rates
      const validRates = await ctx.db
        .select()
        .from(rates)
        .where(
          or(eq(rates.expiryDate, sql`null`), gt(rates.expiryDate, new Date())),
        )
        .orderBy(rates.effectiveDate);

      // Transform the data
      const result = allSubcontractors.map((subcontractor) => ({
        subcontractor: subcontractor,
        rates: validRates
          .filter((rate) => rate.subcontractorId === subcontractor.id)
          .sort((a, b) => {
            // Sort by effective date only
            return (
              new Date(b.effectiveDate).getTime() -
              new Date(a.effectiveDate).getTime()
            );
          }),
      }));

      return result; // Return all subcontractors, even those without rates
    }),
});
