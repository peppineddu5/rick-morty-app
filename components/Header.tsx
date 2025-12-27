"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Doc } from "@/convex/_generated/dataModel";
import { getStatusVariant, cn } from "@/lib/utils";

export function Header() {
  const convex = useConvex();
  const isMobile = useIsMobile();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [character, setCharacter] = useState<Doc<"character">[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = async (name: string) => {
    setSearchQuery(name);
    const search = await convex.query(api.character.query.search, { name });
    setCharacter(search || []);
  };

  const handleSelect = (characterId: number) => {
    setOpen(false);
    setSearchQuery("");
    router.push(`/charachter/${characterId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-8">
          <div className="mr-8 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-serif text-lg font-bold sm:inline-block">
                Rick & Morty
              </span>
            </Link>
          </div>

          <NavigationMenu viewport={isMobile} className="mx-6">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className={navigationMenuTriggerStyle()}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/charachter"
                  className={navigationMenuTriggerStyle()}
                >
                  Characters
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button
              variant="outline"
              className={cn(
                "relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64 lg:w-80",
                "bg-muted/50 transition-colors hover:bg-muted/80 hover:text-foreground",
              )}
              onClick={() => setOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline-flex">Search universe...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              <CommandShortcut>⌘K</CommandShortcut>
            </Button>
          </div>
        </div>
      </header>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search characters from the multiverse..."
          value={searchQuery}
          onValueChange={handleSearch}
        />
        <CommandList>
          {!character && searchQuery ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <CommandEmpty>No results found in this dimension.</CommandEmpty>
              <CommandGroup heading="Characters">
                {character.map((char) => (
                  <CommandItem
                    key={char.id}
                    value={char.name}
                    onSelect={() => handleSelect(char.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full p-1">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border">
                        <img
                          src={`/character/image/${char.imageId}`}
                          alt={char.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{char.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {char.species} • {char.gender}
                        </div>
                      </div>
                      <Badge
                        variant={getStatusVariant(char.status)}
                        className="shrink-0 capitalize"
                      >
                        {char.status}
                      </Badge>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
