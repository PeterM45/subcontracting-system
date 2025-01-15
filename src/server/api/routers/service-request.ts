import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { ServiceType, MaterialType } from "@/lib/types";
import { serviceRequests, customers } from "~/server/db/schema";

export const serviceRequestRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        customerData: z.object({
          name: z.string(),
          email: z.union([z.string().email(), z.string().length(0)]).optional(),
          phone: z.string().optional(),
          notes: z.string().optional(),
        }),
        serviceData: z.object({
          customerId: z.number().optional(),
          address: z.string(),
          latitude: z
            .string()
            .or(z.number())
            .transform((val) =>
              typeof val === "number" ? val.toString() : val,
            ),
          longitude: z
            .string()
            .or(z.number())
            .transform((val) =>
              typeof val === "number" ? val.toString() : val,
            ),
          binSize: z.number(),
          serviceType: z.enum(ServiceType),
          materialType: z.enum(MaterialType),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db
        .insert(customers)
        .values(input.customerData)
        .returning({ id: customers.id });

      const serviceRequest = await ctx.db
        .insert(serviceRequests)
        .values({
          customerId: customer[0]?.id,
          ...input.serviceData,
        })
        .returning({ id: serviceRequests.id });

      return {
        customerId: customer[0]?.id,
        serviceRequestId: serviceRequest[0]?.id,
      };
    }),

  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.query.serviceRequests.findFirst({
      where: (serviceRequests, { eq }) => eq(serviceRequests.id, input),
      with: {
        customer: true,
      },
    });
  }),

  listByCustomer: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.serviceRequests.findMany({
        where: (serviceRequests, { eq }) =>
          eq(serviceRequests.customerId, input),
        orderBy: (serviceRequests, { desc }) => [
          desc(serviceRequests.createdAt),
        ],
      });
    }),
});
