import { customerRouter } from "~/server/api/routers/customer";
import { rateRouter } from "~/server/api/routers/rate";
import { subcontractorRouter } from "~/server/api/routers/subcontractor";
import { serviceRequestRouter } from "~/server/api/routers/service-request";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customer: customerRouter,
  rate: rateRouter,
  subcontractor: subcontractorRouter,
  serviceRequest: serviceRequestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
