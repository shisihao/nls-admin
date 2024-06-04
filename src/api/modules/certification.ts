import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/records`, params);
};

/**
 * 审核
 * @param {number} id 
 * @param {string} reason 
 * @returns 
 */
export const auditStatus = ({ id, ...params}:{ id:number, params:any }) => {
  return http.put(PORT1 + `/records/${id}`, params);
}

// 导出实名用户
export const exportCertifications = (params: any) => {
  return http.get(PORT1 + `/records/export`, params);
};
