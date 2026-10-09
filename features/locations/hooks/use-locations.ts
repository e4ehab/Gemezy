'use client';

import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

export function useSuspenseLocation(slug: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.locations.getBySlug.queryOptions({ slug }));
}

export function useCreateLocation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.locations.create.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(trpc.locations.getMany.queryFilter()),
    }),
  );
}

export function useUpdateLocation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.locations.update.mutationOptions({
      onSuccess: async (_location, input) => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.locations.getMany.queryFilter()),
          queryClient.invalidateQueries(
            trpc.locations.getBySlug.queryFilter({ slug: input.slug }),
          ),
        ]);
      },
    }),
  );
}

export function useDeleteLocation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.locations.delete.mutationOptions({
      onSuccess: async (_result, input) => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.locations.getMany.queryFilter()),
          queryClient.removeQueries({
            queryKey: trpc.locations.getBySlug.queryKey({ slug: input.slug }),
          }),
        ]);
      },
    }),
  );
}

export function useUpdateLocationVisibility() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.locations.updateVisibility.mutationOptions({
      onSuccess: async (_location, input) =>
        queryClient.invalidateQueries(
          trpc.locations.getBySlug.queryFilter({ slug: input.slug }),
        ),
    }),
  );
}
