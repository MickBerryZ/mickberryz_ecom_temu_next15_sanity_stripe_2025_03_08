"use client";

import { useCartStore } from "@/stores/cart-store";
import { ShoppingCart, X } from "lucide-react";
import React, { useEffect } from "react";
import { useShallow } from "zustand/shallow";

// Cart component to initialize the cart store and sync with user data
// This component is used to ensure the cart is ready before rendering the cart UI
const Cart = () => {
  const { close, isOpen, syncWithUser, setLoaded, getTotalItems } =
    useCartStore(
      useShallow((state) => ({
        close: state.close,
        isOpen: state.isOpen,
        syncWithUser: state.syncWithUser,
        setLoaded: state.setLoaded,
        getTotalItems: state.getTotalItems,
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
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-md"
          onClick={close}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`
            fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 
            transform transition-transform duration-300 ease-in-out 
            ${isOpen ? "translate-x-0" : "translate-x-full"} 
        `}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 " />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <span className="bg-gray-300 px-2 py-1 rounded-full text-md font-medium">
                {getTotalItems()}
              </span>
            </div>
            <button
              onClick={close}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}

          {/* Cart Footer */}
        </div>
      </div>
    </>
  );
};

export default Cart;
