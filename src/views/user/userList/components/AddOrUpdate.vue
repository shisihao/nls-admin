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
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="state.form.type">
            <el-radio v-for="(item, index) in userTypeOptions.slice(1)" :key="index" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="state.form.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="state.form.phone" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card">
          <el-input v-model="state.form.id_card" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="风险等级" prop="level">
          <el-input v-model="state.form.level" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="产品名称" prop="product">
          <el-input v-model="state.form.product" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="产品风险等级" prop="product_level">
          <el-input v-model="state.form.product_level" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item v-if="state.form.type === 1" label="公司名称" prop="company_name">
          <el-input v-model="state.form.company_name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item v-if="state.form.type === 1" label="统一社会信用代码" prop="company_code">
          <el-input v-model="state.form.company_code" placeholder="请输入" clearable />
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
import { validUsername, validPhone, validIdCard } from "@/utils/eleValidate";
import { userTypeOptions } from '@/utils/serviceDict';
import { addOrUpdate } from '@/api/modules/user';
import UploadImg from "@/components/Upload/Img.vue";

const refForm = ref<FormInstance>();

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  form: {
    id: 0,
    type: 0,
    name: '',
    phone: '',
    id_card: '',
    level: '',
    product: '',
    product_level: '',
    company_name: '',
    company_code: ''
  }
});

const state = reactive(getInitialData());

const validateUsername = (rule, value, callback) => {
  if (!validUsername(value)) {
    callback(new Error("名称只能是中英文及数字"));
  } else {
    callback();
  }
};

const validateAccount = (rule, value, callback) => {
  if (!validPhone(value)) {
    callback(new Error("手机号格式错误"));
  } else {
    callback();
  }
};

const validateIdCard = (rule, value, callback) => {
  if (!validIdCard(value)) {
    callback(new Error("身份证号错误"));
  } else {
    callback();
  }
};

const rules = ref({
  name: [
    { required: true, message: "不能为空", trigger: ["blur", "change"] },
    { validator: validateUsername, trigger: ["blur", "change"] }
  ],
  phone: [
    { required: true, message: '不能为空', trigger: ['blur', 'change'] },
    { validator: validateAccount, trigger: ['blur', 'change'] }
  ],
  id_card: [
    { required: true, message: '不能为空', trigger: ['blur', 'change'] },
    { validator: validateIdCard, trigger: ['blur', 'change'] }
  ],
  level: [
    { required: true, message: '不能为空', trigger: ['blur', 'change'] }
  ],
  product: [
    { required: true, message: '不能为空', trigger: ['blur', 'change'] }
  ],
  product_level: [
    { required: true, message: '不能为空', trigger: ['blur', 'change'] }
  ],
  company_name: [
    { required: true, message: '不能为空', trigger: ['blur', 'change'] }
  ],
  company_code: [
    { required: true, message: '不能为空', trigger: ['blur', 'change'] }
  ]
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
      const data:any = { ...state.form };
      if (!data.password) {
        delete data.password;
        delete data.password_confirmation;
      }
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
