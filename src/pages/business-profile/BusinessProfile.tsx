import { useState } from "react";
import { GlobeIcon, MoreVerticalIcon, PhoneIcon } from "lucide-react";

import type {
  PartnerBusinessProfileResponse,
  VenueAmenity,
  VenueResponse,
} from "@/api/partners/partners.types";
import { useBusinessProfileQuery } from "@/api/partners/partners.api";
import {
  useArchiveVenueMutation,
  useVenuesQuery,
} from "@/api/venues/venues.api";
import facebookIconUrl from "@/assets/icons/facebook.svg";
import instagramIconUrl from "@/assets/icons/instagram.svg";
import tiktokIconUrl from "@/assets/icons/tiktok.svg";
import xIconUrl from "@/assets/icons/x.svg";
// TODO: restore with the photo cards once the backend supports photos.
// import { ImageUpload } from "@/components/ImageUpload";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/i18n/i18n";
import {
  VENUE_AMENITIES,
  PARTNER_CONTACT_FIELDS,
  RESERVATION_DEADLINE_OPTIONS,
  type PartnerContactFieldId,
  type ReservationDeadlineValue,
} from "@/pages/business-profile/business-profile.constants";

const DESCRIPTION_MAX_LENGTH = 3000;
const CONTACT_ICON_URLS = {
  facebook: facebookIconUrl,
  instagram: instagramIconUrl,
  tiktok: tiktokIconUrl,
  x: xIconUrl,
} satisfies Partial<Record<PartnerContactFieldId, string>>;

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

// The form's contact ids are not the backend field names yet.
function toContactValues(
  profile: PartnerBusinessProfileResponse,
): Record<PartnerContactFieldId, string> {
  return {
    phone: profile.phone ?? "",
    website: profile.websiteUrl ?? "",
    facebook: profile.facebookUrl ?? "",
    instagram: profile.instagramHandle ?? "",
    x: profile.xHandle ?? "",
    tiktok: profile.tiktokHandle ?? "",
  };
}

// Data wins over errors: a failed background refetch keeps the form on screen
// with the last loaded values.
export function BusinessProfilePage() {
  const { t } = useI18n();
  const profileQuery = useBusinessProfileQuery();
  const venuesQuery = useVenuesQuery();

  if (profileQuery.data && venuesQuery.data) {
    return (
      <BusinessProfileForm
        profile={profileQuery.data}
        initialVenues={venuesQuery.data}
      />
    );
  }

  if (profileQuery.isError || venuesQuery.isError) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <p role="alert" className="text-sm text-muted-foreground">
          {t("businessProfile.loadError")}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            if (profileQuery.isError) profileQuery.refetch();
            if (venuesQuery.isError) venuesQuery.refetch();
          }}
        >
          {t("auth.retry")}
        </Button>
      </main>
    );
  }

  return (
    <main
      aria-busy="true"
      className="grid min-w-0 flex-1 grid-cols-1 items-start gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-2"
    >
      <span role="status" className="sr-only">
        {t("businessProfile.loading")}
      </span>
      <Skeleton className="h-72 lg:col-span-2" />
      <Skeleton className="h-56" />
      <Skeleton className="h-56" />
      <Skeleton className="h-96 lg:col-span-2" />
    </main>
  );
}

