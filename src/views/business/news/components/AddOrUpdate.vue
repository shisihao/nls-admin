<template>
  <div>
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
          <el-form-item label="封面图" prop="cover">
            <UploadImg v-model:image-url="state.form.cover"/>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="state.form.title" placeholder="请输入标题" clearable />
          </el-form-item>
          <el-form-item label="置顶" prop="is_top">
            <el-radio-group v-model="state.form.is_top">
              <el-radio v-for="(item, index) in isStatusOptions.slice(1)" :key="index" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-link type="primary" :underline="false" @click="onEditor(state.form.content)">点击编辑</el-link>
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
    <WangEditorPopup ref="refWangEditorPopup" @update-detail="onUpdateDetail" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { isStatusOptions } from '@/utils/serviceDict';
import { addOrUpdate } from '@/api/modules/news';
import UploadImg from "@/components/Upload/Img.vue";
import WangEditorPopup from "@/components/WangEditor/WangEditorPopup.vue";

const refForm = ref<FormInstance>();

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  form: {
    id: 0,
    cover: "",
    title: "",
    content: "",
    is_top: 0
  }
});

const state = reactive(getInitialData());

const rules = ref({
  cover: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  title: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  content: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  is_top: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }]
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

const refWangEditorPopup = ref();
const onEditor = (detail:string) => {
  refWangEditorPopup.value.init(detail)
}

const onUpdateDetail = (value:string) => {
  state.form.content = value;
}

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
