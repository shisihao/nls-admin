import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * 获取列表
 * @param {number} number 
 * @returns 
 */
export const getList = (params: any) => {
  return http.get(PORT1 + `/verifications`, params);
};
