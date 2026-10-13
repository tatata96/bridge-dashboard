import { useId, useState, type SubmitEvent } from "react";

import {
  useCreateClassTypeMutation,
  useUpdateClassTypeMutation,
} from "@/api/class-types/class-types.api";
import type { ClassTypeResponse } from "@/api/class-types/class-types.types";
import { CategoryPicker } from "@/class-types/components/CategoryPicker";
import {
  CLASS_TYPE_DESCRIPTION_MAX_LENGTH,
  CLASS_TYPE_NAME_MAX_LENGTH,
} from "@/class-types/constants/class-types.constants";
import {
  buildClassTypePatch,
  buildCreateClassTypeRequest,
  toClassTypeFormValues,
  type ClassTypeFormValues,
} from "@/class-types/utils/class-types.utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useI18n, type TranslationKey } from "@/i18n/i18n";
import { getMissingFields } from "@/lib/form.utils";
import { ApiError } from "@/lib/network/api-client";

const emptyValues: ClassTypeFormValues = {
  name: "",
  categoryId: "",
  description: "",
};

function getSubmitErrorKey(error: unknown): TranslationKey {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return "classTypes.error.invalid";
    }
    if (error.status === 404) {
      return "classTypes.error.notFound";
    }
    if (error.status === 409) {
      return "classTypes.error.archived";
    }
  }

  return "classTypes.error.generic";
}

export function ClassTypeFormDialog({
  classType,
  onClose,
  onSaved,
  onCloseAutoFocus,
}: {
  // Edits this class type; creates a new one when omitted.
  classType?: ClassTypeResponse;
  onClose: () => void;
  onSaved: () => void;
  onCloseAutoFocus?: (event: Event) => void;
}) {
  const { t } = useI18n();
  const { toast } = useToast();
  const createClassType = useCreateClassTypeMutation();
  const updateClassType = useUpdateClassTypeMutation();
  // The edit baseline is captured once, so a background refetch of the list
  // doesn't change what counts as a change while the dialog is open.
  const [baseline] = useState(classType);
  const [values, setValues] = useState(
    baseline ? toClassTypeFormValues(baseline) : emptyValues,
  );
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fieldId = useId();

  const isEditing = baseline !== undefined;
  const isSubmitting = createClassType.isPending || updateClassType.isPending;
  const patch = baseline ? buildClassTypePatch(baseline, values) : null;
  // Nothing to send: the backend rejects an empty PATCH.
  const hasNoChanges = isEditing && patch === null;
  const missingFields = getMissingFields(
    { name: values.name, categoryId: values.categoryId },
    ["name", "categoryId"],
  );
  const nameInvalid = submitted && missingFields.includes("name");
  const categoryInvalid = submitted && missingFields.includes("categoryId");

  function updateValue(updates: Partial<ClassTypeFormValues>) {
    setValues((current) => ({ ...current, ...updates }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setSubmitted(true);
    if (missingFields.length > 0 || hasNoChanges) {
      return;
    }

    setSubmitError(null);
    try {
      if (baseline && patch) {
        await updateClassType.mutateAsync({
          classTypeId: baseline.id,
          request: patch,
        });
      } else {
        await createClassType.mutateAsync(buildCreateClassTypeRequest(values));
      }
    } catch (error) {
      setSubmitError(t(getSubmitErrorKey(error)));
      return;
    }

    toast({
      title: t(isEditing ? "toast.classTypeUpdated" : "toast.classTypeCreated"),
    });
    onSaved();
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        // Don't let a close discard the form while its request is in flight.
        if (!open && !isSubmitting) {
          onClose();
        }
      }}
    >
      <DialogContent onCloseAutoFocus={onCloseAutoFocus}>
        <DialogHeader>
          <DialogTitle>
            {t(
              isEditing
                ? "classTypes.editClassType"
                : "classTypes.addClassType",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              isEditing
                ? "classTypes.editClassTypeDescription"
                : "classTypes.addClassTypeDescription",
            )}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex min-w-0 flex-col gap-4"
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <label
              htmlFor={`${fieldId}-name`}
              className="text-sm font-medium text-muted-foreground"
            >
              {t("classTypes.name")}
            </label>
            <Input
              id={`${fieldId}-name`}
              value={values.name}
              onChange={(event) => updateValue({ name: event.target.value })}
              maxLength={CLASS_TYPE_NAME_MAX_LENGTH}
              aria-invalid={nameInvalid}
              aria-describedby={
                nameInvalid ? `${fieldId}-name-error` : undefined
              }
              className="rounded-lg bg-background"
            />
            {nameInvalid ? (
              <p
                id={`${fieldId}-name-error`}
                className="text-sm text-destructive"
              >
                {t("classTypes.error.nameRequired")}
              </p>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <label
              htmlFor={`${fieldId}-category`}
              className="text-sm font-medium text-muted-foreground"
            >
              {t("classTypes.category")}
            </label>
            <CategoryPicker
              id={`${fieldId}-category`}
              value={values.categoryId}
              onChange={(categoryId) => updateValue({ categoryId })}
              invalid={categoryInvalid}
              describedBy={
                categoryInvalid ? `${fieldId}-category-error` : undefined
              }
            />
            {categoryInvalid ? (
              <p
                id={`${fieldId}-category-error`}
                className="text-sm text-destructive"
              >
                {t("classTypes.error.categoryRequired")}
              </p>
            ) : null}
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <label
              htmlFor={`${fieldId}-description`}
              className="text-sm font-medium text-muted-foreground"
            >
              {t("classTypes.description")}{" "}
              <span className="font-normal">({t("common.optional")})</span>
            </label>
            <Textarea
              id={`${fieldId}-description`}
              value={values.description}
              onChange={(event) =>
                updateValue({ description: event.target.value })
              }
              maxLength={CLASS_TYPE_DESCRIPTION_MAX_LENGTH}
              aria-describedby={`${fieldId}-description-count`}
              className="resize-y"
            />
            <p
              id={`${fieldId}-description-count`}
              className="self-end text-sm text-muted-foreground"
            >
              {t("businessProfile.descriptionCharacterCount", {
                count: values.description.length,
                max: CLASS_TYPE_DESCRIPTION_MAX_LENGTH,
              })}
            </p>
          </div>

          {submitError ? (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={onClose}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || hasNoChanges}
            >
              {isEditing
                ? t(isSubmitting ? "classTypes.saving" : "common.save")
                : t(isSubmitting ? "classTypes.creating" : "classTypes.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
