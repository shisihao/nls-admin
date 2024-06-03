<template>
  <el-image
    :style="{ width: width , height: height }"
    :fit="fit"
    :alt="alt"
    :src="source"
    :preview-src-list="previewSrcList?.length ? previewSrcList : [source]"
  >
    <template #error>
      <div class="image-slot">
        <el-icon><Picture /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<script setup lang="ts" name="pic">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";
import { Picture } from '@element-plus/icons-vue'

const userStore = useUserStore();
const { oss } = storeToRefs(userStore);

interface ImageProps {
  fit?: string;  // 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  alt?: string;
  src: string|null;
  width?: string;
  height?: string;
  previewSrcList?: any;
  isDomain?: boolean; // 是否添加为阿里云域名前缀 ==> 非必传（默认为 false）
}

const props = withDefaults(defineProps<ImageProps>(), {
  fit: "cover",
  alt: "",
  src: "",
  width: "60px",
  height: "60px",
  previewSrcList: [],
  isDomain: false
});

const source = computed(() => {
  return (props.isDomain && props.src) ? `${oss.value.DoMain}${props.src}` : props.src;
})
</script>
<style lang="scss" scoped>
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 16px;
}
</style>
