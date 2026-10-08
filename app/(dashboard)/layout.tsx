// app/(dashboard)/layout.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardNavbar } from "@/components/navbar/app-navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">
        <DashboardNavbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;