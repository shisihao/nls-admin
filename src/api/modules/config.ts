import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

// 获取 / 修改 录制须知
export const videoText = ({ method, params }: { method:'get'|'put', params?:any }) => {
  let url = '/configs/video_text';
  return http[method](PORT1 + url, params);
};
