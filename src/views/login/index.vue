<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <SwitchDark class="dark" />
      <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_left2.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo.png" alt="" />
          <h2 class="logo-text">{{ title }}</h2>
        </div>
        <div v-show="state.step === 0">
          <LoginForm @check-inspect="onCheckInspect" />
        </div>
        <div v-show="state.step === 1">
          <CheckLogin ref="refCheckLogin" @go-back="onGoBack" />
        </div>
      </div>
    </div>
    <AuthenticatorDialog ref="refAuthenticatorDialog" />
  </div>
</template>

<script setup lang="ts" name="login">
import { ref, reactive } from "vue";
import SwitchDark from "@/components/SwitchDark/index.vue";
import LoginForm from "./components/LoginForm.vue";
import CheckLogin from "./components/CheckLogin.vue";
import AuthenticatorDialog from "./components/AuthenticatorDialog.vue";

const refCheckLogin = ref();
const refAuthenticatorDialog = ref();

const title = import.meta.env.VITE_GLOB_APP_TITLE;

const state = reactive({
  step: 0
});

const onCheckInspect = (response: any) => {
  if (response.is_bind == 1) {
    state.step = 1;
    refCheckLogin.value.init(response);
  } else {
    refAuthenticatorDialog.value.init(response);
  }
};

const onGoBack = () => {
  state.step = 0;
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
