import { create } from "zustand";
import type { UserSchema } from "../types/tableTypes";

interface UserStore {
  activeUser: UserSchema | null;
  setActiveUser: (user: UserSchema) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  activeUser: null,
  setActiveUser: (user) => set({ activeUser: user }),
}));
