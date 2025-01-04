import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { rates } from "~/server/db/schema";

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
        baseRate: z.number(),
        dumpFee: z.number().optional(),
        rentalRate: z.number().optional(),
        tonnageRate: z.number().optional(),
        effectiveDate: z.date(),
        expiryDate: z.date().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(rates).values({
        ...input,
        baseRate: input.baseRate.toString(),
        dumpFee: input.dumpFee?.toString(),
        rentalRate: input.rentalRate?.toString(),
        tonnageRate: input.tonnageRate?.toString(),
      });
    }),
});
