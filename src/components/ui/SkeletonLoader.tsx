import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  lines?: number;
  height?: "sm" | "md" | "lg";
}

export const Skeleton = ({ className, lines = 1, height = "md" }: SkeletonProps) => {
  const heights = {
    sm: "h-3",
    md: "h-4",
    lg: "h-6"
  };

  if (lines === 1) {
    return (
      <div
        className={cn(
          "loading-skeleton rounded-md animate-pulse",
          heights[height],
          className
        )}
      />
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "loading-skeleton rounded-md animate-pulse",
            heights[height],
            i === lines - 1 && "w-3/4" // Last line shorter
          )}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="p-4 border rounded-lg space-y-3">
    <Skeleton height="lg" className="w-1/2" />
    <Skeleton lines={3} />
    <div className="flex gap-2 pt-2">
      <Skeleton className="w-20 h-8" />
      <Skeleton className="w-16 h-8" />
    </div>
  </div>
);

export const SkeletonList = ({ items = 3 }: { items?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);