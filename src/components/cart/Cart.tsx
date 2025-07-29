"use client";

import { useCartStore } from "@/stores/cart-store";
import { ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useShallow } from "zustand/shallow";

// Cart component to initialize the cart store and sync with user data
// This component is used to ensure the cart is ready before rendering the cart UI
const Cart = () => {
  const { items, close, isOpen, syncWithUser, setLoaded, getTotalItems } =
    useCartStore(
      useShallow((state) => ({
        items: state.items,
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
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {" "}
                  Your cart is emply
                </h3>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Link
                  href="/"
                  onClick={close}
                  className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-900 transition-colors "
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {items.map((item) => (
                  <div
                    key={`cart-item-${item.id}`}
                    className="flex gap-4 p-4 hover:bg-gray-50"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3></h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Cart Footer */}
        </div>
      </div>
    </>
  );
};

export default Cart;
