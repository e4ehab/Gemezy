import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import { headers } from 'next/headers';
import superjson from 'superjson';
import { auth } from '@/lib/auth';

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return { session };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
   transformer: superjson,
});
 
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx: { ...ctx, session: ctx.session } });
});
