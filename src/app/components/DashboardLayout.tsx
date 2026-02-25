import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ShieldCheck,
  Clock,
  BookOpen,
  Activity,
} from "lucide-react";

interface DashboardLayoutProps {
  userRole: 'admin' | 'manager';
  onLogout: () => void;
}

const navItems = [
  { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard, roles: ['admin'], path: '/admin/dashboard' },
  { id: "bookings", label: "Booking Management", icon: Calendar, roles: ['manager'], path: '/manager/bookings' },
  { id: "pending-bookings", label: "Pending Bookings", icon: Clock, roles: ['manager'], path: '/manager/pending-bookings' },
  { id: "all-bookings", label: "Booking History", icon: BookOpen, roles: ['manager'], path: '/manager/all-bookings' },
  { id: "admins", label: "Manage Admins", icon: ShieldCheck, roles: ['manager'], path: '/manager/admins' },
  { id: "resources", label: "Resource & Inventory", icon: MapPin, roles: ['admin'], path: '/admin/resources' },
  { id: "pricing", label: "Dynamic Pricing", icon: TrendingUp, roles: ['admin'], path: '/admin/pricing' },
  { id: "users", label: "User & Wallet", icon: Users, roles: ['admin', 'manager'], path: (role: string) => `/${role}/users` },
  { id: "invoice-template", label: "Invoice Template", icon: Clock, roles: ['manager'], path: '/manager/invoice-template' },
  { id: "activities", label: "Activities", icon: Activity, roles: ['manager'], path: '/manager/activities' },
];
export function DashboardLayout({ userRole, onLogout }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex h-screen bg-background font-sans antialiased text-foreground">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col z-20 shadow-xl`}
      >
        {/* Logo Section */}
        <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${userRole === 'admin' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                {userRole === 'admin' ? (
                  <Calendar className="w-5 h-5 text-white" />
                ) : (
                  <Users className="w-5 h-5 text-white" />
                )}
              </div>
              <h1 className="font-bold text-lg tracking-tight text-sidebar-foreground">
                {userRole === 'admin' ? 'Admin Portal' : 'Manager Portal'}
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const itemPath = typeof item.path === 'function' ? item.path(userRole) : item.path;
            const isActive = location.pathname === itemPath;
            return (
              <Link
                key={item.id}
                to={itemPath}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md font-bold"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-current" : "text-sidebar-foreground/40"}`} />
                {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                {isActive && !sidebarCollapsed && (
                  <div className="absolute right-2 w-1 h-5 bg-sidebar-primary-foreground rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom Actions */}
        <div className="p-3 border-t border-sidebar-border bg-sidebar-accent/30">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <Settings className="w-5 h-5 opacity-40" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors mt-1"
          >
            <LogOut className="w-5 h-5 opacity-40" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 z-10 sticky top-0 shadow-sm">
          <div className="flex-1 flex items-center max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Global search..."
                className="pl-10 h-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl w-full transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary transition-colors hover:bg-muted/80 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
            </Button>
            <div className="h-8 w-[1px] bg-border mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">Hitendra Singh</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{userRole === 'admin' ? 'Super Admin' : 'Manager'}</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary/10 hover:border-primary/30 transition-all cursor-pointer shadow-sm">
                <AvatarFallback className={`text-primary-foreground font-bold ${userRole === 'admin' ? 'bg-blue-600' : 'bg-indigo-600'}`}>HS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
