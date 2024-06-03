<template>
  <div class="card content-box-left" v-loading="state.loading">
    <el-form ref="refForm" :model="state.form" :rules="rules" class="width-800" label-width="120px">
      <el-form-item label="企业名称" prop="account_name">
        <el-input v-model="state.form.account_name" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="开户行" prop="bank">
        <el-input v-model="state.form.bank" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="银行账号" prop="account_number">
        <el-input v-model="state.form.account_number" placeholder="请输入" clearable />
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
import { account } from "@/api/modules/config";

const refForm = ref<FormInstance>();

const state = reactive({
  loading: false,
  btnLoading: false,
  form: {
    account_name: "",
    bank: "",
    account_number: ""
  }
})

const rules = {
  account_name: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ],
  bank: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ],
  account_number: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ]
}

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
      state.btnLoading = true;
      account({ method: 'put', params: state.form })
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
  account({ method: 'get' })
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