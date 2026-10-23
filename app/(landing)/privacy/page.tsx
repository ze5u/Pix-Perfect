import type { Metadata } from "next";

import LegalFrame, {
  LegalHeading,
  LegalList,
  LegalP,
  LegalSection,
} from "@/components/shared/LegalFrame";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What PixPerfect collects about your account, what it does with the images you upload, and how to ask for them to be removed.",
  alternates: { canonical: "/privacy" },
};

const contact = "support@pixperfect.app";

export default function PrivacyPage() {
  return (
    <LegalFrame>
      <LegalHeading title="Privacy policy" updated="23 October 2026" />

      <LegalP>
        PixPerfect exists to fix photos. This page says what we keep while doing
        that, and how you get it back or have it deleted. If the question is
        whether we read your photos or sell your address list, the answer is no
        and no.
      </LegalP>

      <LegalSection title="What we store">
        <LegalList
          items={[
            <>Your account details: the name, email and profile photo that come from your sign in provider.</>,
            <>The images you upload and the versions we produce from them, held in our storage provider.</>,
            <>Your credit balance and a count of the edits you have made.</>,
            <>Nothing from your device: no screen recordings, no browsing history, no advertising identifier.</>,
          ]}
        />
      </LegalSection>

      <LegalSection title="How we use it">
        <LegalP>
          We process an image only when you send it to a tool and only to run
          the tool you chose. The result is stored so you can download it again
          later. We do not use your uploads as training material for models we
          or anyone else builds.
        </LegalP>
        <LegalP>
          We use your email for one thing: account notices, such as a message
          when your balance runs low. We never send marketing through it
          unless you opt in, and there is no separate list to opt into.
        </LegalP>
      </LegalSection>

      <LegalSection title="Third parties">
        <LegalList
          items={[
            <>Authentication: Clerk handles the sign in step and sees the account fields it needs for that.</>,
            <>Image hosting and processing: Cloudinary stores and runs the transforms.</>,
            <>Databases: MongoDB Atlas holds account records and credit balances.</>,
          ]}
        />
        <LegalP>
          We do not sell or trade personal data, and we do not hand your images
          to a partner for advertising.
        </LegalP>
      </LegalSection>

      <LegalSection title="Keeping and deleting">
        <LegalP>
          Images stay until you delete them or close your account. Deleting an
          image removes it from your library and queues its removal from our
          storage. Closing an account removes your account record and your
          images; storage providers take up to 90 days to clear their own
          backups, which is the practical limit on how fast that last step can
          run.
        </LegalP>
      </LegalSection>

      <LegalSection title="Your rights">
        <LegalP>
          You can ask for a copy of what we hold about you, ask us to correct an
          inaccuracy, or ask us to delete it. Send a request to {contact} and a
          person replies, usually within 3 working days. If you are in the EU
          or UK and want to use your data protection rights, the same address
          works.
        </LegalP>
      </LegalSection>

      <LegalSection title="Contact">
        <LegalP>
          Questions about this policy go to {contact}. If a request is
          sensitive, say so and we will deal with it by email rather than in
          account support.
        </LegalP>
      </LegalSection>
    </LegalFrame>
  );
}
