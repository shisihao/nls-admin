<template>
  <el-dialog
    v-model="state.visible"
    title="上级"
    width="750"
    align-center
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="onClosed()"
  >
    <div v-if="state.defaultLoading">
      <TreeFilter label="name" :data="state.menuList" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import TreeFilter from "@/components/TreeFilter/index.vue";

const getInitialData = () => ({
  visible: false,
  defaultLoading: false,
  menuList: []
});

const state = reactive(getInitialData());

const init = ({ menuList } : { menuList: any }) => {
  state.visible = true;
  state.defaultLoading = true;
  state.menuList = menuList;
};

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};

defineExpose({
  init
});
</script>

<style lang="scss" scoped>
</style>
