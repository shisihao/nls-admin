<template>
  <div>
    <div class="video-player">
      <Pic :is-domain="isDomain" :src="imageUrl" />
      <div class="play flx-center" @click="onShowVideoPopup"><el-icon><VideoPlay /></el-icon></div>
    </div>
    <el-dialog
      v-model="state.visible"
      width="600"
      title="视频查看"
      @closed="onClosed()"
    >
      <div v-if="state.defaultLoading" class="video-box">
        <video controls :src="isDomain ? `${oss.DoMain}${videoUrl}` : videoUrl"></video>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { VideoPlay } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/modules/user";
import Pic from "@/components/Picture/Pic.vue";

const userStore = useUserStore()
const { oss }: { oss: any } = storeToRefs(userStore)

interface VideoPopupProps {
  imageUrl: string; // 图片地址 ==> 必传
  videoUrl: string; // 视频地址 ==> 必传
  isDomain?: boolean; // 是否展示数据时添加阿里云前缀 ==> 非必传（默认为 true）
}

// 接受父组件参数
const props = withDefaults(defineProps<VideoPopupProps>(), {
  imageUrl: "",
  videoUrl: "",
  isDomain: true
});

const getInitialData = () => ({
  visible: false,
  defaultLoading: false
});

const state = reactive(getInitialData());

const onShowVideoPopup = () => {
  state.visible = true;
  state.defaultLoading = true;
};

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};
</script>

<style lang="scss" scoped>

.video-player {
  display: inline-block;
  width: 60px;
  height: 60px;
  cursor: pointer;
  position: relative;
  .play {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 20px;
  }
}
.video-box {
  video, img {
    max-width: 100%;
  }
}
</style>
