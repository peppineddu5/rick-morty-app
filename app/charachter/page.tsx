"use client";
import { api } from "@/convex/_generated/api";
import { useQuery as useQueryTen } from "@tanstack/react-query";
import { useAction, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AlertCircle } from "lucide-react";
import { H2, Small } from "@/components/ui/typography";
import { CharachterCard } from "@/components/CharachterCard";

export default function Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchCharacters = useAction(api.character.action.gets);
  const maxCharachter = useQuery(api.character.query.getMax) || 826;

  const charactersPerPage = 20;
  const maxPage = Math.ceil(maxCharachter / charactersPerPage);
  const currentPage = Math.min(Number(searchParams.get("page")) || 1, maxPage);

  const from = (currentPage - 1) * charactersPerPage + 1;
  const to = currentPage * charactersPerPage;

  const {
    data: characters,
    isLoading,
    error,
    isError,
  } = useQueryTen({
    queryKey: ["characters", from, to],
    queryFn: () => fetchCharacters({ from, to }),
    throwOnError: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 0,
  });

  const handlePageChange = (page: number) => {
    router.push(`?page=${Math.min(page, maxPage)}`);
  };

  const generatePaginationItems = () => {
    const items = [];

    items.push(1);

    if (currentPage > 3) {
      items.push("ellipsis-start");
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(currentPage + 1, maxPage);
      i++
    ) {
      if (i !== 1 && i !== maxPage) {
        items.push(i);
      }
    }

    if (currentPage < maxPage - 2) {
      items.push("ellipsis-end");
    }

    if (!items.includes(maxPage)) {
      items.push(maxPage);
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="w-full h-48 rounded-lg mb-3" />
                  <Skeleton className="w-3/4 h-6 mb-2" />
                  <Skeleton className="w-1/2 h-4" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Characters</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!characters || characters.length === 0) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto p-6">
        <Alert>
          <AlertDescription>No characters available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <H2>Rick and Morty Characters</H2>
        <Small className="text-muted-foreground">
          Page {currentPage} (Characters{" "}
          {(currentPage - 1) * charactersPerPage + 1}-
          {Math.min(currentPage * charactersPerPage, maxCharachter)})
        </Small>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {characters.map((char) => (
          <CharachterCard character={char} key={char.id} />
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {generatePaginationItems().map((item, index) => {
            if (item === "ellipsis-start" || item === "ellipsis-end") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={item}>
                {(item as number) <= maxPage && (
                  <PaginationLink
                    onClick={() => handlePageChange(item as number)}
                    isActive={currentPage === item}
                    className="cursor-pointer"
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < maxPage && handlePageChange(currentPage + 1)
              }
              className={
                currentPage === maxPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
