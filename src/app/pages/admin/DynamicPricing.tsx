export function DynamicPricing() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dynamic Pricing</h2>
        <p className="text-muted-foreground font-medium">Configure automated price modifiers based on demand, time, and special rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 h-[400px] rounded-3xl border-2 border-dashed border-border/50 bg-muted/5 flex items-center justify-center">
          <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">Rule Editor Slot</p>
        </div>
        <div className="lg:col-span-2 h-[400px] rounded-3xl border-2 border-dashed border-border/50 bg-muted/5 flex items-center justify-center">
          <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">Active Rules List</p>
        </div>
      </div>
    </div>
  );
}
