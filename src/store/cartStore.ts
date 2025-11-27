import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '../types'; // Zakładam, że CartItem jest poprawnie zdefiniowany

type State = {
    items: CartItem[];
    totalItems: number;
}

type Action = {
    addItem: (product: Omit<CartItem, 'quantity'>) => void;
    remItem: (product: Omit<CartItem, 'quantity'>) => void;
    clearCart: () => void;
    getCartTotal: () => number;
}

type CartStore = State & Action;

export const useCartStore = create<CartStore>()( 
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            
            addItem: (product) => set((state) => {
                const existingItem = state.items.find(item => item.id === product.id);

                let newItems;
                if (existingItem) {
                    newItems = state.items.map(item => item.id === product.id ? {...item, quantity: item.quantity + 1} : item);
                } else {
                    newItems = [...state.items, {...product, quantity: 1}];
                }

                const newTotalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);

                return {
                    items: newItems,
                    totalItems: newTotalItems
                };
            }),

            remItem: (product) => set((state) => {
                const existingItem = state.items.find(item => item.id === product.id);

                let newItems;
                if (existingItem && existingItem.quantity > 1) {
                    newItems = state.items.map(item => item.id === product.id ? {...item, quantity: item.quantity - 1} : item);
                } else if(existingItem && existingItem.quantity === 1) {
                    newItems = state.items.filter(item => item.id !== product.id);
                } else {
                    newItems = [...state.items];
                }

                const newTotalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);

                return {
                    items: newItems,
                    totalItems: newTotalItems
                };
            }),
            
            clearCart: () => set({ items: [], totalItems: 0 }),
            
            getCartTotal: () => {
                const items = get().items;
                return Number(items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2));
            } 
        }),
        {
            name: 'ecommerce-cart-storage', 
            storage: createJSONStorage(() => localStorage), 
        }
    )
);