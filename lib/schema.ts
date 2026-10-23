import { faq } from "@/constants";

// Plain question and answer pairs so search engines can answer them directly.
// Lives outside the page file because Next validates Page exports strictly and
// rejects any extra named export, even one that is only a helper.
export function generateJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
