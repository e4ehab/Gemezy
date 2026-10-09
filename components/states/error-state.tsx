import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center px-6 py-12"
      role="alert"
    >
      <div className="flex max-w-md flex-col items-center gap-5 rounded-2xl bg-background p-8 text-center">
        <AlertCircleIcon className="size-8 text-destructive" aria-hidden="true" />
        <div className="space-y-2">
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {onRetry && (
          <Button type="button" variant="outline" onClick={onRetry}>
            <RefreshCwIcon />
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}