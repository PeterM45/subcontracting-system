import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { rates } from "~/server/db/schema";
import { validateRateStructure } from "@/lib/rate-utils";
import { TRPCError } from "@trpc/server";

// Define Zod schemas for the rate structure
const additionalCostSchema = z.object({
  name: z.string(),
  amount: z.number(),
  isPercentage: z.boolean(),
  description: z.string().optional(),
});

const rateStructureSchema = z
  .object({
    flatRate: z.number().optional(),
    baseRate: z.number().optional(),
    dumpFee: z.number().optional(),
    rentalRate: z.number().optional(),
    additionalCosts: z.array(additionalCostSchema),
  })
  .refine(
    (data) => {
      // Ensure either flatRate or baseRate is present, but not both
      return (data.flatRate === undefined) !== (data.baseRate === undefined);
    },
    {
      message: "Must provide either flatRate or baseRate, but not both",
    },
  );

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
        serviceType: z.enum(["rolloff", "frontend"]),
        materialType: z.enum([
          "waste",
          "recycling",
          "concrete",
          "dirt",
          "mixed",
        ]),
        rateStructure: rateStructureSchema,
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
        serviceType: z.enum(["rolloff", "frontend"]),
        materialType: z.enum([
          "waste",
          "recycling",
          "concrete",
          "dirt",
          "mixed",
        ]),
        rateStructure: rateStructureSchema,
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
