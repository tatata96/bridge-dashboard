import { useState } from "react";
import { GlobeIcon, PhoneIcon } from "lucide-react";

import facebookIconUrl from "@/assets/icons/facebook.svg";
import instagramIconUrl from "@/assets/icons/instagram.svg";
import tiktokIconUrl from "@/assets/icons/tiktok.svg";
import xIconUrl from "@/assets/icons/x.svg";
import { ImageUpload } from "@/components/ImageUpload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/i18n";
import {
  BUSINESS_AMENITIES,
  BUSINESS_CONTACT_FIELDS,
  RESERVATION_DEADLINE_OPTIONS,
  type BusinessAmenityId,
  type BusinessContactFieldId,
  type ReservationDeadlineValue,
} from "@/pages/business-profile/business-profile.constants";

const DESCRIPTION_MAX_LENGTH = 3000;
const INITIAL_CONTACT_VALUES = BUSINESS_CONTACT_FIELDS.reduce(
  (contactValues, field) => ({ ...contactValues, [field.id]: "" }),
  {} as Record<BusinessContactFieldId, string>,
);
const CONTACT_ICON_URLS = {
  facebook: facebookIconUrl,
  instagram: instagramIconUrl,
  tiktok: tiktokIconUrl,
  x: xIconUrl,
} satisfies Partial<Record<BusinessContactFieldId, string>>;

function SectionHeader({
  children,
  description,
  requirement,
}: {
  children: string;
  description: string;
  requirement: string;
}) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="text-base font-semibold tracking-normal">{children}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="shrink-0 pt-0.5 text-xs font-medium text-muted-foreground">
        {requirement}
      </span>
    </div>
  );
}

export function BusinessProfilePage() {
  const { t } = useI18n();
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<
    BusinessAmenityId[]
  >([]);
  const [contacts, setContacts] = useState(INITIAL_CONTACT_VALUES);
  const [reservationDeadline, setReservationDeadline] =
    useState<ReservationDeadlineValue>("12-hours");
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

  function updateAmenity(amenityId: BusinessAmenityId, isSelected: boolean) {
    setSelectedAmenities((currentAmenities) =>
      isSelected
        ? [...currentAmenities, amenityId]
        : currentAmenities.filter(
            (currentAmenity) => currentAmenity !== amenityId,
          ),
    );
  }

  function updateContact(fieldId: BusinessContactFieldId, value: string) {
    setContacts((currentContacts) => ({
      ...currentContacts,
      [fieldId]: value,
    }));
  }

  return (
    <main className="grid min-w-0 flex-1 grid-cols-1 items-start gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-2">
      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <SectionHeader
          description={t("businessProfile.coverPhotoDescription")}
          requirement={t("common.required")}
        >
          {t("businessProfile.coverPhoto")}
        </SectionHeader>
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

      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <SectionHeader
          description={t("businessProfile.additionalPhotosDescription")}
          requirement={t("common.optional")}
        >
          {t("businessProfile.additionalPhotos")}
        </SectionHeader>
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

      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <SectionHeader
          description={t("businessProfile.logoDescription")}
          requirement={t("common.required")}
        >
          {t("businessProfile.logo")}
        </SectionHeader>
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

      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <SectionHeader
          description={t("businessProfile.descriptionHelp")}
          requirement={t("common.required")}
        >
          {t("businessProfile.description")}
        </SectionHeader>
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

      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <SectionHeader
          description={t("businessProfile.contactsDescription")}
          requirement={t("common.optional")}
        >
          {t("businessProfile.contacts")}
        </SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {BUSINESS_CONTACT_FIELDS.map((field) => (
            <div key={field.id} className="relative min-w-0">
              <span className="pointer-events-none absolute top-1/2 left-3 flex size-5 -translate-y-1/2 items-center justify-center text-foreground">
                {field.icon === "phone" ? (
                  <PhoneIcon className="size-4" />
                ) : field.icon === "website" ? (
                  <GlobeIcon className="size-4" />
                ) : (
                  <img
                    src={CONTACT_ICON_URLS[field.id]}
                    alt=""
                    className="size-4 object-contain"
                  />
                )}
              </span>
              <Input
                value={contacts[field.id]}
                onChange={(event) =>
                  updateContact(field.id, event.target.value)
                }
                placeholder={t(field.placeholderKey)}
                aria-label={t(field.labelKey)}
                className="h-12 rounded-lg bg-background pl-11"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <SectionHeader
          description={t("businessProfile.amenitiesDescription")}
          requirement={t("common.optional")}
        >
          {t("businessProfile.amenities")}
        </SectionHeader>
        <div className="grid gap-2 sm:grid-cols-2">
          {BUSINESS_AMENITIES.map((amenity) => (
            <label
              key={amenity.id}
              className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg border border-border bg-input/20 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-input/40"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity.id)}
                onChange={(event) =>
                  updateAmenity(amenity.id, event.target.checked)
                }
                className="size-4 shrink-0 accent-primary"
              />
              <span>{t(amenity.labelKey)}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <SectionHeader
          description={t("businessProfile.reservationDeadlineDescription")}
          requirement={t("common.required")}
        >
          {t("businessProfile.reservationDeadline")}
        </SectionHeader>
        <Select
          value={reservationDeadline}
          onValueChange={(value) =>
            setReservationDeadline(value as ReservationDeadlineValue)
          }
        >
          <SelectTrigger
            aria-label={t("businessProfile.reservationDeadline")}
            className="w-36 rounded-lg bg-background"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RESERVATION_DEADLINE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>
    </main>
  );
}
