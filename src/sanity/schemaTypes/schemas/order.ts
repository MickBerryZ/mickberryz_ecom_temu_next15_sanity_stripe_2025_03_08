import { defineField, defineType } from "sanity";

export const shippingAddress = defineField({
  name: "shippingAddress",
  title: "Shipping Address",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
    }),
    defineField({
      name: "line1",
      title: "Address Line 1",
      type: "string",
    }),
    defineField({
      name: "line2",
      title: "Address Line 2",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),

    defineField({
      name: "state",
      title: "State",
      type: "string",
    }),

    defineField({
      name: "postalCode",
      title: "Postal Code",
      type: "string",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
    }),
  ],
});

export const orderItem = defineField({
  name: "orderItem",
  title: "Order Item",
  type: "object",
});

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
});
