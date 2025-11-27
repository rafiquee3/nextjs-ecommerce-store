import { create } from 'zustand'
import { Category } from '../types';

type State = {
    categories: Category[];
    totalItems: number,
}

type Action = {
  setCategories: (cats: Category[]) => void;
  addItem: (category: Category) => Promise<void>;
}

export const useCategoryStore = create<State & Action>((set, get) => ({
  categories: [],
  totalItems: 0,
  
  setCategories: (cats) => set({ categories: cats }),
  addItem: async (category) => {
    const data = {
      name: category.name, 
      slug: category.slug, 
      description: category.description, 
      productCount: category.productCount
    }
    const newCategory = await fetch("/api/admin/categories", {method: "POST", body: JSON.stringify(data)});
    const updatedCat: Category = await newCategory.json();
    set({ categories: [...get().categories, updatedCat] });
  },
}));