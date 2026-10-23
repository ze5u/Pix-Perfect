import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getAllImages } from "@/lib/actions/image.action";
import { getUserById, syncUserFromClerk } from "@/lib/actions/user.actions";
import { Collection } from "@/components/shared/Collection";
import HomeHero from "@/components/shared/HomeHero";

/**
 * Home + dashboard. A sentence-scale hero names what the tool is and shows
 * the balance, then the visitor's recent edits sit below. The (root) layout
 * owns the top bar; this file is only content.
 *
 * Clerk's webhook delivery is async — sometimes the user.created event arrives
 * after the first page request (especially with ngrok or local dev). We call
 * syncUserFromClerk as a fallback when the row doesn't exist yet.
 */
const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const session = await auth();
  if (!session.userId) redirect("/sign-in");

  let user = await getUserById(session.userId);

  // Webhook hasn't synced yet — fetch fresh data from Clerk and create the row.
  if (!user) {
    user = await syncUserFromClerk(session.userId);
  }

  const params = await searchParams;
  const images = await getAllImages({
    page: Number(params.page) || 1,
    searchQuery: params.query?.toString() || "",
  });

  const page = Number(params.page) || 1;

  return (
    <div className="animate-fade-in flex flex-col gap-16 md:gap-24">
      <HomeHero active={user?.creditBalance ?? 0} />

      <section id="library">
        <Collection
          hasSearch
          images={images?.data ?? []}
          totalPages={images?.totalPage ?? 1}
          page={page}
        />
      </section>
    </div>
  );
};

export default Home;