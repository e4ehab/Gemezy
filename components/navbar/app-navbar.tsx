"use client";

import { Button } from "@/components/ui/button";
import { PanelLeftIcon, PanelLeftCloseIcon, SearchIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "@/components/navbar/app-command";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardNavbar = () => {
  const { toggleSidebar, state, openMobile } = useSidebar();
  const isMobile = useIsMobile();
  const isSidebarExpanded = isMobile ? openMobile : state === "expanded";

  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
        return;
      }

      // Escape clears mobile search when focused, handled natively by input anyway
      if (isTyping) return;
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

      <nav
        className={
          isMobile
            ? "flex items-center gap-2 border-b border-sidebar-border bg-sidebar px-3 py-3 text-sidebar-foreground"
            : "flex items-center border-b border-sidebar-border bg-sidebar px-4 py-3 text-sidebar-foreground"
        }
      >
        <Button
          className="h-11 w-11 shrink-0 transition-colors aria-expanded:bg-accent aria-expanded:text-accent-foreground sm:h-9 sm:w-9"
          variant="outline"
          onClick={toggleSidebar}
          aria-label={isSidebarExpanded ? "Close navigation" : "Open navigation"}
          aria-expanded={isSidebarExpanded}
          title={isSidebarExpanded ? "Close navigation" : "Open navigation"}
        >
          {isSidebarExpanded ? (
            <PanelLeftCloseIcon className="h-5 w-5" />
          ) : (
            <PanelLeftIcon className="h-5 w-5" />
          )}
        </Button>

        <div className="flex flex-1 justify-center">
          {isMobile ? (
            <Button
              className="h-11 w-full max-w-55 justify-start font-medium text-primary"
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={commandOpen}
            >
              <SearchIcon className="h-4 w-4 shrink-0 text-primary" />
              Search locations...
            </Button>
          ) : (
            <Button
              className="h-9 w-170 justify-start font-normal text-muted-foreground hover:text-muted-foreground"
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen((open) => !open)}
              aria-haspopup="dialog"
              aria-expanded={commandOpen}
            >
              <div className="flex items-center gap-2 rounded-md px-2 py-1 text-sm">
                <SearchIcon className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">
                  Search locations...
                </span>
              </div>

              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">Ctrl/&#8984;</span>K
              </kbd>
            </Button>
          )}
        </div>
      </nav>
    </>
  );
};