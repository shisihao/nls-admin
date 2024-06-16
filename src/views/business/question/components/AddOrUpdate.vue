<template>
  <el-dialog
    v-model="state.visible"
    width="600"
    :title="state.form.id ? '编辑' : '新增'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="onClosed"
  >
    <div v-if="state.defaultLoading">
      <el-form ref="refForm" :model="state.form" :rules="rules" label-width="100px">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="state.form.type">
            <el-radio v-for="(item, index) in userTypeOptions.slice(1)" :key="index" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="问题" prop="ask">
          <el-input v-model="state.form.ask" type="textarea" :rows="6" placeholder="请输入问题" clearable />
        </el-form-item>
        <el-form-item label="回答" prop="answers">
          <div>
            <el-space>
              <el-input
                v-model.trim="state.newSpecsValue"
                class="w300"
                clearable
                placeholder="请输入回答"
                @keyup.enter="onAddSpecsValue()"
                >
                <template #append><div class="flx-center cursor" @click="onAddSpecsValue()"><el-icon><Plus /></el-icon>添加</div></template>
              </el-input>
            </el-space>
          </div>
          <div style="width: 100%;">
            <el-space wrap style="margin-top: 10px;">
              <el-tag
                v-for="(tag, index) in state.form.answers"
                :key="index"
                effect="plain"
                closable
                @close="onCloseSpecsValue(index)"
              >
                {{ tag }}
              </el-tag>
            </el-space>
          </div>
        </el-form-item>
        <el-form-item label="回答限时(秒)" prop="seconds">
          <el-input-number v-model="state.form.seconds" :min="0" :precision="0" placeholder="回答限时" />
          <div style="width: 100%;">
            <el-text type="info">注意：默认为5秒</el-text>
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="state.form.sort" :min="0" :precision="0" placeholder="排序" />
          <div style="width: 100%;">
            <el-text type="info">注意：越大越靠前</el-text>
          </div>
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
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { userTypeOptions } from '@/utils/serviceDict';
import { addOrUpdate } from '@/api/modules/question';

const refForm = ref<FormInstance>();

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  newSpecsValue: '',
  form: {
    id: 0,
    type: 0,
    ask: "",
    seconds: 5,
    answers: [],
    sort: 0
  }
});

const state = reactive(getInitialData());

const rules = ref({
  type: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  ask: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  seconds: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  sort: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }]
});

const init = (row: any) => {
  state.visible = true;
  state.defaultLoading = true;
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
      // if (state.form.answers.length === 0) {
      //   ElMessage.warning({ message: "请添加回答" });
      //   return;
      // }

      const data:any = { ...state.form }
      state.btnLoading = true;
      addOrUpdate(data)
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

const onAddSpecsValue = () => {
  if (!state.newSpecsValue) return;

  if (state.form.answers.includes(state.newSpecsValue)) {
    ElMessage.warning({ message: "不能重复添加" });
    return;
  }
  state.form.answers.push(state.newSpecsValue);
  state.newSpecsValue = '';
}

const onCloseSpecsValue = (index) => {
  state.form.answers.splice(index, 1);
}
</script>

<style lang="scss" scoped>
.w300 {
  width: 300px;
}
.cursor {
  cursor: pointer;
  user-select: none;
}
</style>
