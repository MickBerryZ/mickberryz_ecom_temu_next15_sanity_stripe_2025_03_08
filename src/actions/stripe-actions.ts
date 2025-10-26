"use server";

import Stripe from "stripe";
import { getCurrentSession } from "./auth";
import { getOrCreateCart } from "./cart-actions";
import { Currency } from "lucide-react";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18",
  //   apiVersion: "2025-09-30.clover",
});

export const createCheckoutSession = async (cardId: string) => {
  const { user } = await getCurrentSession();
  const cart = await getOrCreateCart(cardId);

  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: cart.items.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // 100.5 (£1.005)
      },
      quantity: item.quantity,
    })),
    // sussess_url and cancel_url
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL!}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL!}`,
    customer_email: user?.email,
    metadata: {
      cartId: cart.id,
      userId: user?.id?.toString() || "-",
    },
    shipping_address_collection: {
      allowed_countries: ["GB", "US", "CA", "FR", "DE", "IT", "ES", "TH"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            currency: "gbp",
            amount: totalPrice >= 15 ? 0 : 5 * 100, // free shipping for orders over £15
          },
          display_name:
            totalPrice >= 15 ? "Free Shipping" : "Standard Shipping",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 3,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
    ],
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
};
