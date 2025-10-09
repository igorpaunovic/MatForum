import type * as LabelPrimitive from "@radix-ui/react-label";

import React from "react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Label } from "./label";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

export const FieldContainer = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
});
FieldContainer.displayName = "FieldContainer";

export const FieldLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const field = useFieldContext();

  const isTouched = field.state.meta.isTouched;
  const hasErrors = field.state.meta.errors.length > 0;

  return (
    <Label
      ref={ref}
      className={cn(isTouched && hasErrors && "text-destructive", className)}
      htmlFor={field.name}
      {...props}
    />
  );
});
FieldLabel.displayName = "FieldLabel";

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const field = useFieldContext();

  return (
    <p
      ref={ref}
      id={`${field.name}-description`}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FieldDescription.displayName = "FieldDescription";

export const FieldMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  // const { t } = useTranslation("ui/form");

  const field = useFieldContext();

  const isTouched = field.state.meta.isTouched;
  const hasErrors = field.state.meta.errors.length > 0;

  const formatErrorMessage = (error: unknown) => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null && "message" in error) {
      return String(error.message);
    }
    return { error: JSON.stringify(error) };
  };

  const formattedErrorMessages = field.state.meta.errors.map(formatErrorMessage).join(", ");

  const body = isTouched && hasErrors ? formattedErrorMessages : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={`${field.name}-message`}
      className={cn(
        "from-muted-foreground text-sm font-medium",
        isTouched && hasErrors && "text-destructive",
        className,
      )}
      {...props}
    >
      {body}
    </p>
  );
});
FieldMessage.displayName = "FieldMessage";

export const FormSubmit = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button">
>(({ className, children, ...props }, ref) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting, state.isTouched]}>
      {([canSubmit, isSubmitting, isTouched]: [boolean, boolean, boolean]) => (
        <Button
          ref={ref}
          type="submit"
          disabled={isSubmitting || !canSubmit || !isTouched}
          className={cn("w-full", className)}
          {...props}
        >
          {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
});
FormSubmit.displayName = "FormSubmit";


// eslint-disable-next-line react-refresh/only-export-components
export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    FieldLabel,
    FieldContainer,
    FieldDescription,
    FieldMessage,
  },
  formComponents: {
    FormSubmit,
  },
  fieldContext,
  formContext,
});
