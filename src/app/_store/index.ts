import { Business } from "@prisma/client";
import { create } from "zustand";

export type State = {
  business: Business | null;
};

export type Actions = {
  selectBusiness: (business: Business) => void;
};

export const useBusinessStore = create<State & Actions>()((set) => ({
  business: null,
  selectBusiness: (business: Business) =>
    set(() => ({
      business,
    })),
}));
