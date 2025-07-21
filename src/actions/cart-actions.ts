"use server";

import { getCurrentSession } from "@/actions/auth";
import prisma from "@/lib/prisma";

export const createCart = async () => {
  const { user } = await getCurrentSession();

  const cart = await prisma.cart.create({
    data: {
      id: crypto.randomUUID(),
      user: user ? { connect: { id: user.id } } : undefined,
      items: {
        create: [],
      },
    },
    include: {
      items: true,
    },
  });

  return cart;
};

export const getOrCreateCart = async (cartId?: string | null) => {
  const { user } = await getCurrentSession();

  if (user) {
    const userCart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        items: true,
      },
    });

    if (userCart) {
      return userCart;
    }
  }

  if (!cartId) {
    return createCart();
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
    return createCart();
  }

  return cart;
};
