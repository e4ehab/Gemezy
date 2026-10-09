type LocationSlugInput = {
  name: string;
  publicId: string;
};

export function slugifyLocationName(name: string) {
  const slug = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || 'location';
}

export function getLocationRouteSlugs<T extends LocationSlugInput>(locations: T[]) {
  const baseSlugCounts = new Map<string, number>();
  for (const location of locations) {
    const baseSlug = slugifyLocationName(location.name);
    baseSlugCounts.set(baseSlug, (baseSlugCounts.get(baseSlug) ?? 0) + 1);
  }

  return new Map(
    locations.map((location) => {
      const baseSlug = slugifyLocationName(location.name);
      const needsSuffix = baseSlug === 'new' || (baseSlugCounts.get(baseSlug) ?? 0) > 1;
      const idSuffix = location.publicId.replace(/^LOC@/, '').toLowerCase();

      return [
        location.publicId,
        needsSuffix ? `${baseSlug}-${idSuffix}` : baseSlug,
      ] as const;
    }),
  );
}

export function isGoogleMapsShareUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;

    return (
      url.hostname === 'share.google' ||
      url.hostname === 'maps.app.goo.gl' ||
      (url.hostname === 'goo.gl' && url.pathname.startsWith('/maps')) ||
      ((url.hostname === 'google.com' || url.hostname.endsWith('.google.com')) &&
        url.pathname.startsWith('/maps'))
    );
  } catch {
    return false;
  }
}

export function getGoogleMapsUrl(location: string) {
  try {
    const url = new URL(location);
    if (isGoogleMapsShareUrl(url.toString())) return url.toString();
  } catch {
    // Plain place names and addresses are valid Google Maps search queries.
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

export function getLocationSharePath(shareId: string) {
  return `/share/locations/${encodeURIComponent(shareId)}`;
}
