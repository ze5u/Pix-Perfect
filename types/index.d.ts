/* eslint-disable no-unused-vars */

// ===== TYPES
declare type TransformationTypeKey =
  | "restore"
  | "fill"
  | "remove"
  | "recolor"
  | "removeBackground";

declare type Transformations = {
  restore?: boolean;
  fillBackground?: boolean;
  remove?: {
    prompt?: string;
    removeShadow?: boolean;
    multiple?: boolean;
  };
  recolor?: {
    prompt?: string;
    to?: string;
    multiple?: boolean;
  };
  removeBackground?: boolean;
};

// ===== USER PARAMS
declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
};

declare type UpdateUserParams = {
  firstName?: string;
  lastName?: string;
  username?: string;
  photo?: string;
};

// ===== IMAGE PARAMS

// The working copy an upload produces before anything is persisted. Narrower
// than IImage: the Cloudinary widget hands back publicId/dimensions/URL, and
// the 'fill' transform adds aspectRatio.
declare type DraftImage = {
  publicId?: string;
  secureURL?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  config?: Transformations;
  title?: string;
};

declare type AddImageParams = {
  image: IImage;
  userId: string;
  path: string;
};

declare type UpdateImageParams = {
  image: IImage;
  userId: string;
  path: string;
};

// ===== TRANSFORMATION FORM
// The one form does both routes: Add creates the row, Update rewrites it.
declare type TransformationFormProps = {
  action: "Add" | "Update";
  data?: IImage | null;
  userId: string;
  type: string;
  creditBalance: number;
  config?: Transformations | null;
};

// ===== TRANSFORMED IMAGE
declare type TransformedImageProps = {
  image: DraftImage | null;
  type: string;
  title?: string;
  transformationConfig?: Transformations | null;
  isTransforming: boolean;
  setIsTransforming?: (value: boolean) => void;
  hasDownload?: boolean;
};

// ===== URL QUERY HELPERS
declare type FormUrlQueryParams = {
  searchParams: string;
  key: string;
  value: number | string | null;
};

declare type RemoveUrlQueryParams = {
  searchParams: string;
  keysToRemove: string[];
};
