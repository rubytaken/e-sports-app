import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return <div className={cn("rounded bg-surface-2 animate-pulse", className)} />;
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface-1 p-4 space-y-3", className)}>
      <Bone className="h-3 w-3/4" />
      <Bone className="h-3 w-1/2" />
    </div>
  );
}

export function MatchSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface-1 p-4">
      <Bone className="h-3 w-16 mb-3" />
      <div className="flex items-center gap-3">
        <Bone className="h-8 w-8 rounded-full shrink-0" />
        <Bone className="h-3 w-20" />
        <div className="ml-auto flex items-center gap-3">
          <Bone className="h-5 w-10" />
        </div>
        <Bone className="h-3 w-20" />
        <Bone className="h-8 w-8 rounded-full shrink-0" />
      </div>
      <Bone className="h-2.5 w-32 mt-3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 rounded bg-surface-2 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 space-y-6">
      <Bone className="h-8 w-48" />
      <Bone className="h-4 w-80" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <MatchSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 space-y-6">
      <Bone className="h-4 w-16" />
      <div className="flex items-center gap-4">
        <Bone className="h-20 w-20 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Bone className="h-6 w-48" />
          <Bone className="h-3 w-32" />
          <Bone className="h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Bone className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <MatchSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface-1 p-4 space-y-3">
      <Bone className="h-2 w-16" />
      <Bone className="h-7 w-20" />
    </div>
  );
}
