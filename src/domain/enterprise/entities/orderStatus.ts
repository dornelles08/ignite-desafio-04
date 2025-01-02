export const OrderStatus: {
  [x: string]: "CREATED" | "WAITING" | "PICKUP" | "DELIVERED" | "RETURNED";
} = {
  CREATED: "CREATED",
  WAITING: "WAITING",
  PICKUP: "PICKUP",
  DELIVERED: "DELIVERED",
  RETURNED: "RETURNED",
};

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
