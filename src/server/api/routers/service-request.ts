import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { serviceRequests, customers } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { rateStructureSchema } from "~/types/index"; // Import the centralized schema
import { ServiceTypeValues, MaterialTypeValues } from "~/types/constants"; // Import enum values

export const serviceRequestRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        customerData: z.object({
          name: z.string(),
          email: z.string().optional(),
          phone: z.string().optional(),
          notes: z.string().optional(),
        }),
        serviceData: z.object({
          address: z.string(),
          latitude: z.string(),
          longitude: z.string(),
          binSize: z.number(),
          serviceType: z.enum(ServiceTypeValues), // Use imported values
          materialType: z.enum(MaterialTypeValues), // Use imported values
          subcontractorId: z.number(),
          rateId: z.number(),
          scheduledStart: z.string(), // ISO string
          scheduledRemoval: z.string().optional(), // ISO string
          appliedRateStructure: rateStructureSchema, // Use imported schema
          specialInstructions: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // First, create or find the customer
      const existingCustomer = await ctx.db
        .select()
        .from(customers)
        .where(eq(customers.email, input.customerData.email ?? ""))
        .limit(1);

      let customerId: number;

      if (existingCustomer.length > 0) {
        customerId = existingCustomer[0]?.id ?? 0;
        // Optionally update customer info here if needed
      } else {
        const [newCustomer] = await ctx.db
          .insert(customers)
          .values({
            name: input.customerData.name,
            email: input.customerData.email,
            phone: input.customerData.phone,
            notes: input.customerData.notes,
          })
          .returning({ id: customers.id });

        customerId = newCustomer?.id ?? 0;
      }

      // Create the service request with the new rate structure
      const [serviceRequest] = await ctx.db
        .insert(serviceRequests)
        .values({
          customerId,
          address: input.serviceData.address,
          latitude: input.serviceData.latitude,
          longitude: input.serviceData.longitude,
          binSize: input.serviceData.binSize,
          serviceType: input.serviceData.serviceType,
          materialType: input.serviceData.materialType,
          subcontractorId: input.serviceData.subcontractorId,
          rateId: input.serviceData.rateId,
          scheduledStart: new Date(input.serviceData.scheduledStart),
          scheduledRemoval: input.serviceData.scheduledRemoval
            ? new Date(input.serviceData.scheduledRemoval)
            : null,
          appliedRateStructure: input.serviceData.appliedRateStructure,
          specialInstructions: input.serviceData.specialInstructions,
        })
        .returning({ serviceRequestId: serviceRequests.id });

      return serviceRequest;
    }),

  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return await ctx.db.query.serviceRequests.findFirst({
      where: (serviceRequests, { eq }) => eq(serviceRequests.id, input),
      with: {
        customer: true,
        subcontractor: true,
      },
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.serviceRequests.findMany({
      with: {
        customer: true,
      },
      orderBy: (serviceRequests, { desc }) => [desc(serviceRequests.createdAt)],
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
