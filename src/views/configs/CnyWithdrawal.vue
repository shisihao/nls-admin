<template>
  <div class="card content-box-left" v-loading="state.loading">
    <el-form ref="refForm" :model="state.form" :rules="rules" class="width-800" label-width="160px">
      <el-form-item label="是否可提现" prop="switch">
        <el-switch v-model="state.form.switch" active-value="on" inactive-value="off" />
      </el-form-item>
      <el-form-item label="费率(%)" prop="fee">
        <el-input-number v-model="state.form.fee" :precision="2" :min="0" />
      </el-form-item>
      <el-form-item label="用户最低提现额度(元)" prop="user_min">
        <el-input-number v-model="state.form.user_min" :precision="2" :min="0" />
      </el-form-item>
      <!-- <el-form-item label="可提现金额" prop="condition">
        <el-space wrap>
          <el-tag
            v-for="(item, index) in state.form.condition"
            :key="item"
            effect="plain"
            size="default"
            closable
            @close="handleClose(index)"
          >
            {{ item }}
          </el-tag>
          <el-space v-if="state.tagVisible">
            <el-input-number
              ref="refInput"
              v-model="state.tagValue"
              controls-position="right"
              :precision="2"
              :min="0"
            />
            <el-button type="primary" plain @click="handleInputConfirm">
              确定
            </el-button>
            <el-button plain @click="handleInputCancel">
              取消
            </el-button>
          </el-space>
          <el-button v-else @click="onShowInput">
            + 金额选项
          </el-button>
        </el-space>
      </el-form-item> -->
      <el-form-item label="提现说明" prop="instr">
        <el-input v-model="state.form.instr" type="textarea" placeholder="提现说明" clearable :rows="4" />
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
import { cnyWithdrawal } from "@/api/modules/config";

const refForm = ref<FormInstance>();

const state = reactive({
  loading: false,
  btnLoading: false,
  tagVisible: false,
  tagValue: 0,
  form: {
    switch: "on", // 提现开关
    fee: 0, // 手续费比例
    user_min: 0, // 用户最低提现额度(元)
    // exchange: 0, //积分与现金兑换比例
    // user_day_limit: 0, // 用户提现每日上限(元)
    // terrace_day_limit: 0, // 平台提现每日上限(元)
    // condition: [],  //可提现金额,
    instr: "" // 提现说明
  }
})

const validateCondition = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error("不能少于6个条件"));
  } else {
    callback();
  }
};

const rules = {
  switch: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ],
  fee: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ],
  user_min: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ],
  exchange: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ],
  condition: [
    { required: true, message: '不能为空', trigger: ['blur', 'change'] },
    { validator: validateCondition, trigger: ['blur', 'change'] }
  ],
  instr: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ],
  terrace_day_limit: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ],
  user_day_limit: [ { required: true, message: '请输入', trigger: ['blur', 'change'] } ]
}

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
      state.btnLoading = true;
      cnyWithdrawal({ method: 'put', params: state.form })
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
  cnyWithdrawal({ method: 'get' })
    .then((response: any) => {
      const data = response.data?.value;
      // data.exchange = new BigNumber(data.exchange).toNumber();
      data.fee = new BigNumber(data.fee).toNumber();
      data.user_min = new BigNumber(data.user_min).toNumber();
      state.form = data;
    })
    .finally(() => {
      state.loading = false;
    })
})

const handleInputCancel = () => {
  state.tagVisible = false;
  state.tagValue = 0;
}

const handleInputConfirm = () => {
  if (state.tagValue && state.form.condition.includes(state.tagValue)) {
    return ElMessage.success({ message: '您已添加此条件' });
  }
  if (state.tagValue) {
    state.form.condition.push(state.tagValue);
  }
  handleInputCancel();
}

const handleClose = (index:number) => {
  state.form.condition.splice(index, 1);
}

const onShowInput = () => {
  state.tagVisible = true;
}
</script>

<style lang="scss" scoped>
</style>