// Mounted only once both queries have data, so the state below starts from
// the server values and no effect is needed to copy them in.
function BusinessProfileForm({
  profile,
  initialVenues,
}: {
  profile: PartnerBusinessProfileResponse;
  initialVenues: VenueResponse[];
}) {
  const { t } = useI18n();
  const [businessName, setBusinessName] = useState(profile.name);
  const [description, setDescription] = useState(profile.description ?? "");
  const [contacts, setContacts] = useState(() => toContactValues(profile));
  const [venues, setVenues] = useState<VenueResponse[]>(initialVenues);
  const [venueToArchive, setVenueToArchive] = useState<VenueResponse | null>(
    null,
  );
  const archiveVenue = useArchiveVenueMutation();
  const { toast } = useToast();
  const [reservationDeadline, setReservationDeadline] =
    useState<ReservationDeadlineValue>("12-hours");
  // TODO: restore with the photo cards once the backend supports photos.
  // const [coverPhoto, setCoverPhoto] = useState<File[]>([]);
  // const [additionalPhotos, setAdditionalPhotos] = useState<File[]>([]);
  // const imageUploadCopy = {
  //   description: t("imageUpload.description"),
  //   browse: t("imageUpload.browse"),
  //   addMore: t("imageUpload.addMore"),
  //   remove: t("imageUpload.remove"),
  //   invalidType: t("imageUpload.invalidType"),
  //   tooManyFiles: t("imageUpload.tooManyFiles"),
  //   minWidth: t("imageUpload.minWidth"),
  //   minHeight: t("imageUpload.minHeight"),
  //   maxWidth: t("imageUpload.maxWidth"),
  //   maxHeight: t("imageUpload.maxHeight"),
  // };

  // The venues in state are a draft copy of the query data, so an archived
  // venue has to be dropped from both.
  function handleArchiveConfirm() {
    if (!venueToArchive) return;
    const { id } = venueToArchive;

    archiveVenue.mutate(id, {
      onSuccess: () => {
        setVenues((currentVenues) =>
          currentVenues.filter((venue) => venue.id !== id),
        );
        setVenueToArchive(null);
        toast({ title: t("toast.locationArchived") });
      },
      onError: () => toast({ title: t("toast.locationArchiveFailed") }),
    });
  }

  function updateContact(fieldId: PartnerContactFieldId, value: string) {
    setContacts((currentContacts) => ({
      ...currentContacts,
      [fieldId]: value,
    }));
  }

  function updateVenue(
    venueId: string,
    updates: Partial<
      Pick<
        VenueResponse,
        "name" | "addressLine" | "district" | "city" | "phone"
      >
    >,
  ) {
    setVenues((currentVenues) =>
      currentVenues.map((venue) =>
        venue.id === venueId ? { ...venue, ...updates } : venue,
      ),
    );
  }

  function updateVenueAmenity(
    venueId: string,
    amenityId: VenueAmenity,
    isSelected: boolean,
  ) {
    setVenues((currentVenues) =>
      currentVenues.map((venue) => {
        if (venue.id !== venueId) return venue;

        return {
          ...venue,
          amenityIds: isSelected
            ? [...new Set([...venue.amenityIds, amenityId])]
            : venue.amenityIds.filter(
                (currentAmenity) => currentAmenity !== amenityId,
              ),
        };
      }),
    );
  }

  return (
    <main className="grid min-w-0 flex-1 grid-cols-1 items-start gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-2">
      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:col-span-2">
        <SectionHeader
          description={t("businessProfile.businessInformationDescription")}
          requirement={t("common.required")}
        >
          {t("businessProfile.businessInformation")}
        </SectionHeader>
        <div className="flex min-w-0 flex-col gap-3">
          <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-muted-foreground">
            {t("businessProfile.businessName")}
            <Input
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              className="rounded-lg bg-background"
            />
          </label>
          <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-muted-foreground">
            {t("businessProfile.description")}
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={DESCRIPTION_MAX_LENGTH}
              placeholder={t("businessProfile.descriptionPlaceholder")}
              aria-describedby="business-profile-description-count"
              className="min-h-40 resize-y"
            />
          </label>
          <p
            id="business-profile-description-count"
            className="self-end text-sm text-muted-foreground"
          >
            {t("businessProfile.descriptionCharacterCount", {
              count: description.length,
              max: DESCRIPTION_MAX_LENGTH,
            })}
          </p>
        </div>
      </section>

      {/* TODO: restore the photo cards once the backend supports photos.
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
      */}

      <section className="flex w-full min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-4 lg:col-span-2">
        <SectionHeader
          description={t("businessProfile.locationsDescription")}
          requirement={t("common.required")}
        >
          {t("businessProfile.locations")}
        </SectionHeader>
        <div className="grid gap-4">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-background p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-foreground">
                  {venue.name || t("venues.unknownVenue")}
                </h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("common.moreActions")}
                    >
                      <MoreVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => setVenueToArchive(venue)}
                    >
                      {t("venues.archiveLocation")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-muted-foreground">
                    {t("venues.venueName")}
                    <Input
                      value={venue.name}
                      onChange={(event) =>
                        updateVenue(venue.id, { name: event.target.value })
                      }
                      className="rounded-lg bg-background"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-muted-foreground sm:col-span-2">
                    {t("venues.addressLine")}
                    <Input
                      value={venue.addressLine}
                      onChange={(event) =>
                        updateVenue(venue.id, {
                          addressLine: event.target.value,
                        })
                      }
                      className="rounded-lg bg-background"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-muted-foreground">
                    {t("venues.district")}
                    <Input
                      value={venue.district}
                      onChange={(event) =>
                        updateVenue(venue.id, { district: event.target.value })
                      }
                      className="rounded-lg bg-background"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-muted-foreground">
                    {t("venues.city")}
                    <Input
                      value={venue.city}
                      onChange={(event) =>
                        updateVenue(venue.id, { city: event.target.value })
                      }
                      className="rounded-lg bg-background"
                    />
                  </label>
                  <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-muted-foreground">
                    {t("venues.phone")}
                    <Input
                      value={venue.phone ?? ""}
                      onChange={(event) =>
                        updateVenue(venue.id, {
                          phone: event.target.value || null,
                        })
                      }
                      className="rounded-lg bg-background"
                    />
                  </label>
                </div>

                <fieldset className="flex min-w-0 flex-col gap-2">
                  <legend className="text-sm font-medium text-muted-foreground">
                    {t("businessProfile.amenities")}
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {VENUE_AMENITIES.map((amenity) => (
                      <label
                        key={amenity.id}
                        className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg border border-border bg-input/20 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-input/40"
                      >
                        <input
                          type="checkbox"
                          checked={venue.amenityIds.includes(amenity.id)}
                          onChange={(event) =>
                            updateVenueAmenity(
                              venue.id,
                              amenity.id,
                              event.target.checked,
                            )
                          }
                          className="size-4 shrink-0 accent-primary"
                        />
                        <span>{t(amenity.labelKey)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4">
        <SectionHeader
          description={t("businessProfile.contactsDescription")}
          requirement={t("common.optional")}
        >
          {t("businessProfile.contacts")}
        </SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {PARTNER_CONTACT_FIELDS.map((field) => (
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

      <ConfirmDialog
        open={venueToArchive !== null}
        onOpenChange={(open) => {
          if (!open && !archiveVenue.isPending) setVenueToArchive(null);
        }}
        title={t("venues.archiveQuestion")}
        body={t("venues.archiveDescription", {
          venue: venueToArchive?.name ?? "",
        })}
        cancelLabel={t("venues.keepLocation")}
        confirmLabel={t("venues.archiveLocation")}
        tone="destructive"
        onConfirm={handleArchiveConfirm}
        confirmDisabled={archiveVenue.isPending}
      />
    </main>
  );
}
