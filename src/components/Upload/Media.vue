<template>
  <div class="upload-box">
    <el-upload
      v-model:file-list="fileList"
      action="#"
      ref="refUpload"
      :id="uuid"
      :class="[self_disabled ? 'disabled' : '']"
      :multiple="false"
      :limit="1"
      :accept="'.' + classType[`${fileType}Type`].join(',.')"
      :disabled="self_disabled"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-remove="beforeRemove"
      :on-remove="deleteMedia"
      :on-exceed="handleExceed"
    >
      <el-button type="primary">上传文件</el-button>
    </el-upload>
    <div>
      <el-space v-show="state.uploading"><span>上传<el-text type="danger">中断</el-text>，是否继续上传？</span><el-link type="primary" :underline="false" @click="onContinueUpload">继续</el-link><el-link type="danger" :underline="false" @click="onCancelUpload">取消</el-link></el-space>
      <el-progress v-show="![0, 100].includes(state.percentage)" :percentage="state.percentage" />
    </div>
  </div>
</template>

<script setup lang="ts" name="UploadMedia">
import { ref, computed, inject, onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";
import { generateUUID } from "@/utils";
import { classType } from "@/utils/serviceDict";
import { ElNotification, formContextKey, formItemContextKey, ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps, UploadRequestOptions } from "element-plus";
import { uploadAliOssApi, addObserver, uploadCancel } from "@/components/Upload/uploadAliOss";

const userStore = useUserStore();
const { oss }: { oss: any } = storeToRefs(userStore);

interface UploadFileProps {
  mediaUrl?: string; // 文件地址
  api?: (params: any) => Promise<any>; // 上传文件的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
  fileSize?: number; // 视频/文档 大小限制 ==> 非必传（默认为 2000M）
  fileType?: string; // 视频/文档类型限制 ==> 非必传（默认为 “video, document, android”）
}

// 接受父组件参数
const props = withDefaults(defineProps<UploadFileProps>(), {
  mediaUrl: "",
  api: uploadAliOssApi,
  disabled: false,
  fileSize: 2000,
  fileType: "video"
});

const state = reactive({
  resume: false,  // 继续上传（断点续传）
  uploading: false, // 是否上传中断
  percentage: 0
})

const handleChangePercentage = (newValue) => {
  // 处理p变化的逻辑
  state.percentage = parseInt(newValue.p * 100);
};
addObserver(handleChangePercentage);

const fileList = ref([]);

onMounted(() => {
  if (props.mediaUrl) {
    fileList.value.push({
      name: props.mediaUrl,
      url: `${oss.value.DoMain}${props.mediaUrl}`
    })
  }
})

// 生成组件唯一id
const uuid = ref("id-" + generateUUID());
// 生成上传组件的唯一id
const refUpload = ref();
// 保存当前上传文件
const fileRaw = ref();

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

/**
 * @description 文件上传
 * @param options upload 所有配置项
 * */
interface UploadEmits {
  (e: "update:mediaUrl", value: string): void;
  (e: "attribute", value: any): void;
}
const emit = defineEmits(['update:mediaUrl', 'attribute', 'onDeleteMedia', 'onBeforeUpload']);
const handleHttpUpload = async (options: UploadRequestOptions) => {
  try {
    fileRaw.value = options.file;
    options.resume = state.resume;
    const api = props.api;
    const data = await api(options);
    let fileName = data.name;
    emit("update:mediaUrl", fileName);
    emit("attribute", data.attribute);
    // 调用 el-form 内部的校验方法（可自动校验）
    // formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
  } catch (error) {
    options.onError(error as any);
  }
};

/**
 * @description 删除文件之前
 * */
const beforeRemove = (file, uploadFiles) => {
  return ElMessageBox.confirm(
    `是否移除文件 ${file.name} ?`,
    '提示',
    {
      autofocus: false
    }
  ).then(
    () => true,
    () => false
  )
}

/**
 * @description 超出文件限制数量
 * */
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning('超出文件上传限制个数，请先移除再添加')
}

/**
 * @description 删除文件
 * */
const deleteMedia = () => {
  if (props.mediaUrl) {
    emit("update:mediaUrl", "");
    emit("onDeleteMedia");
  } else {
    uploadCancel();
  }
};

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  state.uploading = false;
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize;
  const imgType = classType[`${props.fileType}Type`].includes(rawFile.name.split(".").pop());
  if (!imgType)
    ElNotification({
      title: "温馨提示",
      message: "上传文件不符合所需的格式！",
      type: "warning"
    });
  if (!imgSize)
    setTimeout(() => {
      ElNotification({
        title: "温馨提示",
        message: `上传文件不能超过 ${props.fileSize}M！`,
        type: "warning"
      });
    }, 0);
    
  emit("onBeforeUpload");
  return imgType && imgSize;
};

/**
 * @description 文件上传成功
 * */
const uploadSuccess = () => {
  ElNotification({
    title: "温馨提示",
    message: "文件上传成功！",
    type: "success"
  });
};

/**
 * @description 文件上传错误
 * */
const uploadError = () => {
  state.uploading = true;
  ElNotification({
    title: "温馨提示",
    message: "文件上传失败，请您重新上传！",
    type: "error"
  });
};

/**
 * @description 继续上传文件（断点续传）
 */
const onContinueUpload = () => {
  state.uploading = false;
  state.resume = true;
  refUpload.value?.clearFiles();
  refUpload.value?.handleStart(fileRaw.value);
  refUpload.value?.submit();
}

/**
 * @description 取消上传文件分片请求（即是清空）
 */
const onCancelUpload = () => {
  refUpload.value?.clearFiles();
  state.uploading = false;
  uploadCancel();
}
</script>

<style scoped lang="scss">
</style>
