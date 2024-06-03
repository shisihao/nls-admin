import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/config/piniaPersist";

const storePrefix = import.meta.env.VITE_API_STORE_PREFIX;

export const useUserStore = defineStore({
  id: `${storePrefix}-user`,
  state: (): UserState => ({
    token: "",
    userInfo: { name: "admin" },
    oss: {}
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
    // Set setUserInfo
    setOss(oss: UserState["oss"]) {
      this.oss = oss;
    }
  },
  persist: piniaPersistConfig(`${storePrefix}-user`)
});
