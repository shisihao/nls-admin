<template>
  <el-avatar
    :icon="icon"
    :size="size"
    :shape="shape"
    :fit="fit"
    :alt="alt"
    :src="source"
  />
</template>

<script setup lang="ts" name="avatar">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const { oss } = storeToRefs(userStore);

interface AvatarProps {
  icon?: string;
  size?: number | string;  // 'large' | 'default' | 'small'
  shape?: string;  // 'circle' | 'square'
  fit?: string;  // 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  alt?: string;
  src: string|null;
  isDomain?: boolean; // 是否添加为阿里云域名前缀 ==> 非必传（默认为 false）
}

const props = withDefaults(defineProps<AvatarProps>(), {
  icon: "UserFilled",
  size: "default",
  shape: "circle",
  fit: "cover",
  alt: "",
  src: "",
  isDomain: false
});

const source = computed(() => {
  return (props.isDomain && props.src) ? `${oss.value.DoMain}${props.src}` : props.src;
})
</script>
<style lang="scss" scoped>
</style>
