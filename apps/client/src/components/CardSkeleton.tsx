import { Skeleton } from "@/components/ui/skeleton";
export function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 w-full min-w-0">
      <Skeleton className="h-[140px] sm:h-[160px] w-full rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    </div>
  );
}
