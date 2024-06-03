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
      <div v-if="state.defaultLoading">
        <el-form ref="refForm" :model="state.form" :rules="rules" label-width="100px">
          <el-form-item label="类型" prop="type">
            <el-radio-group v-model="state.form.type">
              <el-radio v-for="(item, index) in menuTypeOptions" :key="index" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="paraphrase({ value: state.form.type, options: menuTypeOptions }) + '名称'" prop="name">
            <el-input v-model="state.form.name" placeholder="请输入(例：首页）" clearable />
          </el-form-item>
          <el-form-item :label="paraphrase({ value: state.form.type, options: menuTypeOptions }) + '别名'" prop="alias">
            <el-input v-model="state.form.alias" placeholder="请输入(例：home)" clearable />
          </el-form-item>
          <el-form-item :label="paraphrase({ value: state.form.type, options: menuTypeOptions }) + '跳转地址'" prop="url">
            <el-input v-model="state.form.url" placeholder="请输入(例：/home/index)" clearable />
          </el-form-item>
          <el-form-item :label="paraphrase({ value: state.form.type, options: menuTypeOptions }) + '图标'" prop="icon">
            <SelectIcon v-model:icon-value="state.form.icon" :key="generateKey" />
          </el-form-item>
          <el-form-item :label="'上级' + paraphrase({ value: state.form.type, options: menuTypeOptions })" prop="pid">
            <el-tree-select v-model="state.form.pid" style="width: 100%;" label="name" check-strictly clearable :data="state.menuList" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="state.form.sort" :min="0" :precision="0" placeholder="排序" />
            <el-text class="notice">注：用于菜单栏展示顺序</el-text>
          </el-form-item>
          <el-form-item label="是否显示" prop="show">
            <el-radio-group v-model="state.form.show">
              <el-radio :value="0">不显示</el-radio>
              <el-radio :value="1">显示</el-radio>
            </el-radio-group>
            <el-text class="notice">注：标识是否在侧边栏显示</el-text>
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
import { reactive, ref, computed } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { paraphrase } from "@/utils/filter";
import { generateUUID } from "@/utils/index";
import { menuTypeOptions } from "@/utils/serviceDict";
import { validUsername } from "@/utils/eleValidate";
import { addOrUpdate } from "@/api/modules/menu";
import SelectIcon from "@/components/SelectIcon/index.vue";

const refForm = ref<FormInstance>();

const validateUsername = (rule: any, value: any, callback: any) => {
  if (!validUsername(value)) {
    callback(new Error("只能是中文、字母"));
  } else {
    callback();
  }
};

const getInitialData = () => ({
  visible: false,
  btnLoading: false,
  defaultLoading: false,
  menuList: [],
  form: {
    id: 0,
    type: 0,
    name: "",
    alias: "",
    url: "",
    icon: "",
    sort: 0,
    show: 1,
    pid: ""
  }
});

const state = reactive(getInitialData());

const generateKey = computed(() => {
  return state.visible ? undefined : generateUUID();
});

const rules = ref({
  type: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  name: [
    { required: true, message: "不能为空", trigger: ["blur", "change"] },
    { validator: validateUsername, trigger: ["blur", "change"] }
  ],
  alias: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  pid: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  sort: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  show: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }]
});

const init = ({ row, menuList } : { row: any; menuList: any; }) => {
  state.visible = true;
  state.defaultLoading = true;
  state.menuList = [ { value: 0, label: '默认' } , ...menuList ] as any;
  if (row) {
    state.form = JSON.parse(JSON.stringify(row));
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
</script>

<style lang="scss" scoped>
.notice {
  width: 100%;
}
</style>
