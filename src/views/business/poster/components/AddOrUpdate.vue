<template>
  <el-dialog
    v-model="state.visible"
    width="600"
    :title="state.form.id ? '编辑' : '新增'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="onClosed"
  >
    <div v-if="state.defaultLoading">
      <el-form ref="refForm" :model="state.form" :rules="rules" label-width="120px">
        <el-form-item label="海报" prop="url">
          <UploadImg v-model:image-url="state.form.url"/>
          <div style="width: 100%;">
            <el-text type="info" size="small">图片不得超过5M，建议分辨率为 750px * 1140px</el-text>
          </div>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="state.form.name" placeholder="请输入分类名称" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="state.form.sort" :min="0" :precision="0" placeholder="排序" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :loading="state.btnLoading" @click="onFormSubmit">确定</el-button>
        <el-button @click="state.visible = false"> 取消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { addOrUpdate } from '@/api/modules/poster';
import UploadImg from "@/components/Upload/Img.vue";

const refForm = ref<FormInstance>();

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  form: {
    id: 0,
    url: "",
    name: "",
    sort: 0
  }
});

const state = reactive(getInitialData());

const rules = ref({
  url: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  name: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  sort: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }]
});

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

const emit = defineEmits(["refreshList"]);

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
      const data:any = { ...state.form }
      state.btnLoading = true;
      addOrUpdate(data)
        .then(({ msg }) => {
          ElMessage.success({ message: msg });
          state.visible = false;
          emit("refreshList");
        })
        .finally(() => {
          state.btnLoading = false;
        });
    } catch (error) {
      console.log(error);
    }
  });
};
</script>

<style lang="scss" scoped>
</style>
