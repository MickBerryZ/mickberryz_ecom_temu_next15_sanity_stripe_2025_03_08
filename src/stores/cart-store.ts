import {
  getOrCreateCart,
  syncCartWithUser,
  updateCartItem,
} from "@/actions/cart-actions";
import { idMatchesPerspective } from "sanity";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

type CartStore = {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  cartId: string | null;
  setStore: (store: Partial<CartStore>) => void;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  open: () => void;
  close: () => void;
  setLoaded: (loaded: boolean) => void;
  syncWithUser: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      cartId: null,

      setStore: (store) => set(store),

      addItem: async (item) => {
        const { cartId, items } = get();
        if (!cartId) {
          return;
        }

        // [Server Side] Check if the item already exists in the cart
        // If it exists, update the quantity, otherwise create a new item
        const existingItem = items.find((i) => i.id === item.id);
        const existingQuantity = existingItem ? existingItem.quantity : 0;

        // [Server Side] Calculate the new quantity
        // If the item already exists, increment the quantity
        const addedItemQuantity = existingQuantity + item.quantity;

        const updatedCart = await updateCartItem(cartId, item.id, {
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: addedItemQuantity,
        });

        set((state) => {
          return {
            ...state,
            cartId: updatedCart.id,
            items: [...state.items, { ...item, quantity: addedItemQuantity }],
          };
        });
      },

      removeItem: async (id) => {
        const { cartId } = get();
        if (!cartId) {
          return;
        }

        // [Server Side] Assuming updateCartItem can handle setting quantity to 0 to remove the item
        const updatedCart = await updateCartItem(cartId, id, {
          quantity: 0,
        });

        // [Client Side] Update the store state to remove the item
        set((state) => {
          return {
            ...state,
            cartId: updatedCart.id,
            items: state.items.filter((item) => item.id !== id),
          };
        });
      },

      updateQuantity: async (id, quantity) => {
        const { cartId } = get();
        if (!cartId) {
          return;
        }

        // [Server Side] Update the item quantity in the cart
        const updatedCart = await updateCartItem(cartId, id, {
          quantity: quantity,
        });

        // [Client Side] Update the store state to remove the item
        set((state) => ({
          ...state,
          cartId: updatedCart.id,
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      // [Server Side] Function to get or create a cart
      syncWithUser: async () => {
        const { cartId } = get();
        if (!cartId) {
          // If no cartId, create a new cart
          const cart = await getOrCreateCart();
          // [Client Side] Update the store state with the new cart
          set((state) => ({
            ...state,
            cartId: cart.id,
            items: cart.items,
          }));
        }
        // [Server Side] Sync the cart with the user
        const syncedCart = await syncCartWithUser(cartId);
        // [Client Side] Update the store state with the synced cart
        if (syncedCart) {
          set((state) => ({
            ...state,
            cartId: syncedCart.id,
            items: syncedCart.items,
          }));
        }
      },

      clearCart: () => {
        set((state) => ({ ...state, items: [] }));
      },
      open: () => {
        set((state) => ({ ...state, isOpen: true }));
      },
      close: () => {
        set((state) => ({ ...state, isOpen: false }));
      },
      setLoaded: (loaded) => {
        set((state) => ({ ...state, isLoading: loaded }));
      },
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      skipHydration: true,
    }
  )
);
