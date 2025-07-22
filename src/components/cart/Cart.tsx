"use client";

import { useCartStore } from "@/stores/cart-store";
import React, { useEffect } from "react";
import { useShallow } from "zustand/shallow";

// Cart component to initialize the cart store and sync with user data
// This component is used to ensure the cart is ready before rendering the cart UI
const Cart = () => {
  const { syncWithUser, setLoaded } = useCartStore(
    useShallow((state) => ({
      syncWithUser: state.syncWithUser,
      setLoaded: state.setLoaded,
    }))
  );

  // [Client Side] Use useEffect to sync the cart with user data when the component mounts
  useEffect(() => {
    const initCart = async () => {
      await useCartStore.persist.rehydrate();
      await syncWithUser();
      setLoaded(true);
    };

    // [Client Side] Call the initCart function to initialize the cart
    // This ensures the cart is ready before any cart-related UI is rendered
    initCart();
  }, []);
  return <div>Cart</div>;
};

export default Cart;
