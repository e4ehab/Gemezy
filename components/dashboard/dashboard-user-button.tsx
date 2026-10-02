import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/dashboard/generated-avatar";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardUserButton = () => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const { data, isPending } = authClient.useSession();

    const onLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                }
            }
        })
    };

    const triggerClassName =
        "w-full overflow-hidden rounded-lg border border-border/20 bg-white/5 p-3 transition hover:bg-white/10";

    if (isPending || !data?.user) {
        return null;
    }

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger className={triggerClassName}>
                    {data.user.image ? (
                        <Avatar>
                            <AvatarImage src={data.user.image} />
                        </Avatar>
                    ) : (
                        <GeneratedAvatar seed={data.user.name} variant="initials" classname="size-9 mr-3" />
                    )}
                    <div className="flex flex-1 min-w-0 flex-col gap-0.5 overflow-hidden text-left">
                        <p className="w-full truncate text-sm">
                            {data.user.name}
                        </p>
                        <p className="w-full truncate text-xs text-muted-foreground">
                            {data.user.email}
                        </p>
                    </div>
                    <ChevronDownIcon className="size-4 shrink-0" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle> {data.user.name} </DrawerTitle>
                        <DrawerDescription> {data.user.email} </DrawerDescription>
                    </DrawerHeader>

                    <DrawerFooter>
                        <Button
                            variant="outline"
                            onClick={() => { }}
                            className="justify-between"
                        >
                            Billing
                            <CreditCardIcon className="size-4" />
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onLogout}
                            className="justify-between"
                        >
                            Logout
                            <LogOutIcon className="size-4" />
                        </Button>

                    </DrawerFooter>

                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={triggerClassName}>
                { // show avatar only if user has image
                        data.user.image ? (
                            <Avatar>
                                <AvatarImage src={data.user.image} />
                            </Avatar>
                        ) : (<GeneratedAvatar seed={data.user.name} variant="initials" classname="size-9 mr-3" />)
                }
                <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm truncate w-full">
                        {data.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate w-full">
                        {data.user.email}
                    </p>
                </div>
                <ChevronDownIcon className="size-4 shrink-0" /> {/* down arrow icon (dropdown button) */}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" side="right" className="w-72"> {/* when you click on user button it will pop up this new options*/}
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-0.5 text-left overflow-hidden">
                        <span className="font-medium truncate">{data.user.name}</span>
                        <span className="text-sm font-normal text-muted-foreground truncate">{data.user.email}</span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
                    Billing
                    <CreditCardIcon className="size-4" />
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer flex items-center justify-between" onClick={onLogout}>
                    Logout
                    <LogOutIcon className="size-4" />
                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>
    );
};