import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * 获取列表
 * @param {number} type 0， 1
 * @returns 
 */
export const getList = (params: any) => {
  return http.get(PORT1 + `/questions`, params);
};

// 添加 / 修改
export const addOrUpdate =  ({ id, ...params } : { id: number, params: any}) => {
  let url = '/questions'
  if (id > 0) {
    url = `${url}/${id}`;
    return http.put(PORT1 + url, params);
  }
  return http.post(PORT1 + url, params);
};

// 删除
export const deleteData = (id: number) => {
  return http.delete(PORT1 + `/questions/${id}`);
};