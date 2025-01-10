import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { subcontractors, rates } from "~/server/db/schema";

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
});
