import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/entityOrders`, params);
};

/**
 * 发货
 * @param order_id
 * @param logistics_id
 * @param logistics_no
 * @returns 
 */
export const sendDelivery = ({ ...params }:{ params:any }) => {
  return http.post(PORT1 + `/entityOrders/delivery`, params);
}

// 审核
export const auditStatus = ({ id, ...params}:{ id:number, params:any }) => {
  return http.put(PORT1 + `/entityOrders/audit/${id}`, params);
}

// 关闭订单
export const closeOrder = ({ id, ...params }:{ id:number, params:{ reason:string } }) => {
  return http.patch(PORT1 + `/entityOrders/${id}/close`, params)
}

// 导出流水
export const exportOrder = (params: any) => {
  return http.get(PORT1 + `/entityOrders/export`, params);
}
