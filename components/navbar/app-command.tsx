/*
    This is a command palette component (like a "⌘K" search dialog)

    It renders a searchable dialog (CommandResponsiveDialog)
    where a user can type a query and get a live-filtered list of "projects," then jump to one by clicking/selecting it.
*/
"use client"

import { usePathname, useRouter } from "next/navigation";
import {
    CommandResponsiveDialog,
    CommandInput,
    CommandList,
    CommandItem,
    CommandEmpty,
} from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";
import { useIsMobile } from "@/hooks/use-mobile"; // use mobile hook to adjust command palette for mobile devices
import { useQueryState } from "nuqs";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DashboardCommand = ({ open, setOpen }: Props) => {
    const isMobile = useIsMobile();
    const router = useRouter();
    const pathname = usePathname();
    const [searchValue, setSearchValue] = useQueryState("search", {
        defaultValue: "",
        shallow: false,
        clearOnDefault: true,
    });
    return (
        <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
            <CommandInput
                value={searchValue}
                onValueChange={(value) => {
                    if (pathname !== "/projects") {
                        const nextHref = `/projects${value ? `?search=${encodeURIComponent(value)}` : ""}`;
                        router.replace(nextHref);
                        return;
                    }

                    void setSearchValue(value);
                }}
                placeholder="Find location by slug ..."
            />
            <CommandList>
                <CommandEmpty>
                    No location found. Try searching by slug.
                </CommandEmpty>

                {!isMobile && (
                    <CommandItem disabled>
                        Use slug to quickly find locations
                    </CommandItem>
                )}
            </CommandList>
        </CommandResponsiveDialog>
    );
};