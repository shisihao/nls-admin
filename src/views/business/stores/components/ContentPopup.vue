<template>
  <div>
    <el-dialog
      v-model="state.visible"
      top="30px"
      width="800"
      title="内容"
      @closed="onClosed"
    >
      <div v-if="state.defaultLoading">
        <h2>
          {{ state.form.name }}
        </h2>
        <div class="content" v-html="state.form.detail"></div>
      </div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :loading="state.btnLoading" @click="onFormSubmit">确定</el-button>
          <el-button @click="state.visible = false"> 取消 </el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  form: {
    id: 0,
    cover: "",
    name: "",
    detail: ""
  }
});

const state = reactive(getInitialData());

const init = (row: any) => {
  state.visible = true;
  state.defaultLoading = true;
  if (row) {
    state.form = JSON.parse(JSON.stringify(row));
  }
};

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};

defineExpose({
  init
});

const onFormSubmit = () => {
  state.visible = false;
};
</script>

<style lang="scss" scoped>
.content {
  min-height: 60vh;
  :deep(img) {
    max-width: 100%;
  }
  :deep(video) {
    max-width: 100%;
  }
}
</style>
