import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { rates } from "~/server/db/schema";
import { validateRateStructure } from "@/lib/rate-utils";
import { TRPCError } from "@trpc/server";
import { rateStructureSchema } from "~/types/index"; // Import the centralized schema
import { ServiceTypeValues, MaterialTypeValues } from "~/types/constants"; // Import enum values

export const rateRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.rates.findMany();
  }),

  getBySubcontractor: publicProcedure
    .input(z.object({ subcontractorId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.rates.findMany({
        where: eq(rates.subcontractorId, input.subcontractorId),
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        subcontractorId: z.number(),
        binSize: z.number(),
        serviceType: z.enum(ServiceTypeValues), // Use imported values
        materialType: z.enum(MaterialTypeValues), // Use imported values
        rateStructure: rateStructureSchema, // Use imported schema
        effectiveDate: z.date(),
        expiryDate: z.date().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Additional validation using our utility function
      if (!validateRateStructure(input.rateStructure)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid rate structure",
        });
      }

      const [newRate] = await ctx.db
        .insert(rates)
        .values({
          subcontractorId: input.subcontractorId,
          binSize: input.binSize,
          serviceType: input.serviceType,
          materialType: input.materialType,
          rateStructure: input.rateStructure,
          effectiveDate: input.effectiveDate,
          expiryDate: input.expiryDate,
          notes: input.notes,
        })
        .returning();

      return newRate;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        binSize: z.number(),
        serviceType: z.enum(ServiceTypeValues), // Use imported values
        materialType: z.enum(MaterialTypeValues), // Use imported values
        rateStructure: rateStructureSchema, // Use imported schema
        effectiveDate: z.date(),
        expiryDate: z.date().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Additional validation using our utility function
      if (!validateRateStructure(input.rateStructure)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid rate structure",
        });
      }

      const [updatedRate] = await ctx.db
        .update(rates)
        .set({
          binSize: input.binSize,
          serviceType: input.serviceType,
          materialType: input.materialType,
          rateStructure: input.rateStructure,
          effectiveDate: input.effectiveDate,
          expiryDate: input.expiryDate,
          notes: input.notes,
        })
        .where(eq(rates.id, input.id))
        .returning();

      return updatedRate;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(rates).where(eq(rates.id, input.id));
      return input.id;
    }),
});
