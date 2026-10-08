'use client';

import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

//-------------------------------------------------------------------------------------------------------------------------------------//
// "fetch all my workflows from the server, block until they're ready, and give me back fully typed data."
export function useSuspenseProfile() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.profile.me.queryOptions());
}
//-------------------------------------------------------------------------------------------------------------------------------------//
/* Hook to update profile visibility */
export function useUpdateProfileVisibility() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.profile.updateVisibility.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(trpc.profile.me.queryFilter()),
    }),
  );
}
//-------------------------------------------------------------------------------------------------------------------------------------//
/* Hook to update profile name */
export function useUpdateProfileName() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.profile.updateName.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(trpc.profile.me.queryFilter()),
    }),
  );
}
