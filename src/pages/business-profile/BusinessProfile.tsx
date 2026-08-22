import { useState } from "react";

import { ImageUpload } from "@/components/ImageUpload";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/i18n";

const DESCRIPTION_MAX_LENGTH = 3000;

export function BusinessProfilePage() {
  const { t } = useI18n();
  const [description, setDescription] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<File[]>([]);
  const [additionalPhotos, setAdditionalPhotos] = useState<File[]>([]);
  const [logo, setLogo] = useState<File[]>([]);
  const imageUploadCopy = {
    description: t("imageUpload.description"),
    browse: t("imageUpload.browse"),
    addMore: t("imageUpload.addMore"),
    remove: t("imageUpload.remove"),
    invalidType: t("imageUpload.invalidType"),
    tooManyFiles: t("imageUpload.tooManyFiles"),
    minWidth: t("imageUpload.minWidth"),
    minHeight: t("imageUpload.minHeight"),
    maxWidth: t("imageUpload.maxWidth"),
    maxHeight: t("imageUpload.maxHeight"),
  };

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:w-1/2">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-semibold tracking-normal">
            {t("businessProfile.coverPhoto")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("businessProfile.coverPhotoDescription")}
          </p>
        </div>
        <ImageUpload
          value={coverPhoto}
          onValueChange={setCoverPhoto}
          maxFiles={1}
          copy={{
            ...imageUploadCopy,
            title: t("businessProfile.coverPhotoUpload"),
          }}
        />
      </section>

      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:w-1/2">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-semibold tracking-normal">
            {t("businessProfile.additionalPhotos")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("businessProfile.additionalPhotosDescription")}
          </p>
        </div>
        <ImageUpload
          value={additionalPhotos}
          onValueChange={setAdditionalPhotos}
          multiple
          maxFiles={5}
          copy={{
            ...imageUploadCopy,
            title: t("businessProfile.additionalPhotosUpload"),
          }}
        />
      </section>

      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:w-1/2">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-semibold tracking-normal">
            {t("businessProfile.logo")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("businessProfile.logoDescription")}
          </p>
        </div>
        <ImageUpload
          value={logo}
          onValueChange={setLogo}
          maxFiles={1}
          copy={{
            ...imageUploadCopy,
            title: t("businessProfile.logoUpload"),
          }}
        />
      </section>

      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:w-1/2">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-semibold tracking-normal">
            {t("businessProfile.description")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("businessProfile.descriptionHelp")}
          </p>
        </div>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={DESCRIPTION_MAX_LENGTH}
          placeholder={t("businessProfile.descriptionPlaceholder")}
          aria-describedby="business-profile-description-count"
          className="min-h-40 resize-y"
        />
        <p
          id="business-profile-description-count"
          className="self-end text-sm text-muted-foreground"
        >
          {t("businessProfile.descriptionCharacterCount", {
            count: description.length,
            max: DESCRIPTION_MAX_LENGTH,
          })}
        </p>
      </section>
    </main>
  );
}
