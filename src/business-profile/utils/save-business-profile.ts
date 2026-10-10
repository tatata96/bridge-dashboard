import type {
  UpdatePartnerBusinessProfileRequest,
  UpdateVenueRequest,
} from "@/api/partners/partners.types";

export type BusinessProfileChanges = {
  partner: UpdatePartnerBusinessProfileRequest | null;
  venues: { venueId: string; request: UpdateVenueRequest }[];
};

type SaveOutcome = { status: "saved" } | { status: "failed"; error: unknown };

export type BusinessProfileSaveResult = {
  // null when the partner had nothing to save.
  partner: SaveOutcome | null;
  venues: { venueId: string; outcome: SaveOutcome }[];
};

type Updaters = {
  updatePartner: (
    request: UpdatePartnerBusinessProfileRequest,
  ) => Promise<unknown>;
  updateVenue: (input: {
    venueId: string;
    request: UpdateVenueRequest;
  }) => Promise<unknown>;
};

// Takes a function so a synchronous throw is recorded as a failure too.
async function settle(send: () => Promise<unknown>): Promise<SaveOutcome> {
  try {
    await send();
    return { status: "saved" };
  } catch (error) {
    return { status: "failed", error };
  }
}

// Partner and venues are separate backend resources, so each changed one gets
// its own PATCH, sent in parallel. Every request stands on its own: a failure
// never undoes one that succeeded, and the result says what happened to each
// so the caller can report a partial save.
export async function saveBusinessProfileChanges(
  changes: BusinessProfileChanges,
  { updatePartner, updateVenue }: Updaters,
): Promise<BusinessProfileSaveResult> {
  const { partner: partnerChange, venues: venueChanges } = changes;

  const [partner, venues] = await Promise.all([
    partnerChange ? settle(() => updatePartner(partnerChange)) : null,
    Promise.all(
      venueChanges.map(async (venue) => ({
        venueId: venue.venueId,
        outcome: await settle(() => updateVenue(venue)),
      })),
    ),
  ]);

  return { partner, venues };
}
