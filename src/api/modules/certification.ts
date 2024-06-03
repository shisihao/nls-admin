import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/certifications`, params);
};

// 审核
export const auditStatus = ({ id, ...params}:{ id:number, params:any }) => {
  return http.put(PORT1 + `/certifications/${id}/pass`, params);
}

// 导出实名用户
export const exportCertifications = (params: any) => {
  return http.get(PORT1 + `/certifications/export`, params);
};
