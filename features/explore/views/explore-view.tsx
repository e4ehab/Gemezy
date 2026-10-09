"use client";

import { SparklesIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ExploreView() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-7 sm:px-6 sm:py-8 lg:px-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-primary">Discover</p>
        <h1 className="text-3xl font-semibold tracking-tight">Explore public places</h1>
        <p className="text-muted-foreground">
          Places shared publicly by the Gemezy community.
        </p>
      </header>

      <Card className="mx-auto max-w-xl border-dashed bg-card/60 text-center">
        <CardHeader className="items-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SparklesIcon className="size-6" aria-hidden="true" />
          </span>
          <CardTitle className="text-xl">Coming soon</CardTitle>
          <CardDescription>
            Explore public places shared by the Gemezy community. This feature is
            still in the works.
          </CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}