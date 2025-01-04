import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { subcontractors } from "~/server/db/schema";

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
});
