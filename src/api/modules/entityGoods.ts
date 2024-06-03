import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/entityGoods`, params);
};

// 添加 / 修改
export const addOrUpdate =  ({ id, ...params } : { id: number, params: any}) => {
  let url = '/entityGoods'
  if (id > 0) {
    url = `${url}/${id}`;
    return http.put(PORT1 + url, params);
  }
  return http.post(PORT1 + url, params);
};

// 删除
export const deleteData = (id: number) => {
  return http.delete(PORT1 + `/entityGoods/${id}`);
};

// 详情
export const detail = ({ id, ...params}:{ id:number, params:any }) => {
  return http.get(PORT1 + `/entityGoods/${id}`, params);
}

// 上下架
export const auditStatus = ({ id, ...params}:{ id:number, params:any }) => {
  return http.post(PORT1 + `/entityGoods/status/${id}`, params);
}

