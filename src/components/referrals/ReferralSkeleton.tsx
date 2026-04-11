export function ReferralSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-64 rounded-[2.5rem] bg-white/5" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-48 rounded-[2rem] bg-white/5" />
        <div className="h-48 rounded-[2rem] bg-white/5" />
      </div>
      <div className="h-72 rounded-[2rem] bg-white/5" />
      <div className="h-32 rounded-[2.5rem] bg-white/5" />
    </div>
  );
}
