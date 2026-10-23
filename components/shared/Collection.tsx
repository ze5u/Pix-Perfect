"use client";

import { CldImage } from "next-cloudinary";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { transformationTypes } from "@/constants";
import type { IImage } from "@/lib/database/models/image.model";
import { formUrlQuery } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { AppIcon } from "./AppIcon";
import { Search } from "./Search";

interface CollectionProps {
  hasSearch?: boolean;
  images: IImage[];
  totalPages?: number;
  page: number;
}

export const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  page,
}: CollectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPageChange = (action: "next" | "prev") => {
    const pageValue = action === "next" ? page + 1 : page - 1;

    if (pageValue < 1 || pageValue > totalPages) return;

    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <section>
      <div className="collection-heading">
        <div>
          <h2 className="h2-bold text-ink-950">Recent edits</h2>
          <p className="p-14-medium text-ink-500">
            {images.length > 0 ? `${images.length} on this page` : "Nothing here yet"}
          </p>
        </div>
        {hasSearch && <Search />}
      </div>

      {images.length > 0 ? (
        <ul className="collection-list">
          {images.map((image) => (
            <Card image={image} key={String(image._id)} />
          ))}
        </ul>
      ) : (
        <div className="collection-empty flex-col gap-2">
          <Image src="/assets/icons/image.svg" alt="" width={28} height={28} />
          <p className="p-20-semibold text-ink-500">Empty list</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent className="flex w-full items-center gap-3">
            <Button
              disabled={page <= 1}
              className="ghost-button"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="gap-1 p-14-medium" />
            </Button>

            <p className="flex-center p-16-medium w-fit flex-1 text-ink-500">
              {page} / {totalPages}
            </p>

            <Button
              className="button"
              onClick={() => onPageChange("next")}
              disabled={page >= totalPages}
            >
              <PaginationNext className="gap-1 p-14-medium" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};

const Card = ({ image }: { image: IImage }) => {
  const transformationType =
    transformationTypes[image.transformationType as TransformationTypeKey];

  return (
    <li>
      <Link
        href={`/transformations/${image._id}`}
        className="collection-card"
      >
        <CldImage
          src={image.publicId}
          alt={image.title}
          width={image.width ?? 500}
          height={image.height ?? 500}
          {...image.config}
          loading="lazy"
          className="h-52 w-full rounded-xl object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <div className="flex-between">
          <p className="p-20-semibold mr-3 line-clamp-1 text-ink-950">
            {image.title}
          </p>
          {transformationType && (
            <span className="sticker size-9 rounded-xl">
              <AppIcon name={transformationType.icon} size={18} />
            </span>
          )}
        </div>
      </Link>
    </li>
  );
};
