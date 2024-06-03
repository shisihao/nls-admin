import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 公共接口
 */
// 验证账号
export const checkBind = (params: any) => {
  return http.post(PORT1 + `/check_bind`, params, { noLoading: true });
};

// 登录绑定谷歌验证码
export const setBind = (params: any) => {
  return http.post(PORT1 + `/bind`, params, { noLoading: true });
};

// 获取对象存储 上传token
export const getMediaToken = (params?: any) => {
  return http.get(PORT1 + `/token`, params);
};

// 系统日志列表
export const getSystemlogList = (params?: any) => {
  return http.get(PORT1 + `/syslog`, params);
};

// 用户列表
export const filterUser = (params?: any) => {
  return http.get(PORT1 + `/public/user/filter`, params);
};

// 地址列表
export const filterAddress = (params?: any) => {
  return http.get(PORT1 + `/public/address`, params);
};

// 门店列表
export const filterStore = (params?: any) => {
  return http.get(PORT1 + `/public/store`, params);
};

// 企业列表
export const filterCompany = (params?: any) => {
  return http.get(PORT1 + `/public/company`, params);
};

// 地区
export const filterRegion = (params?: any) => {
  return http.get(PORT1 + `/public/region`, params);
};

// 商品分类
export const filterGallery = (params?: any) => {
  return http.get(PORT1 + `/public/filter/gallery`, params);
};

// 运费模版
export const filterDelivery = (params?: any) => {
  return http.get(PORT1 + `/public/filter/delivery`, params);
};

// 物流公司
export const filterLogistics = (params?: any) => {
  return http.get(PORT1 + `/public/filter/logistics`, params);
};