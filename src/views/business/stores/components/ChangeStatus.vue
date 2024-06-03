<template>
  <div>
    <el-dialog
      v-model="state.visible"
      width="600"
      title="状态更改"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClosed"
    >
      <div v-if="state.defaultLoading" v-loading="state.loading">
        <el-form ref="refForm" :model="state.form" :rules="rules" label-width="120px">
          <el-form-item label="门店状态" prop="status">
            <el-radio-group v-model="state.form.status" @change="onChangeStatus">
              <el-radio v-for="(item, index) in storeStatusOptions.slice(1)" :key="index" :disabled="item.value !== (state.initialStatus + 1)" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="state.address" label="门店地址">
            {{ state.address }}
          </el-form-item>
          <el-form-item v-else-if="state.form.status === 2 && state.initialStatus === 1" label="门店地址" prop="address_id">
            <el-select v-model="state.form.address_id" class="w-100" placeholder="请选择">
              <el-option
                v-for="(item, index) in state.addressOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" v-if="state.initialStatus !== state.form.status" :loading="state.btnLoading" @click="onFormSubmit">确定</el-button>
          <el-button @click="state.visible = false"> 取消 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { storeStatusOptions } from "@/utils/serviceDict";
import { auditStatus } from '@/api/modules/stores';
import { filterAddress } from '@/api/modules/common';

const refForm = ref<FormInstance>();

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  addressOptions: [],
  initialStatus: 0,
  address: "",
  form: {
    id: 0,
    status: 0,
    address_id: ""
  }
});

const state = reactive(getInitialData());

const validateStatus = (rule, value, callback) => {
  if (value <= 0) {
    callback(new Error("请选择门店状态"));
  } else {
    callback();
  }
};

const rules = ref({
  status: [
    { required: true, message: "不能为空", trigger: ["blur", "change"] },
    { validator: validateStatus, trigger: ["blur", "change"] }
  ],
  address_id: [{ required: false, message: "不能为空", trigger: ["blur", "change"] }]
});

const getFilterAddress = async () => {
  const data = await filterAddress();
  return data;
}

const init = (row: any) => {
  state.visible = true;
  state.defaultLoading = true;
  if (row) {
    const data = JSON.parse(JSON.stringify(row));
    if (data.status === 1) {
      state.loading = true;
      getFilterAddress()
        .then((response) => {
          state.addressOptions = response.data.map(v => {
            return {
              value: v.id,
              label: v.region?.merger_name  + " " +  v.address
            }
          });
          state.loading = false;
        })
    }
    state.form.id = data.id;
    state.form.status = data.status;
    state.form.address_id = "";
    state.initialStatus = data.status;
    if (data.address_id) {
      state.address = data.address?.region?.merger_name + " " + data.address?.address;
    }
  }
};

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};

defineExpose({
  init
});

const onChangeStatus = (val) => {
  let bool = false;
  if (val === 2) {
    bool = true;
  } else {
    state.form.address_id = "";
  }
  rules.value.address_id[0].required = bool;
}

const emit = defineEmits(["refreshList"]);

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
      const data:any = { ...state.form }
      state.btnLoading = true;
      auditStatus(data)
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
