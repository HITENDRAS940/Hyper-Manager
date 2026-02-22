import { useState, useEffect } from "react";
import { managerApi, AdminUser } from "../../api/managerApi";
import { AdminDetailView } from "@/app/pages/manager/AdminDetailView";
import { AddAdminDialog } from "./AddAdminDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Mail, 
  MapPin, 
  Building2, 
  FileText,
  Loader2,
  AlertCircle
} from "lucide-react";

interface AdminManagementProps {
  onResourceClick: (resourceId: number) => void;
}

export function AdminManagement({ onResourceClick }: AdminManagementProps) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(9);
  const [search, setSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await managerApi.getAdmins(page, pageSize);
      setAdmins(response.content);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [page]);

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(search.toLowerCase()) ||
    admin.email.toLowerCase().includes(search.toLowerCase()) ||
    admin.businessName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Admins</h1>
          <p className="text-muted-foreground text-sm">View and oversee all registered administrators</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search admins..." 
              className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <AddAdminDialog onSuccess={fetchAdmins} />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
          <Button variant="ghost" className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10" onClick={fetchAdmins}>
            Retry
          </Button>
        </div>
      )}

      <div className="min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-muted/20 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-border rounded-2xl bg-muted/5 opacity-40">
            <Search className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-lg font-medium text-muted-foreground">No admins found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdmins.map((admin) => (
              <div 
                key={admin.id} 
                className="group relative flex flex-col bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-1 hover:bg-card hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                
                {/* Header: Avatar & Main Info */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0">
                    {admin.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">{admin.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono tracking-tighter overflow-hidden text-ellipsis">ID: {admin.userId}</p>
                  </div>
                </div>

                {/* Content: Contact & Business Details */}
                <div className="space-y-4 flex-grow">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-sm text-foreground/70">
                      <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <span className="truncate">{admin.email}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50 space-y-2">
                    <div className="flex items-start gap-2.5 text-sm">
                      <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{admin.businessName}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{admin.businessAddress}, {admin.city}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: Tax ID & Actions */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-mono text-primary font-bold tracking-tight uppercase">{admin.gstNumber}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setIsDetailOpen(true);
                    }}
                    className="text-primary hover:text-primary hover:bg-primary/10 font-bold text-xs h-9"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="text-foreground font-bold">{filteredAdmins.length}</span> of <span className="text-foreground font-bold">{admins.length}</span> administrators
        </p>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
            className="border-border/50 bg-card/30 backdrop-blur-sm text-muted-foreground hover:bg-muted hover:text-foreground h-10 px-4 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1.5" /> Previous
          </Button>
          
          <div className="flex items-center gap-1.5">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i ? "default" : "ghost"}
                size="icon"
                className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
                  page === i 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setPage(i)}
                disabled={loading}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages - 1 || loading}
            className="border-border/50 bg-card/30 backdrop-blur-sm text-muted-foreground hover:bg-muted hover:text-foreground h-10 px-4 rounded-xl"
          >
            Next <ChevronRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>

      <AdminDetailView 
        admin={selectedAdmin} 
        open={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        onResourceClick={onResourceClick}
      />
    </div>
  );
}
