<template>
  <div class="card content-box-left" v-loading="state.loading">
    <el-form ref="refForm" :model="state.form" :rules="rules" class="width-800" label-width="160px">
      <el-form-item label="推荐订单奖励(%)" prop="invite_percent">
        <el-input-number v-model="state.form.invite_percent" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item label="合伙分红奖励(%)" prop="sale_percent">
        <el-input-number v-model="state.form.sale_percent" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item label="推荐选址奖励(元)" prop="recommend_fee">
        <el-input-number v-model="state.form.recommend_fee" :precision="2" :min="0" />
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
import { reward } from "@/api/modules/config";

const refForm = ref<FormInstance>();

const state = reactive({
  loading: false,
  btnLoading: false,
  tagVisible: false,
  tagValue: 0,
  form: {
    invite_percent: 0,
    sale_percent: 0,
    recommend_fee: 0
  }
})

const rules = {
  invite_percent: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ],
  sale_percent: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ],
  recommend_fee: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ]
}

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
      state.btnLoading = true;
      reward({ method: 'put', params: state.form })
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
  reward({ method: 'get' })
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