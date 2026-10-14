export type ClassSessionStatus = "SCHEDULED" | "CANCELLED" | "COMPLETED";

export type ClassSessionResponse = {
  id: string;
  classPlanId: string;
  venueId: string;
  instructorId: string | null;
  // ISO 8601 timestamps in UTC.
  startAt: string;
  endAt: string;
  totalCapacity: number;
  classistaCapacity: number;
  status: ClassSessionStatus;
  // The class plan's title and description.
  title: string;
  description: string | null;
  // The class type's category (a leaf, like ClassTypeResponse.categoryId).
  categoryId: string;
  venueName: string;
  instructorName: string | null;
};
