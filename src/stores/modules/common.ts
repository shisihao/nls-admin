import { defineStore } from "pinia";
import { CommonState } from "@/stores/interface";
import piniaPersistConfig from "@/config/piniaPersist";

const storePrefix = import.meta.env.VITE_API_STORE_PREFIX;

export const useCommonStore = defineStore({
  id: `${storePrefix}-common`,
  state: (): CommonState => ({
    stores: {
      id: 0,
      name: "",
      status: 0
    }
  }),
  getters: {

  },
  actions: {

  },
  persist: piniaPersistConfig(`${storePrefix}-common`)
});
