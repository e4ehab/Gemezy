"use client";

import { useState } from "react";
import {
  BirdhouseIcon,
  CirclePlusIcon,
  EllipsisIcon,
  LoaderCircleIcon,
  LogOutIcon,
  TelescopeIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

const menuItems = [
  { title: "My Locations", icon: BirdhouseIcon, url: "/locations" },
  { title: "Explore", icon: TelescopeIcon, url: "/explore" },
  { title: "Add New", icon: CirclePlusIcon, url: "/locations/new" },
];

function isPathActive(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`);
}

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session } = authClient.useSession();
  const profileName = session?.user.name || "Profile";
  const profileInitial = profileName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.replace("/login"),
          onError: () => setIsSigningOut(false),
        },
      });
    } catch {
      setIsSigningOut(false);
    }
  };

  const navButtonClass =
    "h-12 rounded-xl px-3 text-lg font-medium text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&_svg]:size-6";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 pb-4 pt-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={false}
              render={<Link href="/locations" prefetch />}
              className="h-14 rounded-xl px-3 text-sidebar-foreground hover:bg-sidebar-accent [&_svg]:size-9"
            >
              <Image
                src="/logos/logo.svg"
                alt="Gemezy"
                width={36}
                height={36}
                priority
                className="size-9 object-contain"
              />
              <span className="text-lg font-semibold">Gemezy</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <div className="px-4">
        <div className="h-px w-full bg-sidebar-border" />
      </div>

      <SidebarContent className="px-2 pt-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isPathActive(pathname, item.url)}
                    render={<Link href={item.url} prefetch />}
                    className={`${navButtonClass} data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground`}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-1.5 p-3">
        <div className="px-1 pb-1">
          <Separator className="bg-sidebar-border" />
        </div>
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={profileName}
              isActive={isPathActive(pathname, "/profile")}
              render={<Link href="/profile" prefetch />}
              className={`${navButtonClass} data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground`}
            >
              <Avatar className="size-7 border border-sidebar-border">
                <AvatarImage src={session?.user.image ?? undefined} alt="" />
                <AvatarFallback className="bg-sidebar-accent text-xs text-sidebar-foreground">
                  {profileInitial}
                </AvatarFallback>
              </Avatar>
              <span>Profile & Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    tooltip="More"
                    className={navButtonClass}
                  />
                }
              >
                <EllipsisIcon />
                <span>More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56 border-border bg-popover text-popover-foreground"
              >
                <ThemeSwitcher />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="h-10 gap-3 text-base"
                >
                  {isSigningOut ? (
                    <LoaderCircleIcon className="size-5 animate-spin" />
                  ) : (
                    <LogOutIcon className="size-5" />
                  )}
                  {isSigningOut ? "Signing out..." : "log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};