import { useState, useEffect } from "react";
import { 
  FileText, 
  History, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Save, 
  ChevronRight,
  Loader2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  Check
} from "lucide-react";
import { managerApi, InvoiceTemplate as IInvoiceTemplate } from "../../api/managerApi";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import { ScrollArea } from "../../components/ui/scroll-area";
import { toast } from "sonner";

export function InvoiceTemplate() {
  const [activeTemplate, setActiveTemplate] = useState<IInvoiceTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [activating, setActivating] = useState<number | null>(null);

  // Form State
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");

  const fetchActiveTemplate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await managerApi.getActiveInvoiceTemplate();
      setActiveTemplate(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch active template");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveTemplate();
  }, []);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newContent) {
      toast.error("Please fill in all fields");
      return;
    }

    setCreating(true);
    try {
      await managerApi.createInvoiceTemplate({ name: newName, content: newContent });
      toast.success("New template version created successfully");
      setNewName("");
      setNewContent("");
      // Switch back to active view or refresh
      fetchActiveTemplate();
    } catch (err: any) {
      toast.error(err.message || "Failed to create template");
    } finally {
      setCreating(false);
    }
  };

  const handleActivate = async (version: number) => {
    setActivating(version);
    try {
      await managerApi.activateInvoiceTemplate(version);
      toast.success(`Version ${version} activated`);
      fetchActiveTemplate();
    } catch (err: any) {
      toast.error(err.message || "Failed to activate template");
    } finally {
      setActivating(null);
    }
  };

  const [searchVersion, setSearchVersion] = useState<string>("");
  const [fetchedTemplate, setFetchedTemplate] = useState<IInvoiceTemplate | null>(null);
  const [fetchingVersion, setFetchingVersion] = useState(false);

  const fetchVersion = async () => {
    if (!searchVersion) return;
    setFetchingVersion(true);
    try {
      const resp = await managerApi.getInvoiceTemplateByVersion(parseInt(searchVersion));
      setFetchedTemplate(resp);
    } catch (err: any) {
      toast.error(err.message || "Template version not found");
      setFetchedTemplate(null);
    } finally {
      setFetchingVersion(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-4">
            Invoice Management
            {activeTemplate && (
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-2 py-1 px-3 bg-primary/5 text-primary border-primary/20">
                v{activeTemplate.version} Active
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 opacity-40 text-primary" />
            Create and maintain HTML invoice templates for customer billing
          </p>
        </div>
      </div>

      <Tabs defaultValue="view" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-card/40 backdrop-blur-md border border-border/50 p-1 rounded-2xl h-auto">
            <TabsTrigger value="view" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold transition-all gap-2">
              <Eye className="w-4 h-4" />
              Active Template
            </TabsTrigger>
            <TabsTrigger value="create" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold transition-all gap-2">
              <Plus className="w-4 h-4" />
              New Template
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold transition-all gap-2">
              <History className="w-4 h-4" />
              Version History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="view" className="space-y-6">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4 opacity-50">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Rendering Active Template...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-destructive/5 border border-destructive/10 rounded-[2.5rem] max-w-xl mx-auto">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="text-lg font-bold text-foreground mb-4">{error}</p>
              <Button onClick={fetchActiveTemplate} variant="outline" className="rounded-xl px-8">Retry Fetch</Button>
            </div>
          ) : activeTemplate ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-border/50 rounded-[2.5rem] overflow-hidden bg-card/40 shadow-xl">
                  <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <FileCode className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-black">{activeTemplate.name}</CardTitle>
                          <CardDescription className="text-xs font-medium">Last updated {new Date(activeTemplate.updatedAt).toLocaleString()}</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] uppercase tracking-wider px-3 py-1">
                        Currently Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="bg-white p-8 min-h-[600px] overflow-auto">
                        <div 
                          dangerouslySetInnerHTML={{ __html: activeTemplate.content }} 
                          className="invoice-preview-container max-w-none"
                        />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border border-border/50 rounded-[2.5rem] bg-card/40 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-black flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Template Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em]">Version</p>
                        <p className="text-lg font-bold text-foreground">{activeTemplate.version}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em]">Created By</p>
                        <p className="text-lg font-bold text-foreground">{activeTemplate.createdBy}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em]">Created At</p>
                        <p className="text-lg font-bold text-foreground">{new Date(activeTemplate.createdAt).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <div className="p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-black text-indigo-500 text-sm">Need a change?</p>
                            <p className="text-xs text-indigo-500/70 font-medium tracking-tight">Create a new version to update invoices.</p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border/30 rounded-[3rem] bg-muted/5">
              <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">No active template found</p>
              <Button className="mt-6 rounded-xl" onClick={() => fetchActiveTemplate()}>Check Again</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card className="border border-border/50 rounded-[2.5rem] bg-card/40 shadow-xl max-w-4xl mx-auto overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20 p-8">
                <CardTitle className="text-2xl font-black">Design New Template</CardTitle>
                <CardDescription>Enter HTML content to define the structure and style of your invoices.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateTemplate}>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Template Name</Label>
                  <Input 
                    id="name"
                    placeholder="e.g. Standard Corporate Invoice Feb 2026"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary font-bold px-4"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="content" className="text-xs font-black uppercase tracking-widest text-muted-foreground">HTML Content</Label>
                    <Badge variant="outline" className="text-[9px] font-bold text-primary border-primary/20">Supports TailwindCSS Classes</Badge>
                  </div>
                  <Textarea 
                    id="content"
                    placeholder="<div class='p-8'>...</div>"
                    className="min-h-[400px] bg-background/50 border-border/50 rounded-2xl focus:ring-primary font-mono text-sm shadow-inner p-4"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 border-t border-border/50 p-8 flex justify-end gap-3">
                <Button type="button" variant="ghost" className="rounded-xl px-8 font-bold" disabled={creating} onClick={() => {setNewName(""); setNewContent("");}}>
                  Clear Design
                </Button>
                <Button type="submit" className="rounded-xl px-10 h-12 gap-2 font-black shadow-lg shadow-primary/20" disabled={creating}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Publish Version
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="history">
            <Card className="border border-border/50 rounded-[2.5rem] bg-card/40 shadow-xl max-w-5xl mx-auto overflow-hidden">
                <CardHeader className="p-8 border-b border-border/50">
                    <CardTitle className="text-2xl font-black">Version Ecosystem</CardTitle>
                    <CardDescription>Roll back to previous templates or review changes over time.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="flex items-end gap-4 max-w-md">
                        <div className="space-y-2 flex-1">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Search Version ID</Label>
                            <Input 
                                type="number" 
                                placeholder="e.g. 5" 
                                value={searchVersion} 
                                onChange={(e) => setSearchVersion(e.target.value)}
                                className="h-11 bg-background/50 border-border/50 rounded-xl font-bold"
                            />
                        </div>
                        <Button 
                            variant="secondary" 
                            className="h-11 rounded-xl font-black gap-2 px-6"
                            onClick={fetchVersion}
                            disabled={fetchingVersion || !searchVersion}
                        >
                            {fetchingVersion ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                            Fetch
                        </Button>
                    </div>

                    {fetchedTemplate && (
                        <div className="animate-in slide-in-from-top-4 duration-300">
                             <div className="p-6 rounded-[2rem] border border-border/50 bg-card/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                                        <FileCode className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-black">{fetchedTemplate.name}</h4>
                                            <Badge variant="outline" className="font-black text-[10px]">v{fetchedTemplate.version}</Badge>
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground">Modified by {fetchedTemplate.createdBy} on {new Date(fetchedTemplate.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {fetchedTemplate.isActive ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] uppercase tracking-wider px-4 py-2">
                                            Currently Active
                                        </Badge>
                                    ) : (
                                        <Button 
                                            className="rounded-xl font-black gap-2 px-6 h-11 shadow-lg shadow-primary/10"
                                            onClick={() => handleActivate(fetchedTemplate.version)}
                                            disabled={activating === fetchedTemplate.version}
                                        >
                                            {activating === fetchedTemplate.version ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            Activate Version
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      {/* Visual Guide Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Eye, title: "Preview mode", desc: "Live rendering of exactly how the customer will see the invoice.", color: "text-blue-500", bg: "bg-blue-500/10" },
          { icon: FileCode, title: "HTML Engine", desc: "Full support for modern CSS and flex layouts for complex designs.", color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: ShieldCheck, title: "Version Control", desc: "Never lose a design. Every update creates a permanent record.", color: "text-emerald-500", bg: "bg-emerald-500/10" }
        ].map((item, idx) => (
          <div key={idx} className="bg-card/40 border border-border/50 rounded-3xl p-6 space-y-3">
            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <h5 className="font-black text-foreground uppercase tracking-wider text-xs">{item.title}</h5>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
