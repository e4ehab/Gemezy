"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
import { themes } from "@/app/themes";

const themeValues = Object.fromEntries(
  themes.map(({ id }) => [id, id]),
);

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider value={themeValues} {...props}>
      {children}
    </NextThemesProvider>
  );
}