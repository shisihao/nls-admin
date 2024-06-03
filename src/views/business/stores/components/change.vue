<template>
  <div>
    <el-dialog
      v-model="state.visible"
      width="600"
      title="状态"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClosed"
    >
      <div v-if="state.defaultLoading">
        <el-form ref="refForm" :model="state.form" :rules="rules" label-width="140px">
          <el-form-item label="门店头图" prop="cover">
            <UploadImg v-model:image-url="state.form.cover" :file-size="2"/>
            <div class="w-100">
              <el-text type="info" size="small">图片不得超过2M，建议分辨率为 746px * 344px</el-text>
            </div>
          </el-form-item>
          <el-form-item label="门店名称" prop="name">
            <el-input v-model="state.form.name" placeholder="请输入门店名称" clearable />
          </el-form-item>
          <el-form-item label="启动时间" prop="start_time">
            <el-date-picker
              v-model="state.form.start_time"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择"
            />
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="state.form.price" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="推荐人人分红比例(%)" prop="recommend_ratio">
            <el-input-number v-model="state.form.recommend_ratio" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="合伙人分红比例(%)" prop="dividend_ratio">
            <el-input-number v-model="state.form.dividend_ratio" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="分红倍率" prop="magnification">
            <el-input-number v-model="state.form.magnification" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="内容" prop="detail">
            <el-link type="primary" :underline="false" @click="onEditor(state.form.detail)">点击编辑</el-link>
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
    <WangEditorPopup ref="refWangEditorPopup" @update-detail="onUpdateDetail" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import BigNumber from "bignumber.js";
import { ElMessage, FormInstance } from "element-plus";
import { addOrUpdate } from '@/api/modules/stores';
import UploadImg from "@/components/Upload/Img.vue";
import WangEditorPopup from "@/components/WangEditor/WangEditorPopup.vue";

const refForm = ref<FormInstance>();

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  form: {
    id: 0,
    cover: "22",
    name: "",
    start_time: "",
    price: 0,
    recommend_ratio: 0,
    dividend_ratio: 0,
    magnification: 0,
    detail: ""
  }
});

const state = reactive(getInitialData());

const rules = ref({
  cover: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  name: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  start_time: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  price: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  recommend_ratio: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  dividend_ratio: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  magnification: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  detail: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }]
});

const init = (row: any) => {
  state.visible = true;
  state.defaultLoading = true;
  if (row) {
    state.form = JSON.parse(JSON.stringify(row));
    state.form.price = new BigNumber(row.price).toNumber();
    state.form.recommend_ratio = new BigNumber(row.recommend_ratio).toNumber();
    state.form.dividend_ratio = new BigNumber(row.dividend_ratio).toNumber();
    state.form.magnification = new BigNumber(row.magnification).toNumber();
  }
};

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};

defineExpose({
  init
});

const refWangEditorPopup = ref();
const onEditor = (detail:string) => {
  refWangEditorPopup.value.init(detail)
}

const onUpdateDetail = (value:string) => {
  state.form.detail = value;
}

const emit = defineEmits(["refreshList"]);

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
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
</script>

<style lang="scss" scoped>
</style>
