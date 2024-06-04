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
