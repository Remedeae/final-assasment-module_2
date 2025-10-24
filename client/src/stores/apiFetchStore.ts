import { create } from "zustand";
import axios, { type Method } from "axios";

type ApiFetch = {
  data: unknown;
  error: string | null;
  apiFetchAsync: <T>(method: Method, urlEnd: string) => Promise<T | null>;
  //This is so that we can pass in arguments get/post/put/delete along with what ending to the link we have + a way to grab data from the UI
  //the Method type is an enum containing get, post, put, delete and more
  //T is the type of data we expect to return from the api call
};
export const useApiFetch = create<ApiFetch>((set) => ({
  data: null,
  error: null,
  apiFetchAsync: async <T>(method: Method, urlEnd: string) => {
    try {
      const response = await axios({
        //modified to take the method as an argument
        method,
        url: `http://localhost:3000/${urlEnd}`,
      });
      set({ data: response.data, error: null });
      return response.data as T;
    } catch (err) {
      let message: string = "Unknown error occured";
      if (err instanceof Error) {
        console.log(err);
        message = err.message;
      }
      set({ error: message, data: null });
      return null;
    }
  },
}));
