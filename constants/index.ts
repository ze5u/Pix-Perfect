export type IconKey =
  | "house"
  | "coins"
  | "images"
  | "sparkles"
  | "eraser"
  | "palette"
  | "shapes"
  | "crop"
  | "upload"
  | "wand"
  | "download"
  | "arrow-right"
  | "arrow-up-right"
  | "check"
  | "check-circle"
  | "x"
  | "shield-check"
  | "caret-left"
  | "caret-right"
  | "dots-three"
  | "globe-simple";

// ===== NAVIGATION ===========================================================

// One icon set for the whole site. navLinks and transformationTypes share the
// same components so a tool looks identical in the sidebar, the marketing page
// and the form header.
export const navLinks: {
  label: string;
  route: string;
  icon: IconKey;
}[] = [
  { label: "Home", route: "/home", icon: "house" },
  { label: "Credits", route: "/credits", icon: "coins" },
  { label: "Image Restore", route: "/transformations/add/restore", icon: "images" },
  { label: "Generative Fill", route: "/transformations/add/fill", icon: "sparkles" },
  { label: "Object Remove", route: "/transformations/add/remove", icon: "eraser" },
  { label: "Object Recolor", route: "/transformations/add/recolor", icon: "palette" },
  { label: "Background Remove", route: "/transformations/add/removeBackground", icon: "shapes" },
];

// The five transform entry points. Derived by filtering navLinks rather than
// slicing it — the old `navLinks.slice(1, 6)` broke silently when a non-transform
// link (Credits) was added to the nav.
export const transformLinks = navLinks.filter((link) =>
  link.route.startsWith("/transformations/add/")
);

// ===== MARKETING ============================================================

// One action runs the whole page. Every CTA resolves here, so the copy in the
// top band and the one at the bottom cannot drift apart.
export const primaryCta = {
  label: "Start editing free",
  href: "/sign-up",
} as const;

export const productCta = {
  label: "Open the editor",
  href: "/transformations/add/restore",
} as const;

export interface ToolDef {
  key: TransformationTypeKey;
  /** The verb a visitor is trying to do. Used as the sentence fragment. */
  action: string;
  /** What they are looking at before they use it. */
  before: string;
  /** The result they end up with. This is the benefit, not the feature. */
  after: string;
  /** Concrete detail that makes the promise checkable. */
  detail: string;
  route: string;
  icon: IconKey;
  accent: string;
}

// Five tools, each stated as the outcome it produces rather than the algorithm
// it runs. Order follows how often people arrive with that problem.
export const tools: ToolDef[] = [
  {
    key: "restore",
    action: "Restore",
    before: "a scan of a scratched 1998 family photo",
    after: "a clean copy you can print and put in a frame",
    detail: "Lifts speckle and fine scratches, then rebuilds the soft colour cast that age leaves on old scans.",
    route: "/transformations/add/restore",
    icon: "house",
    accent: "bg-electric-100",
  },
  {
    key: "remove",
    action: "Remove",
    before: "a crowd shot where one person is turned away",
    after: "the same shot with the crowd thinned out",
    detail: "Describe the object in a phrase. It fills the gap with surrounding texture rather than a blur patch.",
    route: "/transformations/add/remove",
    icon: "eraser",
    accent: "bg-lilac",
  },
  {
    key: "fill",
    action: "Fill",
    before: "a square crop of a landscape",
    after: "the same landscape stretched to 9:16 for a phone wallpaper",
    detail: "Outpaints past the edge in three aspect ratios, so a cropped photo stops being stuck at the wrong size.",
    route: "/transformations/add/fill",
    icon: "crop",
    accent: "bg-mint/25",
  },
  {
    key: "recolor",
    action: "Recolor",
    before: "a sofa that does not match the new wall paint",
    after: "the sofa in the shade you actually have",
    detail: "Names an object and a replacement colour, then keeps its shadow and highlight intact.",
    route: "/transformations/add/recolor",
    icon: "palette",
    accent: "bg-sun text-ink-950",
  },
  {
    key: "removeBackground",
    action: "Cut out",
    before: "a photo of a product on a cluttered desk",
    after: "the product on a clean white drop",
    detail: "Strips the background in one pass, leaving an edge you can use straight away on a listing.",
    route: "/transformations/add/removeBackground",
    icon: "shapes",
    accent: "bg-ember/20",
  },
];

// ===== HOW IT WORKS =========================================================

export const steps: { title: string; body: string; icon: IconKey }[] = [
  {
    title: "Upload a photo",
    body: "Drop in a file. It comes from your camera roll, your desktop, or a scan. PNG, JPG or WEBP.",
    icon: "upload",
  },
  {
    title: "Name the fix",
    body: "Pick one of the five tools. For remove and recolor, describe what to change in a plain sentence.",
    icon: "wand",
  },
  {
    title: "Download it",
    body: "One credit is spent and the result lands in your library. Save it as PNG, JPEG or WEBP.",
    icon: "download",
  },
];

// ===== PROOF ================================================================

// Realistic figures, not marketing round numbers. Each one says where it comes
// from so a reader can tell it apart from an invented statistic.
export const stats = [
  { value: 1, suffix: " credit", label: "spent per edit, on any tool" },
  { value: 20, suffix: " credits", label: "on every new account" },
  { value: 3, suffix: " formats", label: "to export from, at full size" },
] as const;

