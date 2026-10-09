import { Loader2Icon } from "lucide-react";

interface LoadingStateProps {
  title: string;
  description: string;
}

export function LoadingState({ title, description }: LoadingStateProps) {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center px-6 py-12"
      role="status"
      aria-live="polite"
    >
      <div className="flex max-w-md flex-col items-center gap-5 rounded-2xl bg-background p-8 text-center">
        <Loader2Icon className="size-10 animate-spin text-primary" aria-hidden="true" />
        <div className="space-y-2">
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}