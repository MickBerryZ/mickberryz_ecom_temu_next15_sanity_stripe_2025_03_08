import prisma from "@/lib/prisma";
import { apiVersion } from "@/sanity/env";
import { createClient } from "next-sanity";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// 🚀 FIX: NEXT.JS CONFIGURATION TO RESOLVE 405 ERROR 🚀

// 1. Force dynamic rendering for this server-side endpoint
export const dynamic = "force-dynamic";

// 2. Prevent caching layers from interfering with the webhook
export const fetchCache = "force-no-store";

// 3. CRITICAL: Disable Next.js's default body parser.
// This allows the raw request body to be read for Stripe signature verification.
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // apiVersion: "2024-12-18.acacia",
    // apiVersion: "2025-09-30.clover",
    apiVersion: "2024-06-20",
  });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  // Get sanity Client
  const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    token: process.env.SANITY_API_WRITE_TOKEN,
  });

  try {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Your logic for constructing the event is correct:
      // It uses the raw 'body' and the 'signature' header.
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (e) {
      console.log("Error could not be construct event:");
      console.log(e);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const cartId = session.metadata?.cartId;
        const userId = session.metadata?.userId;

        if (!cartId) {
          // It's important to return a 400 or 500 here to tell Stripe to retry
          // if fulfillment data is missing.
          throw new Error("No cart ID in session metadata");
        }

        const cart = await prisma.cart.findUnique({
          where: {
            id: cartId,
          },
          include: {
            items: true,
          },
        });

        if (!cart) {
          throw new Error("Cart not found");
        }

        try {
          await sanityClient.create({
            _type: "order",
            orderNumber: session.id.slice(-8).toUpperCase(),
            orderDate: new Date().toISOString(),
            customerId: userId !== "-" ? userId : undefined,
            customerEmail: session.customer_details?.email,
            customerName: session.customer_details?.name,
            stripeCustomerId:
              typeof session.customer === "object"
                ? session.customer?.id || ""
                : session.customer,
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
            totalPrice: Number(session.amount_total) / 100,
            shippingAddress: {
              _type: "shippingAddress",
              name: session.shipping_details?.name,
              line1: session.shipping_details?.address?.line1,
              line2: session.shipping_details?.address?.line2,
              city: session.shipping_details?.address?.city,
              state: session.shipping_details?.address?.state,
              postalCode: session.shipping_details?.address?.postal_code,
              country: session.shipping_details?.address?.country,
            },
            orderItems: cart.items.map((item) => ({
              _type: "orderItem",
              _key: item.id,
              product: {
                _type: "reference",
                _ref: item.sanityProductId,
              },
              quantity: item.quantity,
              price: item.price,
            })),
            status: "PROCESSING",
          });
        } catch (sanityError) {
          console.error("Failed to create order in Sanity:", sanityError);
          throw sanityError;
        }

        await prisma.cart.delete({
          where: {
            id: cartId,
          },
        });

        break;
      }
      default: {
        console.log(`Unhandled event type ${event.type}`);
        break;
      }
    }

    // Respond with a 200 to acknowledge successful receipt of the event
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("SOmething went wrong in Stripe webhook:");
    console.error(e);
    // Respond with a 500 status so Stripe retries later
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
