import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/home`, params);
};
