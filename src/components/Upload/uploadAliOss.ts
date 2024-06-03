import OSS from 'ali-oss'
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";
import { classType } from '@/utils/serviceDict'
import CalcVideo from '@/utils/calcVideo'
import { getMediaToken } from '@/api/modules/common'

const userStore = useUserStore()
const { oss }: { oss: any } = storeToRefs(userStore)

// 观察者 进度变化
let p = {
  p: 0,
  cpt: {}
};
const observers = [];
const notifyObservers = () => {
  observers.forEach((observer) => observer(p));
};
export const updateProgress = (newValue) => {
  p = newValue;
  notifyObservers();
};
export const addObserver = (observer) => {
  observers.push(observer);
};

let client;

export const uploadAliOssApi = async (options: { file: any }) => {
  const ossObj = {
    region: (oss.value.EndPoint || "").split(".")[0].replace("-internal", ""),
    accessKeyId: oss.value.AccessKeyId,
    accessKeySecret: oss.value.AccessKeySecret,
    stsToken: oss.value.SecurityToken,
    bucket: oss.value.BucketName,
    timeout: 60 * 1000,
    refreshSTSToken: async() => {
      const { data }: { data: any } = await getMediaToken()
      userStore.$patch((state) => {
        state.oss = data
      })
      return data
    },
    // 刷新临时访问凭证的时间间隔，单位为毫秒。
    refreshSTSTokenInterval: 3600 * 1000
  }

  if (['apk', 'ipa'].includes(options.file.name.split('.').pop())) {
    ossObj.bucket = oss.value.VersionBucketName;
  }

  client = new OSS(ossObj)

  let filename = `${String(+new Date()) + Math.random().toString(36).substr(2)}.${options.file.name.split('.').pop()}`
  let attribute = {
    duration: 0,
    fileSize: 0,
    width: 0,
    height: 0,
    type: ""
  }
  
  if (classType.videoType.includes(options.file.name.split('.').pop())) {
    filename = `video/${filename}`;
    // 计算视频大小
    const verifySize = new CalcVideo(options.file);
    verifySize
      .then((response) => {
        attribute = response
      })
  } else if (classType.documentType.includes(options.file.name.split('.').pop())) {
    filename = `document/${filename}`
  } else if (classType.imageType.includes(options.file.name.split('.').pop())) {
    filename = `image/${filename}`
  } else if (classType.androidType.includes(options.file.name.split('.').pop())) {
    filename = `android/${filename}`
  }

  const deploy = {
    // 设置分片大小。默认值为1 MB，最小值为100 KB。
    partSize: 20 * 1024 * 1024,
    progress: function(p, cpt, res) {
      updateProgress({
        p: p,
        cpt: cpt
      });
    }
  }
  if (options.resume) {
    deploy.checkpoint = p.cpt;
  }
  options.resume = false;

  try {
    const result: { res: { statusCode: number } } = await client.multipartUpload(filename, options.file, deploy)
    if (result.res.statusCode === 200) {
      if (attribute.duration > 0) {
        result.attribute = attribute;
      }
      return result;
    };
  } catch (e) {
    getMediaToken()
      .then(({ data }) => {
        userStore.$patch((state) => {
          state.oss = data
        })
      }) 
    throw new Error('上传失败, 请重试');
  }
}

export const uploadCancel = () => {
  client && client.cancel();
  updateProgress({
    p: 0,
    cpt: {}
  })
}