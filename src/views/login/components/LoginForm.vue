<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="account">
      <el-input v-model="loginForm.account" placeholder="请输入账号" clearable>
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password clearable autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="Refresh" round size="large" @click="resetForm(loginFormRef)"> 重置 </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { ElNotification } from "element-plus";
import { checkBind } from "@/api/modules/common";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { Refresh, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();

const loginRules = reactive({
  account: [{ required: true, message: "不能为空", trigger: "blur" }],
  password: [{ required: true, message: "不能为空", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive({
  account: "",
  password: ""
});

const emit = defineEmits(["checkInspect"]);

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const { data }: { data: any } = await checkBind({ ...loginForm });
      emit("checkInspect", { ...data, ...loginForm });
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return;
      login(loginFormRef.value);
    }
  };
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
