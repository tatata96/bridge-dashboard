export type AttendeeStatusFilter = "all" | "unmarked" | "attended" | "no_show";
export type AttendeeUserTypeFilter = "all" | "new" | "returning";

export type AttendeesFilter = {
  status: AttendeeStatusFilter;
  userType: AttendeeUserTypeFilter;
};

export const defaultAttendeesFilter: AttendeesFilter = {
  status: "all",
  userType: "all",
};
