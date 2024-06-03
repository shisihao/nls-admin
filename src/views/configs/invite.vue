<template>
  <div class="card content-box-left" v-loading="state.loading">
    <el-form ref="refForm" :model="state.form" :rules="rules" class="width-800" label-width="80px">
      <el-form-item label="邀请规则" prop="invite">
        <el-input v-model="state.form.invite" type="textarea" placeholder="邀请规则" clearable :rows="8" />
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
import { invite } from "@/api/modules/config";

const refForm = ref<FormInstance>();

const state = reactive({
  loading: false,
  btnLoading: false,
  tagVisible: false,
  form: {
    invite: ""
  }
})

const rules = {
  invite: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ]
}

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
      state.btnLoading = true;
      invite({ method: 'put', params: state.form })
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
  invite({ method: 'get' })
    .then((response: any) => {
      const data = response.data?.value;
      state.form = data;
    })
    .finally(() => {
      state.loading = false;
    })
})
</script>

<style lang="scss" scoped>
</style>