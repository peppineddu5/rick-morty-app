"use client";
import { Card, CardContent } from "./ui/card";
import { H3, Muted } from "./ui/typography";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";
import { Character } from "@/convex/schema/character";
import Link from "next/link";
import { getStatusColor, getStatusVariant } from "@/lib/utils";

export function CharachterCard({ character }: { character: Character }) {
  return (
    <Link href={`/charachter/${character.id}`}>
      <Card
        key={character.id}
        className="overflow-hidden hover:shadow-lg transition-shadow py-0 gap-4"
      >
        <div className="relative">
          <img
            src={`/character/image/${character.imageId}`}
            alt={character.name}
            className="w-full h-48 object-cover"
          />
          <Badge
            variant={getStatusVariant(character.status)}
            className={`absolute top-2 right-2 ${getStatusColor(character.status)}`}
          >
            {character.status}
          </Badge>
        </div>

        <CardContent className="p-4 pt-0">
          <H3 className="border-b-0 py-0 mb-2 truncate">{character.name}</H3>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <Muted>Species:</Muted>
              <span className="font-medium">{character.species}</span>
            </div>

            <div className="flex justify-between">
              <Muted>Gender:</Muted>
              <span className="font-medium">{character.gender}</span>
            </div>

            <div className="flex justify-between">
              <Muted>Episodes:</Muted>
              <span className="font-medium">{character.episode.length}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <Muted className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3" />
              {character.location.name}
            </Muted>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
