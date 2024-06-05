import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/users`, params);
};

// 添加 / 修改
export const addOrUpdate =  ({ id, ...params } : { id: number, params: any}) => {
  let url = '/users'
  if (id > 0) {
    url = `${url}/${id}`;
    return http.put(PORT1 + url, params);
  }
  return http.post(PORT1 + url, params);
};

// 删除
export const deleteData = (id: number) => {
  return http.delete(PORT1 + `/users/${id}`);
};

// 导出用户信息
export const exportUser = (params: any) => {
  return http.get(PORT1 + `/users/export/info`, params);
}

/**
 * 审核
 * @param {number} id 
 * @param {number} status 
 * @param {string} reason 
 * @returns 
 */
export const auditStatus = ({ id, ...params}:{ id:number, params:any }) => {
  return http.put(PORT1 + `/users/audit/${id}`, params);
}

