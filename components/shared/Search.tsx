"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

/**
 * Debounced search. Reads the query back from the URL instead of syncing local
 * state, so a back/forward or direct link shows the right value in the box.
 */
export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  const currentQuery = searchParams.get("query") ?? "";

  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  useEffect(() => {
    if (query === currentQuery) return;

    const id = setTimeout(() => {
      const newUrl = query
        ? formUrlQuery({ searchParams: searchParams.toString(), key: "query", value: query })
        : removeKeysFromQuery({ searchParams: searchParams.toString(), keysToRemove: ["query"] });

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(id);
  }, [query, currentQuery, router, searchParams]);

  return (
    <label className="search" aria-label="Search images">
      <MagnifyingGlass size={18} weight="bold" className="shrink-0 text-ink-500" />
      <Input
        className="search-field"
        placeholder="Search images"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search images"
      />
    </label>
  );
};
