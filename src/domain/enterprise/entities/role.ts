export const Role: { [x: string]: "DELIVERIER" | "ADMIN" } = {
  DELIVERIER: "DELIVERIER",
  ADMIN: "ADMIN",
};

export type Role = (typeof Role)[keyof typeof Role];
