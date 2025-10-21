import { create } from "zustand";
import axios from "axios";

type ApiFetch = {
  data: string[];
  apiFetchAsync: () => Promise<void>;
};
export const useApiFetch = create<ApiFetch>((set) => ({
  data: [],
  apiFetchAsync: async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      set({ data: response.data });
    } catch (err) {
      console.log(err);
    }
  },
}));
