import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/roles`, params);
};

// 详情
export const roleItem = ({ id, ...params } : { id: number, params: any}) => {
  return http.get(PORT1 + `/roles/${id}`, params);
};

// 添加 / 修改
export const addOrUpdate = ({ id, ...params }: { id: number, params: any}) => {
  let url = '/roles'
  if (id > 0) {
    url = `${url}/${id}`;
    return http.put(PORT1 + url, params);
  }
  return http.post(PORT1 + url, params);
};

// 删除
export const deleteData = (id: string | number) => {
  return http.delete(PORT1 + `/roles/${id}`);
};
