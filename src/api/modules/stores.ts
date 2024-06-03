import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取列表
export const getList = (params: any) => {
  return http.get(PORT1 + `/stores`, params);
};

// 添加 / 修改
export const addOrUpdate =  ({ id, ...params } : { id: number, params: any}) => {
  let url = '/stores'
  if (id > 0) {
    url = `${url}/${id}`;
    return http.put(PORT1 + url, params);
  }
  return http.post(PORT1 + url, params);
};

// 门店详情
export const storeDetail = ({ id, ...params}:{ id:number, params:any }) => {
  return http.get(PORT1 + `/stores/${id}`, params);
}

// 获取门店流水列表
export const getTradeLogList = (params: any) => {
  return http.get(PORT1 + `/stores/trade_log`, params);
};

// 获取分红流水列表
export const getRewardLogList = (params: any) => {
  return http.get(PORT1 + `/stores/logs`, params);
};

// 店铺状态更改
export const auditStatus = ({ id, ...params}:{ id:number, params:any }) => {
  return http.put(PORT1 + `/stores/update_status/${id}`, params);
}

// 营业流水添加 状态为营业中
export const issueLog = ({ id, ...params}:{ id:number, params:any }) => {
  return http.post(PORT1 + `/stores/issue/${id}`, params);
}

// 发起合同
export const sendContract = ({ id, ...params}:{ id:number, params:any }) => {
  return http.get(PORT1 + `/stores/sign/${id}`, params);
}