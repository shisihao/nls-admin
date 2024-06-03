<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="account">
      <el-input v-model="loginForm.code" maxlength="6" placeholder="请输入谷歌验证码" clearable>
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="ArrowLeft" round size="large" @click="goBack"> 上一步 </el-button>
    <el-button :icon="UserFilled" round size="large" type="primary" :loading="loading" @click="login(loginFormRef)">
      确定
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { ArrowLeft, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";

const title = import.meta.env.VITE_GLOB_APP_TITLE;

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  code: [{ required: true, message: "不能为空", trigger: "blur" }]
});

const loading = ref(false);
const loginForm = reactive({
  account: "",
  password: "",
  code: ""
});

const init = (data: any) => {
  loginForm.account = data.account;
  loginForm.password = data.password;
};

defineExpose({ init });

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      const { data }: { data: any } = await loginApi({ ...loginForm });
      userStore.setToken(data.admin.admin_token);
      userStore.setUserInfo(data.admin);
      userStore.setOss(data.oss);

      // 2.添加动态路由
      await initDynamicRouter();

      // 3.清空 tabs、keepAlive 数据
      tabsStore.closeMultipleTab();
      keepAliveStore.setKeepAliveName();

      // 4.跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: `欢迎登录 ${title}`,
        type: "success",
        duration: 3000
      });
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

const emit = defineEmits(["goBack"]);

const goBack = () => {
  resetForm(loginFormRef.value);
  emit("goBack");
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
