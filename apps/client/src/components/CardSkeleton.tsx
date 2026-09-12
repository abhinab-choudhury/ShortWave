import { Skeleton } from "@/components/ui/skeleton";
export function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 w-full min-w-0">
      <Skeleton className="h-[8.5rem] w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    </div>
  );
}
