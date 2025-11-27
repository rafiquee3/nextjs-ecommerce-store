import { create } from 'zustand'

type State = {
    counter: number;
}

type Action = {
    forceToRefresh: () => void;
}

export const useCategoryStore = create<State & Action>((set, get) => ({
  counter: 0,
  forceToRefresh: () => set((state) => ({ counter: state.counter + 1 })),
}));