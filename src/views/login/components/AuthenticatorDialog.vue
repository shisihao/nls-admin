<template>
  <el-dialog v-model="state.dialogVisible" width="750" top="30px" title="绑定谷歌验证码" @closed="onClosed()">
    <div>
      <h3>如何使用谷歌验证器？</h3>
      <p><b>第一步</b>，下载并安装谷歌身份验证器（Google Authenticator）,切勿在来路不明的地方下载使用。</p>
      <p>
        <b>第二步</b>
        ，打开谷歌身份验证器App，安卓手机点击“添加新账户”，苹果手机点击“+”，扫描二维码添加；如果无法扫描二维码，可以手动输入密钥。
      </p>
      <p>
        <b>第三步</b>，<span style="color: #f56c6c">
          备份！二维码和密钥，功能是一样的，只要有其中的任何一个，都可以知道你的谷歌验证码。所以，要像重视加密货币的钱包私钥一样，最好是备份到离线的设备。
        </span>
      </p>
      <p><b>第四步</b>，填写谷歌身份验证码，完成谷歌身份验证绑定。</p>
      <p style="text-align: center">
        <img src="@/assets/images/google_authenticator.jpg" width="300" />
      </p>
      <div>在第四步中，如果你输入的谷歌验证码不对，有以下几种解决措施：</div>
      <div>1. 检查手机的系统时间是否准确。谷歌验证码和时间是密切相关的，系统时间不一致，会对验证码产生影响。</div>
      <div>2. 确保你输入的是有效的谷歌验证码。验证码默认每 30秒更新一次。</div>
      <p>如果误删了谷歌验证器 App，只要重新下载App，输入步骤三中备份的二维码或是明文密钥即可。</p>
      <p>
        <el-link type="primary" href="https://google-authenticator.en.softonic.com/android" target="_blank">安卓下载地址</el-link>
      </p>
      <div style="text-align: center">
        <div>
          密钥：<b>{{ state.secret }}</b>
        </div>
        <el-image class="qrcosw-url" :src="state.url" />
      </div>
      <el-form
        ref="refForm"
        :model="state.form"
        :rules="rules"
        label-width="100px"
        size="large"
        style="width: 400px; margin: 0 auto"
        @submit.prevent
      >
        <el-form-item label="谷歌验证码" prop="code">
          <el-input
            v-model="state.form.code"
            maxlength="6"
            placeholder="请输入谷歌验证码"
            clearable
            @keyup.enter="onDelAuthenticator"
          />
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" size="large" :loading="state.btnLoading" @click="onDelAuthenticator"> 确定 </el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import QRCode from "qrcode";
import { setBind } from "@/api/modules/common";

const refForm: any = ref();

const rules = reactive({
  code: [{ required: true, message: "不能为空", trigger: "blur" }]
});

const getInitialData = () => ({
  dialogVisible: false,
  btnLoading: false,
  secret: "",
  url: "",
  form: {
    account: "",
    password: "",
    code: ""
  }
});

const state = reactive(getInitialData());

const onClose = () => {
  state.dialogVisible = false;
};

const onClosed = () => {
  refForm.value.resetFields();
  Object.assign(state, getInitialData());
};

const init = (data: any) => {
  state.dialogVisible = true;
  state.secret = data.secret;
  state.form.account = data.account;
  state.form.password = data.password;
  QRCode.toDataURL(`otpauth://totp/登录：${location.origin}?secret=${state.secret}`, { margin: 1 }, (err: any, url: string) => {
    if (err) throw new Error(err);
    state.url = url;
  });
};

defineExpose({ init });

const onDelAuthenticator = () => {
  refForm.value.validate(async (valid: any) => {
    if (!valid) return;
    state.btnLoading = true;
    try {
      const { msg } = await setBind(state.form);
      ElMessage({
        type: "success",
        message: msg
      });
      onClose();
    } finally {
      state.btnLoading = false;
    }
  });
};
</script>

<style scoped lang="scss">
.qrcosw-url {
  width: 120px;
  height: 120px;
}
</style>
