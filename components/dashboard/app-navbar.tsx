"use client";

import { Button } from "@/components/ui/button";
import { PanelLeftIcon, PanelLeftCloseIcon, SearchIcon, XIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "@/components/dashboard/app-command";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardNavbar = () => {
  const { toggleSidebar, state, openMobile } = useSidebar();
  const isMobile = useIsMobile();
  const isSidebarExpanded = isMobile ? openMobile : state === "expanded";

  const [search, setSearch] = useState("");
  const handleSearchChange = (value: string) => setSearch(value);

  const [commandOpen, setCommandOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    // crude but effective platform check for shortcut label
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);

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
      {!isMobile && <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />}

      <nav
        className={
          isMobile
            ? "flex items-center gap-2 border-b bg-background px-3 py-3"
            : "flex items-center px-4 py-3 border-b bg-background"
        }
      >
        <Button
          className="h-9 w-9 transition-colors aria-expanded:bg-accent aria-expanded:text-accent-foreground"
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
            <div className="relative flex h-9 w-full max-w-55 items-center gap-2 rounded-md border border-gray-300 bg-background px-2 py-1 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-cyan-900 dark:border-gray-600">
              <SearchIcon className="h-4 w-4 shrink-0 text-cyan-800 dark:text-cyan-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-cyan-800 dark:text-cyan-500 placeholder:text-muted-foreground dark:placeholder:text-muted-foreground"
                style={{ fontSize: "16px" }} // prevent iOS zoom
                placeholder="Search projects..."
                aria-label="Search projects"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  aria-label="Clear search"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : (
            <Button
              className="h-9 w-170 justify-start font-normal text-muted-foreground hover:text-muted-foreground"
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen((open) => !open)}
              aria-haspopup="dialog"
              aria-expanded={commandOpen}
            >
              <div className="flex items-center gap-2 px-2 py-1 rounded-md text-sm text-muted-foreground">
                <SearchIcon className="h-4 w-4 text-cyan-800 dark:text-cyan-900" />
                <span className="font-bold text-cyan-800 dark:text-cyan-650">
                  Search...
                </span>
              </div>

              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {isMac ? <span className="text-xs">&#8984;</span> : "Ctrl+"}K
              </kbd>
            </Button>
          )}
        </div>
      </nav>
    </>
  );
};