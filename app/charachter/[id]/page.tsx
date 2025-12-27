"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAction } from "convex/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  MapPin,
  Globe,
  Calendar,
  Film,
  ArrowLeft,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusVariant } from "@/lib/utils";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const fetchCharacter = useAction(api.character.action.get);

  const {
    data: character,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["character", id],
    queryFn: () => fetchCharacter({ id: parseInt(id) }),
    throwOnError: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 0,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-64 w-64 rounded-lg" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  if (error instanceof ConvexError || !character) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Character Not Found</AlertTitle>
          <AlertDescription>
            No character data available for ID: {id}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Character</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load character data. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/charachter")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Characters
      </Button>
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative">
              <img
                src={`/character/image/${character.imageId}`}
                alt={character.name}
                className="h-64 w-64 rounded-lg object-cover shadow-lg"
              />
              <div
                className={`absolute top-2 right-2 h-4 w-4 rounded-full ${getStatusColor(character.status)} ring-2 ring-white`}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <CardTitle className="text-3xl font-bold">
                  {character.name}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {character.species}
                  {character.type && ` - ${character.type}`}
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={getStatusVariant(character.status)}>
                  {character.status}
                </Badge>
                <Badge variant="outline">{character.gender}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Globe className="h-4 w-4" />
              <span>Origin</span>
            </div>
            <p className="text-muted-foreground ml-6">
              {character.origin.name}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4" />
              <span>Last Known Location</span>
            </div>
            <p className="text-muted-foreground ml-6">
              {character.location.name}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Film className="h-4 w-4" />
              <span>Episodes</span>
            </div>
            <p className="text-muted-foreground ml-6">
              Appeared in {character.episode.length} episode
              {character.episode.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4" />
              <span>Created</span>
            </div>
            <p className="text-muted-foreground ml-6">
              {new Date(character.created).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
