<template>
  <div>
    <el-dialog
      v-model="state.visible"
      width="600"
      title="认证链接"
      @closed="onClosed"
    >
      <div v-if="state.defaultLoading" v-loading="state.loading">
        <el-link type="primary" class="break-word" target='_blank' :href="state.form.auth_url">{{ state.form.auth_url }}</el-link>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button :icon="Refresh" :disabled="state.loading" @click="onRefreshAuthUrl">刷新</el-button>
          <el-button :disabled="state.loading" v-copy="state.form.auth_url">复制链接</el-button>
          <el-button @click="state.visible = false"> 关闭 </el-button>
          <!-- <el-button type="primary" :loading="state.btnLoading" @click="onFormSubmit">确定</el-button>
          <el-button @click="state.visible = false"> 取消 </el-button> -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Refresh } from "@element-plus/icons-vue";
import { companyAuthUrl } from '@/api/modules/company';

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  form: {
    id: 0,
    auth_url: ""
  }
});

const state = reactive(getInitialData());

const getCompanyAuthUrl = () => {
  state.loading = true;
  companyAuthUrl({ id: state.form.id })
    .then((response) => {
      state.form.auth_url = response.data.auth_url;
      state.loading = false;
    })
}

const init = (row: any) => {
  state.visible = true;
  state.defaultLoading = true;
  if (row) {
    state.form.id = row.id;
    if (row.auth_url) {
      state.form.auth_url = row.auth_url;
    } else {
      getCompanyAuthUrl();
    }
  }
};

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};

defineExpose({
  init
});

const onRefreshAuthUrl = () => {
  getCompanyAuthUrl();
}

const onFormSubmit = () => {
  state.visible = false;
};
</script>

<style lang="scss" scoped>
.content {
  min-height: 60vh;
  :deep(img) {
    max-width: 100%;
  }
  :deep(video) {
    max-width: 100%;
  }
}
</style>
