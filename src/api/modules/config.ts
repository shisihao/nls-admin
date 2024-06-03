import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取 / 修改
export const cnyWithdrawal = ({ method, params }: { method:'get'|'put', params?:any }) => {
  let url = '/configs/cny_withdrawal';
  return http[method](PORT1 + url, params);
};

// 获取 / 修改
export const paySwitch = ({ method, params }: { method:'get'|'put', params?:any }) => {
  let url = '/configs/pay_switch';
  return http[method](PORT1 + url, params);
};

// 获取 / 修改
export const shopPaySwitch = ({ method, params }: { method:'get'|'put', params?:any }) => {
  let url = '/configs/shop_pay_switch';
  return http[method](PORT1 + url, params);
};

// 获取 / 修改
export const account = ({ method, params }: { method:'get'|'put', params?:any }) => {
  let url = '/configs/account';
  return http[method](PORT1 + url, params);
};

// 获取 / 修改
export const reward = ({ method, params }: { method:'get'|'put', params?:any }) => {
  let url = '/configs/reward';
  return http[method](PORT1 + url, params);
};

// 获取 / 修改
export const invite = ({ method, params }: { method:'get'|'put', params?:any }) => {
  let url = '/configs/invite';
  return http[method](PORT1 + url, params);
};
