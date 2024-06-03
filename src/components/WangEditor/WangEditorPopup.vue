<template>
  <el-dialog
    v-model="state.visible"
    top="30px"
    width="1000"
    title="富文本"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="onClosed"
  > 
    <!-- 每次 visible 都重新加载富文本编辑器，否则编辑器会报错 -->
    <WangEditor v-model:value="state.content" v-model:resetEditor="state.editorVisible" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="onFormSubmit">确定</el-button>
        <el-button @click="state.visible = false"> 取消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="wangEditorPopup">
import { reactive } from "vue";
import WangEditor from "@/components/WangEditor/index.vue";

const getInitialData = () => ({
  visible: false,
  editorVisible: false,
  content: "",
});

const state = reactive(getInitialData());

const init = (content: any) => {
  state.visible = true;
  state.editorVisible = true;
  state.content = content;
};

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};

defineExpose({
  init
});

const emit = defineEmits(['updateDetail']);

const onFormSubmit = () => {
  emit('updateDetail', state.content);
  state.visible = false;
}
</script>

<style scoped lang="scss">
</style>
