<template>
  <div class="card content-box-left" v-loading="state.loading">
    <el-form ref="refForm" :model="state.form" :rules="rules" label-width="80px">
      <el-form-item label="录制须知" prop="video_text">
        <WangEditor v-model:value="state.form.video_text" :hide-tool-bar="true" height="400px" style="width:1000px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="state.btnLoading" @click="onFormSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import BigNumber from "bignumber.js";
import { videoText } from "@/api/modules/config";
import WangEditor from "@/components/WangEditor/index.vue";

const refForm = ref<FormInstance>();

const state = reactive({
  loading: false,
  btnLoading: false,
  form: {
    video_text: ""
  }
})

const rules = {
  video_text: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ]
}

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
      state.btnLoading = true;
      videoText({ method: 'put', params: state.form })
        .then(({ msg }) => {
          ElMessage.success({ message: msg });
        })
        .finally(() => {
          state.btnLoading = false;
        });
    } catch (error) {
      console.log(error);
    }
  });
}

onMounted(() => {
  state.loading = true;
  videoText({ method: 'get' })
    .then((response: any) => {
      const data = response.data?.value;
      state.form.video_text = data;
    })
    .finally(() => {
      state.loading = false;
    })
})
</script>

<style lang="scss" scoped>
</style>