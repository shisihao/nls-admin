import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/order`, params);
};

// 审核
export const auditStatus = ({ id, ...params}:{ id:number, params:any }) => {
  return http.put(PORT1 + `/order/audit/${id}`, params);
}

// 关闭订单
export const closeOrder = ({ id, ...params}:{ id:number, params:{ reason:string } }) => {
  return http.put(PORT1 + `/order/close`, params)
}

// 导出流水
export const exportOrder = (params: any) => {
  return http.get(PORT1 + `/order/export`, params);
}
