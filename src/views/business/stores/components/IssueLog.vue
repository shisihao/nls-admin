<template>
  <div>
    <el-dialog
      v-model="state.visible"
      width="600"
      title="流水添加"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClosed"
    >
      <div v-if="state.defaultLoading">
        <el-form ref="refForm" :model="state.form" :rules="rules" label-width="120px">
          <el-form-item label="日期" prop="date">
            <el-date-picker
              v-model="state.form.date"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="金额" prop="amount">
            <el-input-number v-model="state.form.amount" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="采购成本" prop="purchasing_cost">
            <el-input-number v-model="state.form.purchasing_cost" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="固定成本" prop="fixed_cost">
            <el-input-number v-model="state.form.fixed_cost" :min="0" :precision="2" />
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
import { issueLog } from '@/api/modules/stores';

const refForm = ref<FormInstance>();

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  form: {
    id: 0,
    date: "",
    amount: 0,
    purchasing_cost: 0,
    fixed_cost: 0
  }
});

const state = reactive(getInitialData());

const rules = ref({
  date: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  amount: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  purchasing_cost: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  fixed_cost: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
});

const init = (row: any) => {
  state.visible = true;
  state.defaultLoading = true;
  if (row) {
    state.form.id = row.id;
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
      const data:any = { ...state.form }
      state.btnLoading = true;
      issueLog(data)
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
