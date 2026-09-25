export type ClassistaUserRole = "CUSTOMER" | "ADMIN";
export type PartnerRole = "OWNER" | "STAFF";
export type PartnerStatus = "ACTIVE" | "INACTIVE";

export type ClassistaUserPartner = {
  id: string;
  name: string;
  status: PartnerStatus;
  role: PartnerRole;
};

export type ClassistaUser = {
  id: string;
  name: string;
  email: string | null;
  role: ClassistaUserRole;
  partner: ClassistaUserPartner | null;
};
