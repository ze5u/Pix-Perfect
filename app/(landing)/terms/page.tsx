import type { Metadata } from "next";

import LegalFrame, {
  LegalHeading,
  LegalList,
  LegalP,
  LegalSection,
} from "@/components/shared/LegalFrame";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The agreement behind using PixPerfect: what you can upload, how credits are charged, and what happens if the service changes.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalFrame>
      <LegalHeading title="Terms of service" updated="23 October 2026" />

      <LegalP>
        These terms cover your use of PixPerfect. They are short on purpose:
        the service is a tool, so the agreement is mostly about what you are
        allowed to put into it.
      </LegalP>

      <LegalSection title="The agreement">
        <LegalP>
          By creating an account or using the tools, you agree to these terms
          and to the privacy policy. If you use the service on behalf of an
          organisation, you agree to them for that organisation too.
        </LegalP>
        <LegalP>
          We can update these terms. If the change matters to how you use the
          service, we will tell you before it takes effect rather than only
          changing the page.
        </LegalP>
      </LegalSection>

      <LegalSection title="What you may not do">
        <LegalList
          items={[
            <>Upload material you have no right to process, such as a photo of someone else you do not own or use.</>,
            <>Upload material intended to defame, blackmail, or impersonate a person.</>,
            <>Abuse the service: spam, harassment, illegal content, or content you know is unlawful.</>,
            <>Try to break in, disrupt service for others, or reverse engineer the models.</>,
          ]}
        />
      </LegalSection>

      <LegalSection title="Credits and charges">
        <LegalList
          items={[
            <>Each transform costs 1 credit. You can see your balance before you run anything.</>,
            <>New accounts start with 20 credits. Issued credits do not expire.</>,
            <>You pay only when you choose to buy more. No subscription starts silently.</>,
            <>A credit is not refunded when a transform runs and returns an image. If a transform fails before producing anything, no credit is taken.</>,
          ]}
        />
      </LegalSection>

      <LegalSection title="Your material, our service">
        <LegalP>
          You keep the rights to what you upload and to what the tools produce.
          You are responsible for how you use it: publishing, licensing, or
          sending it on. We do not claim ownership, and we do not restrict
          reuse.
        </LegalP>
        <LegalP>
          We keep a licence to store and process your images only as far as the
          service needs to run. When you delete an image or close your account,
          that licence ends with the storage.
        </LegalP>
      </LegalSection>

      <LegalSection title="Account and conduct">
        <LegalP>
          You own your account and your password. Tell us straight away if
          anything looks wrong. We may suspend an account if it breaks these
          terms, and we will explain the reason when we do.
        </LegalP>
      </LegalSection>

      <LegalSection title="Disclaimer">
        <LegalP>
          The service is provided as is. Output quality varies with the input
          image, and a transform may not produce the result you expected. We
          aim for accuracy but do not warrant that the output is error free,
          or that it is suitable for medical, legal, or safety critical work.
        </LegalP>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <LegalP>
          Neither party is liable for indirect, incidental, or consequential
          damage. PixPerfect&rsquo;s total liability is limited to the amount you
          paid for the specific claim during the 3 months before it arose, or
          100 USD if that is less.
        </LegalP>
      </LegalSection>

      <LegalSection title="Termination">
        <LegalP>
          You can close your account at any time from the account settings, and
          we can end the agreement if these terms are broken. On termination,
          the rights you keep stay yours; we stop offering the service and
          delete the data on the schedule in the privacy policy.
        </LegalP>
      </LegalSection>

      <LegalSection title="Contact">
        <LegalP>
          Questions about these terms go to support@pixperfect.app.
        </LegalP>
      </LegalSection>
    </LegalFrame>
  );
}
