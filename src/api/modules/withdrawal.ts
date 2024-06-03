import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/withdrawals`, params);
};

// 审核
export const examineAudit = ({ id, ...params } : { id: number, params: any}) => {
  return http.put(PORT1 + `/withdrawals/audit/${id}`, params);
};

// 导出
export const exportData = (params?: any) => {
  return http.get(PORT1 + `/withdrawals/export`, params);
};