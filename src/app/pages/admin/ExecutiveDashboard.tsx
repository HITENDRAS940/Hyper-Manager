export function ExecutiveDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Executive Overview</h2>
        <p className="text-muted-foreground font-medium">Performance analytics and operational insights will appear here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-3xl border-2 border-dashed border-border/50 bg-muted/5 flex items-center justify-center">
            <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">KPI Slot {i}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[400px] rounded-3xl border-2 border-dashed border-border/50 bg-muted/5 flex items-center justify-center">
          <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">Revenue Analytics Placeholder</p>
        </div>
        <div className="h-[400px] rounded-3xl border-2 border-dashed border-border/50 bg-muted/5 flex items-center justify-center">
          <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">Activity Feed Placeholder</p>
        </div>
      </div>
    </div>
  );
}