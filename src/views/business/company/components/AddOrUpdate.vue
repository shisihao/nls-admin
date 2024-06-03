<template>
  <div>
    <el-dialog
      v-model="state.visible"
      width="600"
      :title="state.form.id ? '编辑' : '新增'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClosed()"
    >
      <div v-if="state.defaultLoading">
        <el-form ref="refForm" :model="state.form" :rules="rules" label-width="120px">
          <el-form-item label="企业名称" prop="company_name">
            <el-input v-model="state.form.company_name" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="register_no">
            <el-input v-model="state.form.register_no" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="法人姓名" prop="legal_person">
            <el-input v-model="state.form.legal_person" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="联系人姓名" prop="user_name">
            <el-input v-model="state.form.user_name" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="联系人电话" prop="contact">
            <el-input v-model="state.form.contact" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="收款账户" prop="account_receivable.account_name">
            <el-input v-model="state.form.account_receivable.account_name" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="开户行" prop="account_receivable.bank">
            <el-input v-model="state.form.account_receivable.bank" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="银行账号" prop="account_receivable.account_number">
            <el-input v-model="state.form.account_receivable.account_number" placeholder="请输入" clearable />
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { validUsername } from "@/utils/eleValidate";
import { addOrUpdate } from "@/api/modules/company";

const refForm = ref<FormInstance>();

const validateUsername = (rule, value, callback) => {
  if (!validUsername(value)) {
    callback(new Error("名称只能是中英文及数字"));
  } else {
    callback();
  }
};

const rules = ref({
  company_name: [
    { required: true, message: "名称不能为空", trigger: ["blur", "change"] },
    { validator: validateUsername, trigger: ["blur", "change"] }
  ],
  register_no: [
    { required: true, message: "请输入", trigger: ["blur", "change"] }
  ],
  legal_person: [
    { required: true, message: "请输入", trigger: ["blur", "change"] },
    { validator: validateUsername, trigger: ["blur", "change"] }
  ],
  user_name: [
    { required: true, message: "请输入", trigger: ["blur", "change"] },
    { validator: validateUsername, trigger: ["blur", "change"] }
  ],
  contact: [
    { required: true, message: "请输入", trigger: ["blur", "change"] }
  ],
  "account_receivable.account_name": [
    { required: true, message: "请输入", trigger: ["blur", "change"] }
  ],
  "account_receivable.bank": [
    { required: true, message: "请输入", trigger: ["blur", "change"] }
  ],
  "account_receivable.account_number": [
    { required: true, message: "请输入", trigger: ["blur", "change"] }
  ]
});

const getInitialData = () => ({
  visible: false,
  defaultLoading: false,
  btnLoading: false,
  form: {
    id: 0,
    company_name: "",
    register_no: "",
    legal_person: "",
    user_name: "",
    contact: "",
    account_receivable: {
      account_name: "",
      bank: "",
      account_number: ""
    }
  }
});

const state = reactive(getInitialData());

const init = (row) => {
  state.visible = true;
  state.defaultLoading = true;
  if (row) {
    const data = JSON.parse(JSON.stringify(row));
    if (data.account_receivable) {
      state.form = data
    } else {
      state.form = {
        ...data,
        account_receivable: {
          account_name: "",
          bank: "",
          account_number: ""
        }
      }
    }
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
      const data = JSON.parse(JSON.stringify(state.form));
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