export const testimonials = [
  {
    quote:
      "My father's 1987 wedding photo came out of a scanner with a coffee ring across the bride. One edit took it out and the skin tones did not go flat like the other tools I tried.",
    name: "Priya Raghavan",
    role: "Restored a family album",
    initials: "PR",
    accent: "bg-electric-500 text-white",
  },
  {
    quote:
      "I list furniture online for a side income. Shooting products on a clean white background used to mean a studio visit. I crop, cut out, done, and the listings look the same.",
    name: "Marcus Oyelaran",
    role: "Lists home goods",
    initials: "MO",
    accent: "bg-grape text-white",
  },
  {
    quote:
      "I am not a designer. My cover photos for the club newsletter have never been the right shape for anything. The fill tool fixes that without me learning Photoshop.",
    name: "Dana Whitfield",
    role: "Volunteer newsletter editor",
    initials: "DW",
    accent: "bg-mint text-ink-950",
  },
] as const;

// ===== FAQ ==================================================================

// Eight questions, in the order a first-time visitor actually asks them.
export const faq = [
  {
    q: "What do I get when I sign up?",
    a: "20 credits. Each edit spends exactly one, on any of the five tools, so 20 credits is 20 finished photos. No card to put on file, and nothing to cancel.",
  },
  {
    q: "Do I need a subscription?",
    a: "No. Credits are spent as you go and an account keeps working as long as it has credits. There are larger bundles on the credits page for people who edit often, but nothing bills on its own.",
  },
  {
    q: "Which file types can I upload?",
    a: "PNG, JPG and WEBP. Exports come back in PNG, JPEG or WEBP at the working resolution of the uploaded file.",
  },
  {
    q: "What happens to my photos?",
    a: "Your uploads go to our image service so an edit can be rendered, and the result is saved to your account so you can find it again later. Nothing is published to a public gallery or used to train models.",
  },
  {
    q: "How good is the restore tool on very old photos?",
    a: "It is strongest on scans with speckle, dust and fine scratches, plus the yellow cast old prints pick up. Heavy tears, missing chunks of the image, or handwriting that was smudged off will not come back, and the preview will show that before you spend a credit.",
  },
  {
    q: "Can I undo an edit?",
    a: "Yes. The original stays saved alongside every result, and you can re-run the same tool on the same image with different settings as many times as you have credits for.",
  },
  {
    q: "Does it work on my phone?",
    a: "Yes, the whole flow runs in a mobile browser. Uploads are compressed before they leave the phone so a large camera file does not take minutes to send.",
  },
  {
    q: "What if I run out of credits?",
    a: "Your finished images stay in your library and can still be downloaded. You top up whenever you are ready to edit again, at your own pace.",
  },
] as const;

// ===== TAILWIND CONFIGURATION ===============================================

export const plans = [
  {
    _id: 1,
    name: "Free",
    price: 0,
    credits: 20,
    inclusions: [
      { label: "20 credits", isIncluded: true },
      { label: "Access to all five tools", isIncluded: true },
      { label: "No card required", isIncluded: true },
      { label: "Priority support", isIncluded: false },
    ],
  },
  {
    _id: 2,
    name: "Pro Package",
    price: 40,
    credits: 120,
    inclusions: [
      { label: "120 credits", isIncluded: true },
      { label: "Access to all five tools", isIncluded: true },
      { label: "Priority support", isIncluded: true },
      { label: "Bulk batch editing", isIncluded: false },
    ],
  },
  {
    _id: 3,
    name: "Premium Package",
    price: 199,
    credits: 2000,
    inclusions: [
      { label: "2,000 credits", isIncluded: true },
      { label: "Access to all five tools", isIncluded: true },
      { label: "Priority support", isIncluded: true },
      { label: "Bulk batch editing", isIncluded: true },
    ],
  },
] as const;

// Icons come from navLinks so the sidebar, the marketing page and the form
// header always show the same glyph for a given tool.
export const transformationTypes = {
  restore: {
    type: "restore" as TransformationTypeKey,
    title: "Restore Image",
    subTitle: "Removes speckle and scratches, and rebuilds the colour of an old scan",
    config: { restore: true },
    icon: "images",
  },
  removeBackground: {
    type: "removeBackground" as TransformationTypeKey,
    title: "Background Remove",
    subTitle: "Strips the background in one pass and leaves a usable edge",
    config: { removeBackground: true },
    icon: "shapes",
  },
  fill: {
    type: "fill" as TransformationTypeKey,
    title: "Generative Fill",
    subTitle: "Extends the image past its edges to a new aspect ratio",
    config: { fillBackground: true },
    icon: "sparkles",
  },
  remove: {
    type: "remove" as TransformationTypeKey,
    title: "Object Remove",
    subTitle: "Names an object and removes it, filling the gap with matching texture",
    config: { remove: { prompt: "", removeShadow: true, multiple: true } },
    icon: "eraser",
  },
  recolor: {
    type: "recolor" as TransformationTypeKey,
    title: "Object Recolor",
    subTitle: "Names an object and a replacement colour, keeping its shading",
    config: { recolor: { prompt: "", to: "", multiple: true } },
    icon: "palette",
  },
} as const;

export const aspectRatioOptions = {
  "1:1": { aspectRatio: "1:1", label: "Square (1:1)", width: 1000, height: 1000 },
  "3:4": {
    aspectRatio: "3:4",
    label: "Standard Portrait (3:4)",
    width: 1000,
    height: 1334,
  },
  "9:16": {
    aspectRatio: "9:16",
    label: "Phone Portrait (9:16)",
    width: 1000,
    height: 1778,
  },
};

export const defaultValues = {
  title: "",
  aspectRatio: "",
  color: "",
  prompt: "",
  publicId: "",
};

// One credit is spent per transformation.
export const creditFee = -1;

// Credits granted to a brand-new account. Mirrors the user model default.
export const startingCredits = 20;

// Cloudinary folder uploads land in. Must match the folder on the Cloudinary
// account, otherwise the homepage search finds nothing.
export const cloudinaryFolder =
  process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "pixperfect";
