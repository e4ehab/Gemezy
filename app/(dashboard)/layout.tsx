// app/(dashboard)/layout.tsx
import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardNavbar } from "@/components/navbar/app-navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode; }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">
        <Suspense fallback={<div className="h-14 border-b border-sidebar-border bg-sidebar" aria-label="Loading navigation" />}>
          <DashboardNavbar />
        </Suspense>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;