import { Skeleton } from "@/components/ui/skeleton";
export function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-50 w-[100%] rounded-xl bg-gray-500/10" />
    </div>
  );
}
