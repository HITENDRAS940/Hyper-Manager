export function ResourceManagement() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Resource Management</h2>
        <p className="text-muted-foreground font-medium">Manage facility inventory, grounds, and court configurations here.</p>
      </div>

      <div className="h-[500px] rounded-3xl border-2 border-dashed border-border/50 bg-muted/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest mb-2">Resource Inventory Placeholder</p>
          <p className="text-sm text-muted-foreground/30">Define and configure your facility's physical assets.</p>
        </div>
      </div>
    </div>
  );
}
