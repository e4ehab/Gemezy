export const LOCATION_VISIBILITIES = ['PUBLIC', 'PRIVATE', 'SHARED', 'Unlisted'] as const;

export type LocationVisibility = (typeof LOCATION_VISIBILITIES)[number];

export function isLocationVisibility(value: string): value is LocationVisibility {
  return LOCATION_VISIBILITIES.some((visibility) => visibility === value);
}
