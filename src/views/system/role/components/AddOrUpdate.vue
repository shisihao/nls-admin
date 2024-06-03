<template>
  <div>
    <el-dialog
      v-model="state.visible"
      width="600"
      top="30px"
      :title="state.form.id ? '编辑' : '新增'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClosed()"
    >
      <div v-loading="state.loading">
        <el-form ref="refForm" :model="state.form" :rules="rules" label-width="100px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="state.form.name" placeholder="请输入角色名称" clearable />
          </el-form-item>
          <el-form-item label="别名" prop="alias">
            <el-input v-model="state.form.alias" placeholder="请输入角色别名(字母)" clearable />
          </el-form-item>
          <el-form-item label="权限" prop="permissions">
            <TreeFilter label="name" style="height: 600px;" :multiple="true" :check-strictly="true" :default-value="state.form.permissions" :data="state.menuList" @change="onChangeTreeFilter" />
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
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getSelectFormatMenuList, extractValues } from "@/utils/index";
import { validUsername, validAlphabets } from "@/utils/eleValidate";
import { addOrUpdate } from "@/api/modules/role";
import { getList } from "@/api/modules/menu";
import TreeFilter from "@/components/TreeFilter/index.vue";

const refForm = ref<FormInstance>();

const validateUsername = (rule: any, value: any, callback: any) => {
  if (!validUsername(value)) {
    callback(new Error("只能是中文、字母+数字"));
  } else {
    callback();
  }
};

const validateAlias = (rule: any, value: any, callback: any) => {
  if (!validUsername(value)) {
    callback(new Error("只能是中文、字母+数字"));
  } else {
    callback();
  }
};

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  menuList: [],
  form: {
    id: 0,
    name: "",
    alias: "",
    permissions: []
  }
});

const state = reactive(getInitialData());

const rules = ref({
  name: [
    { required: true, message: "不能为空", trigger: ["blur", "change"] },
    { validator: validateUsername, trigger: ['blur', 'change'] }
  ],
  alias: [
    { required: true, message: "不能为空", trigger: ["blur", "change"] },
    { validator: validateAlias, trigger: ['blur', 'change'] }
  ]
});

const getMenusHandle = async () => {
  if (state.loading) return;
  state.loading = true;
  const { data } = await getList().finally(() => state.loading = false);
  state.menuList = getSelectFormatMenuList(data as any) as [];
}

const init = (row: { permissions: [ { id: number } ], [key: string]: any }) => {
  state.visible = true;
  getMenusHandle();
  if (row) {
    const { id, name, alias, permissions } = JSON.parse(JSON.stringify(row))
    state.form.id = id;
    state.form.name = name;
    state.form.alias = alias;
    state.form.permissions = permissions.map((v: {id: number}) => v.id) as any;
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
      state.btnLoading = true;
      addOrUpdate(state.form)
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

const onChangeTreeFilter = (val: string[]) => {
  state.form.permissions = val as [];
}
</script>

<style lang="scss" scoped>
.notice {
  width: 100%;
}
</style>
