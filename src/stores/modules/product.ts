import { defineStore } from "pinia";
import { productState } from "@/stores/interface/productState";
import piniaPersistConfig from "@/config/piniaPersist";

const storePrefix = import.meta.env.VITE_API_STORE_PREFIX;

export const useProductStore = defineStore({
  id: `${storePrefix}-product`,
  state: (): productState => ({
    form: {
      id: 0,
      gallery_id: "",
      is_much: 0,
      delivery_id: "",
      name: "",
      desc: "",
      detail: "",
      cny_price: 0,
      delivery_type: 1,
      status: 0,
      stock: 0,
      limit_num: 0,
      sales_num: 0,
      sort: 0,
      start_time: "",
      images: [],
      specs_properties: [],
      skus: []
    }
  }),
  getters: {

  },
  actions: {

  },
  persist: piniaPersistConfig(`${storePrefix}-product`)
});
