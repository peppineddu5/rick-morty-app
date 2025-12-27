"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery as useQueryTen } from "@tanstack/react-query";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { H1, H2, Lead, Muted } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { CharachterCard } from "@/components/CharachterCard";
import {
  Users,
  Sparkles,
  ArrowRight,
  Tv,
  Globe,
  Zap,
  Star,
} from "lucide-react";

export default function Home() {
  const fetchCharacters = useAction(api.character.action.gets);
  const maxCharacter = useQuery(api.character.query.getMax);

  const { data: featuredCharacters, isLoading } = useQueryTen({
    queryKey: ["featured-characters"],
    queryFn: () => fetchCharacters({ from: 1, to: 8 }),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });

  const stats = [
    {
      icon: Users,
      label: "Characters",
      value: maxCharacter?.toString() || "826",
      color: "text-primary",
    },
    {
      icon: Globe,
      label: "Dimensions",
      value: "∞",
      color: "text-accent",
    },
    {
      icon: Tv,
      label: "Episodes",
      value: "51",
      color: "text-chart-5",
    },
    {
      icon: Star,
      label: "Rating",
      value: "9.2",
      color: "text-yellow-500",
    },
  ];

  return (
    <main className="relative overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl transition-all duration-1000 opacity-60 scale-100`}
        />
        <div
          className={`absolute top-40 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl transition-all duration-1000 delay-200 opacity-50 scale-100`}
        />
        <div
          className={`absolute bottom-20 left-1/3 w-64 h-64 bg-chart-2/20 rounded-full blur-3xl transition-all duration-1000 delay-500 opacity-40 scale-100`}
        />
      </div>

      <section className="relative min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`relative transition-all duration-1000 scale-100 opacity-10`}
          >
            <div className="absolute inset-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse" />
              <div className="absolute inset-4 rounded-full border-2 border-accent/40 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-chart-2/30 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm animate-bounce"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Explore the Multiverse
          </Badge>

          <H1
            className={`mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent transition-all duration-700 translate-y-0 opacity-100`}
          >
            Rick and Morty
            <br />
            <span className="text-primary">Character Encyclopedia</span>
          </H1>

          <Lead
            className={`max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 translate-y-0 opacity-100`}
          >
            Discover all {maxCharacter || 826} characters from the animated
            sci-fi masterpiece. Explore their origins, dimensions, and stories
            across the multiverse.
          </Lead>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-400 translate-y-0 opacity-100`}
          >
            <Button asChild size="lg" className="group">
              <Link href="/charachter">
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Explore Characters
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/charachter?page=1">
                <Star className="w-5 h-5 mr-2" />
                View All
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 delay-500 translate-y-0 opacity-100`}
          >
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-primary/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`inline-flex p-3 rounded-full bg-muted mb-4 ${stat.color} group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <Muted>{stat.label}</Muted>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <H2 className="mb-2 border-none">Featured Characters</H2>
              <Muted>
                Meet some of the most iconic characters from the show
              </Muted>
            </div>
            <Button variant="ghost" asChild className="group hidden sm:flex">
              <Link href="/charachter">
                View All
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-4">
                      <Skeleton className="w-3/4 h-6 mb-2" />
                      <Skeleton className="w-1/2 h-4 mb-2" />
                      <Skeleton className="w-2/3 h-4" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCharacters?.slice(0, 8).map((character, index) => (
                <div
                  key={character.id}
                  className="transition-all duration-500"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CharachterCard character={character} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline">
              <Link href="/charachter">
                View All Characters
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-card border-primary/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGwtb3BhY2l0eT0iMC4wMyIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoLTR2LTJoNHYtNGgydjRoNHYyaC00djR6bTAtMzBoLTJ2LTRoLTR2LTJoNHYtNGgydjRoNHYyaC00djR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            <CardContent className="relative p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <H2 className="mb-4 border-none">Ready to Explore?</H2>
              <Lead className="mb-8 max-w-2xl mx-auto">
                Dive into the complete collection of Rick and Morty characters.
                Search, filter, and discover fascinating details about each one.
              </Lead>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="group">
                  <Link href="/charachter">
                    <Users className="w-5 h-5 mr-2" />
                    Browse All Characters
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="h-12" />
    </main>
  );
}
