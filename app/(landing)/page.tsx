import type { Metadata } from "next";

import { Tagline } from "./motion";
import LandingHero from "@/components/shared/LandingHero";
import LandingNav from "@/components/shared/LandingNav";
import LandingFooter from "@/components/shared/LandingFooter";
import ToolGrid from "@/components/shared/ToolGrid";
import HowItWorks from "@/components/shared/HowItWorks";
import ProofSection from "@/components/shared/ProofSection";
import PlansSection from "@/components/shared/PlansSection";
import FaqSection from "@/components/shared/FaqSection";
import FinalCta from "@/components/shared/FinalCta";
import { generateJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "PixPerfect — fix any photo with one upload",
  description:
    "Restore a scratched family photo, fill the edges out, remove a passerby, recolor an object, cut out the background. Five edits, one credit each, 20 to start.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function LandingPage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <LandingNav />

      <div id="main" className="flex-1">
        <LandingHero />

        <TaglineSection />

        <ToolGrid />
        <HowItWorks />
        <ProofSection />
        <PlansSection />
        <FaqSection />
        <FinalCta />
      </div>

      <LandingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd()) }}
      />
    </>
  );
}

/**
 * The tagline moment: one large sentence, placed well below the hero rather
 * than stacked on it, so it lands as its own beat.
 */
function TaglineSection() {
  return (
    <section className="px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <Tagline
          size="lg"
          className="max-w-[680px] text-ink-950"
        >
          Your photo is not broken. It just needs one specific fix.
        </Tagline>
      </div>
    </section>
  );
}
