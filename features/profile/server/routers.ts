import prisma from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { LOCATION_VISIBILITIES } from '@/features/profile/constants';
import { z } from 'zod';

export const profileRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) =>
    prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: {
        publicId: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        visibility: true,
        accounts: {
          select: {
            providerId: true,
            createdAt: true,
          },
        },
      },
    }),
  ),
  updateVisibility: protectedProcedure
    .input(z.object({ visibility: z.enum(LOCATION_VISIBILITIES) }))
    .mutation(({ ctx, input }) =>
      prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { visibility: input.visibility },
        select: { visibility: true },
      }),
    ),
  updateName: protectedProcedure
    .input(z.object({ name: z.string().trim().min(2).max(100) }))
    .mutation(({ ctx, input }) =>
      prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name },
        select: { name: true },
      }),
    ),
});
