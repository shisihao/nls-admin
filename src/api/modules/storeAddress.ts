import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/store_address`, params);
};

// 选定
export const setStore = ({ id, ...params } : { id: number, params: any}) => {
  return http.put(PORT1 + `/store_address/set_store/${id}`, params);
};