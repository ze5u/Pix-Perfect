"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { toast } from "sonner";

import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  transformationTypes,
} from "@/constants";
import { AspectRatioKey, deepMergeObjects } from "@/lib/utils";
import { addImage, updateImage } from "@/lib/actions/image.action";
import type { IImage } from "@/lib/database/models/image.model";
import { updateCredits } from "@/lib/actions/user.actions";
import { transformUrl } from "@/lib/transform";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CustomField } from "./CustomField";
import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";

export const formSchema = z
  .object({
    title: z.string().trim().min(1, "Give this image a title"),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string().min(1, "Upload an image first"),
  })
  .strict();

type FormValues = z.infer<typeof formSchema>;

/**
 * The whole transform flow: upload → adjust → apply (spends a credit) → save.
 * `newTransformation` is the pending, not-yet-applied config; it is what makes
 * "Apply Transformation" light up.
 */
const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type as TransformationTypeKey];

  // DraftImage is what the form works with; the server row is mapped to it so
  // both "Add" and "Update" share one state shape.
  const [image, setImage] = useState<DraftImage | null>(
    data
      ? {
          publicId: data.publicId,
          secureURL: data.secureURL,
          width: data.width,
          height: data.height,
          aspectRatio: data.aspectRatio,
          title: data.title,
          config: data.config as Transformations | undefined,
        }
      : null
  );
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] =
    useState<Transformations | null>(config);
  const [isPending, startTransition] = useTransition();
  const [remaining, setRemaining] = useState(creditBalance);

  const initialValues =
    data && action === "Update"
      ? {
          title: data.title ?? "",
          aspectRatio: data.aspectRatio ?? "",
          color: data.color ?? "",
          prompt: data.prompt ?? "",
          publicId: data.publicId ?? "",
        }
      : defaultValues;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // The button must reflect reality: nothing to apply yet, no credits left, or
  // a save already in flight.
  const canApply =
    newTransformation !== null && remaining > 0 && !isTransforming && !isPending;
  const canSave = Boolean(image?.publicId) && !isSubmitting;

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      const transformationUrl = transformUrl(image, type, transformationConfig);

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio || undefined,
        prompt: values.prompt || undefined,
        color: values.color || undefined,
      };

      if (action === "Add") {
        const created = await addImage({ image: imageData, userId, path: "/" });
        if (!created) throw new Error("Image was not saved");
        toast.success("Image saved");
        window.location.href = `/transformations/${created._id}`;
        return;
      }

      const updated = await updateImage({
        image: { ...imageData, _id: data!._id } as IImage,
        userId,
        path: `/transformations/${data!._id}`,
      });
      if (!updated) throw new Error("Image was not updated");
      toast.success("Changes saved");
      window.location.href = `/transformations/${updated._id}`;
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save image");
    } finally {
      setIsSubmitting(false);
    }
  }

  const onTransformHandler = () => {
    if (newTransformation) {
      setTransformationConfig(
        deepMergeObjects(
          newTransformation as Record<string, unknown>,
          (transformationConfig as Record<string, unknown> | undefined) || {}
        ) as Transformations
      );
    }

    setNewTransformation(null);
    setIsTransforming(true);

    startTransition(async () => {
      try {
        const updated = await updateCredits(userId, creditFee);
        setRemaining(updated?.creditBalance ?? remaining + creditFee);
        toast.success("Transformation applied");
      } catch (error) {
        console.error("Credit charge failed:", error);
        setIsTransforming(false);
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not apply the transformation"
        );
      }
    });
  };

  // restore/removeBackground need no prompt — arm them as soon as an image exists.
  useEffect(() => {
    if (image && (type === "restore" || type === "removeBackground")) {
      setNewTransformation(transformationType.config as Transformations);
    }
  }, [image, transformationType.config, type]);

  // Only 'remove' and 'recolor' feed this — they are the only prompt-driven
  // transforms. Narrowing the parameter keeps the Transformations indexing
  // type-safe; 'fill' indexes fillBackground, which this handler never touches.
  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    inputType: "remove" | "recolor",
    onChangeField: (value: string) => void
  ) => {
    setNewTransformation((prevState) => ({
      ...prevState,
      [inputType]: {
        ...prevState?.[inputType],
        [fieldName === "prompt" ? "prompt" : "to"]: value,
      },
    }));
    return onChangeField(value);
  };

  const onSelectFieldHandler = (value: string, onChangeField: (v: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];

    setImage((prevState: DraftImage | null) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));
    setNewTransformation(transformationType.config as Transformations);

    return onChangeField(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image title"
          className="w-full"
          render={({ field }) => (
            <Input {...field} className="input-field" placeholder="Name this edit" />
          )}
        />

        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === "remove" || type === "recolor") && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={type === "remove" ? "Object to remove" : "Object to recolor"}
              className="w-full"
              render={({ field }) => (
                <Input
                  value={field.value}
                  className="input-field"
                  placeholder="e.g. the parked car"
                  onChange={(e) =>
                    onInputChangeHandler("prompt", e.target.value, type, field.onChange)
                  }
                />
              )}
            />

            {type === "recolor" && (
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement colour"
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    className="input-field"
                    placeholder="#7c3aed"
                    onChange={(e) =>
                      onInputChangeHandler("color", e.target.value, "recolor", field.onChange)
                    }
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />

          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>

        <div className="flex flex-col gap-3">
          {remaining <= 0 && (
            <p className="p-14-medium font-semibold text-ember">
              You have no credits left — buy a plan to keep editing.
            </p>
          )}
          <Button
            type="button"
            className="submit-button"
            disabled={!canApply}
            onClick={onTransformHandler}
          >
            {isTransforming
              ? "Transforming…"
              : `Apply transformation (−${Math.abs(creditFee)} credit)`}
          </Button>
          <Button type="submit" className="ghost-button" disabled={!canSave}>
            {isSubmitting ? "Saving…" : action === "Update" ? "Save changes" : "Save image"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
