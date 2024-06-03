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
      <div v-loading="state.loading">
        <el-form ref="refForm" :model="state.form" :rules="rules" label-width="100px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="state.form.name" placeholder="名称" clearable />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="state.form.email" placeholder="邮箱" clearable />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="state.form.phone" placeholder="手机号" maxlength="11" clearable />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="state.form.password" type="password" placeholder="密码" clearable :maxlength="30" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="state.form.confirmPassword" type="password" placeholder="确认密码" clearable :maxlength="30" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="state.form.role" placeholder="请选择">
              <el-option v-for="(item, index) in state.rolesOptions" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-radio-group v-model="state.form.state">
              <el-radio :value="0">正常</el-radio>
              <el-radio :value="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :disabled="state.loading" :loading="state.btnLoading" @click="onFormSubmit">确定</el-button>
          <el-button @click="state.visible = false"> 取消 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { paraphrase } from "@/utils/filter";
import { generateUUID } from "@/utils/index";
import { menuTypeOptions } from "@/utils/serviceDict";
import { validUsername, validEmail, validPhone } from "@/utils/eleValidate";
import { addOrUpdate } from "@/api/modules/admin";
import { getList } from '@/api/modules/role'
import SelectIcon from "@/components/SelectIcon/index.vue";

const refForm = ref<FormInstance>();

const validateUsername = (rule, value, callback) => {
  if (!validUsername(value)) {
    callback(new Error("名称只能是中英文及数字"));
  } else {
    callback();
  }
};
const validateEmail = (rule, value, callback) => {
  if (!validEmail(value)) {
    callback(new Error("邮箱格式错误"));
  } else {
    callback();
  }
};
const validatePhone = (rule, value, callback) => {
  if (!validPhone(value)) {
    callback(new Error("手机号格式错误"));
  } else {
    callback();
  }
};
const validatePassword = (rule, value, callback) => {
  if (!state.form.id && !/\S/.test(value)) {
    callback(new Error("密码不能为空"));
  } else {
    callback();
  }
};
const validateConfirmPassword = (rule, value, callback) => {
  if (!state.form.id && !/\S/.test(value)) {
    callback(new Error("确认密码不能为空"));
  } else if (state.form.password !== value) {
    callback(new Error("确认密码与密码输入不一致"));
  } else {
    callback();
  }
};

const rules = ref({
  name: [
    { required: true, message: "名称不能为空", trigger: ["blur", "change"] },
    { validator: validateUsername, trigger: ["blur", "change"] }
  ],
  email: [
    { required: true, message: "邮箱不能为空", trigger: ["blur", "change"] },
    { validator: validateEmail, trigger: ["blur", "change"] }
  ],
  phone: [
    { required: true, message: "手机号不能为空", trigger: ["blur", "change"] },
    { validator: validatePhone, trigger: ["blur", "change"] }
  ],
  password: [{ validator: validatePassword, trigger: ["blur", "change"] }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: ["blur", "change"] }],
  role: [{ required: true, message: "请选择角色", trigger: ["blur", "change"] }],
  state: [{ required: true, message: "请选择角色", trigger: ["blur", "change"] }]
});

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  rolesOptions: [],
  form: {
    id: 0,
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    state: 0,
    role: ""
  }
});

const state = reactive(getInitialData());

const getRolesHandle = async () => {
  if (state.loading) return;
  state.loading = true;
  const { data } = await getList().finally(() => state.loading = false);
  state.rolesOptions = data.map(v => {
    return {
      label: v.name,
      value: v.id
    }
  });
}

const init = (row) => {
  state.visible = true;
  getRolesHandle();
  if (row) {
    const { roles, ...data } = JSON.parse(JSON.stringify(row));
    state.form = data;
    state.form.role = roles?.[0]?.id;
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
      const data = state.form as any;
      if (data.role) {
        data.roles = [data.role]
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
