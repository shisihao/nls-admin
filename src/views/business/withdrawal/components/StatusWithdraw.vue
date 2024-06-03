<template>
  <el-dialog
    v-model="state.visible"
    width="600"
    :title="state.form.status === 1 ? '通过申请' : '驳回申请'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="onClosed()"
  >
    <div class="el-message-box__container">
      <div class="el-message-box__status" :class="state.form.status === 1 ? 'el-icon-success' : 'el-icon-error'" />
      <div class="el-message-box__message">
        <p style="text-transform:uppercase;">
          <el-text size="default" :type="state.form.status === 1 ? 'success' : 'danger'">{{`${state.form.status === 1 ? "通过" : "驳回"}`}}</el-text> 用户[#{{ state.row.user?.id }} {{ state.row.user?.name }} {{ state.row.user?.certification?.name }}]
          <el-row>
            <el-col :span="12">
              <div>
                提现：¥{{ state.row.amount }}
              </div>
              <div>
                到账：¥{{ state.row.account_amount }}
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                手续费：¥{{ state.row.service_charge }}
              </div>
              <div>
                余额：¥{{ state.row.withdraw_balance }}
              </div>
            </el-col>
          </el-row>
        </p>
      </div>
    </div>

    <div v-if="state.defaultLoading" v-loading="state.loading">
      <el-form
        ref="refForm"
        :model="state.form"
        :rules="rules"
        label-width="100px"
        style="margin-top: 20px"
      >
        <el-form-item v-if="state.form.status === 1" label="谷歌验证码" prop="code">
          <el-input
            v-model="state.form.code"
            style="width: 200px;"
            maxlength="6"
            placeholder="谷歌验证码"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="state.form.status === 2" label="驳回原因" prop="reason">
          <el-input v-model="state.form.reason" placeholder="驳回原因" clearable />
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
</template>

<script setup lang="ts">
  import { reactive, ref } from "vue";
  import { ElMessage, FormInstance } from "element-plus";
  import { examineAudit } from "@/api/modules/withdrawal";

  const refForm = ref<FormInstance>();

  const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  row: {
    user: {},
    amount: 0,
    account_amount: 0,
    withdraw_balance: 0,
    service_charge: 0
  },
  form: {
    id: 0,
    status: 1,
    reason: '',
    code: ''
  }
});

const state = reactive(getInitialData());

const rules = ref({
  code: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  reason: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
});

const init = (row: any, status: number) => {
  state.visible = true;
  state.defaultLoading = true;
  
  state.row = row;
  state.form.id = row.id;
  state.form.status = status;
}

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
      const data:any = { ...state.form }
      examineAudit(data)
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
