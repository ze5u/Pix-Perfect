import type { Control, ControllerRenderProps, FieldPath } from "react-hook-form";
import { z } from "zod";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";

import { formSchema } from "./TransformationForm";

type FormValues = z.infer<typeof formSchema>;

/**
 * Wraps FormField so the controls in TransformationForm stay uniform. Generic
 * in the field name so `field` keeps react-hook-form's own type for that
 * specific field — `title` is string, `aspectRatio` is string | undefined —
 * instead of being widened or erased to `any`.
 */
type CustomFieldProps<TName extends FieldPath<FormValues>> = {
  control?: Control<FormValues>;
  render: (props: {
    field: ControllerRenderProps<FormValues, TName>;
  }) => React.ReactNode;
  name: TName;
  formLabel?: string;
  className?: string;
};

export function CustomField<TName extends FieldPath<FormValues>>({
  control,
  render,
  name,
  formLabel,
  className,
}: CustomFieldProps<TName>) {
  if (!control) {
    console.error("CustomField: Missing control prop.");
    return null; // Prevents the app from crashing
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>{render({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
