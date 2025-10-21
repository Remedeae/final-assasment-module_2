import { create } from "zustand";
import axios, { type Method } from "axios";

type ApiFetch = {
  data: string[];
  apiFetchAsync: (method: Method, urlEnd: string) => Promise<void>;
  //This is so that we can pass in arguments get/post/put/delete along with what ending to the link we have + a way to grab data from the UI
  //the Method type is an enum containing get, post, put, delete and more
};
export const useApiFetch = create<ApiFetch>((set) => ({
  data: [],
  apiFetchAsync: async (method, urlEnd) => {
    try {
      const response = await axios({
        //modified to take the method as an argument
        method,
        url: `http://localhost:3000/${urlEnd}`,
      });
      set({ data: response.data });
    } catch (err) {
      console.log(err);
    }
  },
}));
