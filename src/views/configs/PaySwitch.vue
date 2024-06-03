<template>
  <div class="card content-box-left" v-loading="state.loading">
    <el-form ref="refForm" :model="state.form" :rules="rules" class="width-800" label-width="120px">
      <el-form-item label="微信" prop="wxpay">
        <el-switch v-model="state.form.wxpay" active-value="on" inactive-value="off" />
      </el-form-item>
      <el-form-item label="公户" prop="bank">
        <el-switch v-model="state.form.bank" active-value="on" inactive-value="off" />
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
import { paySwitch } from "@/api/modules/config";
const refForm = ref<FormInstance>();

const state = reactive({
  loading: false,
  btnLoading: false,
  form: {
    wxpay: "off",
    bank: "off"
  }
})

const rules = {
  wxpay: [
    { required: true, message: '请输入', trigger: ['blur', 'change'] }
  ],
  bank: [
    { required: true, message: '请输入', trigger: ['blur', 'change'] }
  ]
}

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
      state.btnLoading = true;
      paySwitch({ method: 'put', params: { switch: state.form } })
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
  paySwitch({ method: 'get' })
    .then((response: any) => {
      state.form = response.data?.value;
    })
    .finally(() => {
      state.loading = false;
    })
})
</script>

<style lang="scss" scoped>
</style>