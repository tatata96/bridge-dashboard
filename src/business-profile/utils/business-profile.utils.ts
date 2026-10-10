import type {
  PartnerBusinessProfileResponse,
  UpdatePartnerBusinessProfileRequest,
  UpdateVenueRequest,
  VenueResponse,
} from "@/api/partners/partners.types";
import {
  PARTNER_CONTACT_FIELDS,
  type PartnerContactFieldId,
} from "@/business-profile/constants/business-profile.constants";
import type { PartnerFormValues } from "@/business-profile/types/business-profile-form.types";
import { getOptionalTextPatchValue, getTextPatchValue } from "@/lib/form.utils";

// The API's null (no value) becomes "" for the inputs.
export function toContactValues(profile: PartnerBusinessProfileResponse) {
  return PARTNER_CONTACT_FIELDS.reduce(
    (values, field) => ({ ...values, [field.id]: profile[field.id] ?? "" }),
    {} as Record<PartnerContactFieldId, string>,
  );
}

export function stripHandlePrefix(value: string) {
  return value.replace(/^@+/, "");
}

// The build functions below return only the fields that changed, or null when
// nothing did, so the caller can skip the request (the backend rejects an
// empty PATCH body). They do not validate: the required fields must be
// filled in first, because an empty string is rejected by the backend.

function withoutUndefined<T extends object>(patch: T) {
  const changed = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined),
  );
  return Object.keys(changed).length === 0 ? null : (changed as T);
}

export function buildPartnerPatch(
  initial: PartnerBusinessProfileResponse,
  current: PartnerFormValues,
): UpdatePartnerBusinessProfileRequest | null {
  return withoutUndefined({
    name: getTextPatchValue(initial.name, current.name),
    description: getOptionalTextPatchValue(
      initial.description,
      current.description,
    ),
    phone: getOptionalTextPatchValue(initial.phone, current.contacts.phone),
    websiteUrl: getOptionalTextPatchValue(
      initial.websiteUrl,
      current.contacts.websiteUrl,
    ),
    facebookUrl: getOptionalTextPatchValue(
      initial.facebookUrl,
      current.contacts.facebookUrl,
    ),
    instagramHandle: getOptionalTextPatchValue(
      initial.instagramHandle,
      current.contacts.instagramHandle,
    ),
    xHandle: getOptionalTextPatchValue(
      initial.xHandle,
      current.contacts.xHandle,
    ),
    tiktokHandle: getOptionalTextPatchValue(
      initial.tiktokHandle,
      current.contacts.tiktokHandle,
    ),
    bookingCutoffMinutes:
      current.bookingCutoffMinutes === initial.bookingCutoffMinutes
        ? undefined
        : current.bookingCutoffMinutes,
  });
}

// Compares only what the form edits. Postal code, timezone and status are not
// editable on this page, so they are never sent.
export function buildVenuePatch(
  initial: VenueResponse,
  current: VenueResponse,
): UpdateVenueRequest | null {
  const sameAmenities =
    initial.amenityIds.length === current.amenityIds.length &&
    initial.amenityIds.every((amenity) => current.amenityIds.includes(amenity));

  return withoutUndefined({
    name: getTextPatchValue(initial.name, current.name),
    addressLine: getTextPatchValue(initial.addressLine, current.addressLine),
    district: getTextPatchValue(initial.district, current.district),
    city: getTextPatchValue(initial.city, current.city),
    phone: getOptionalTextPatchValue(initial.phone, current.phone ?? ""),
    // The whole list is sent; an emptied one is [], never null.
    amenityIds: sameAmenities ? undefined : current.amenityIds,
  });
}
