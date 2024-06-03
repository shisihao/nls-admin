<template>
  <el-dialog
    v-model="state.visible"
    width="600"
    :title="state.form.id ? '编辑' : '新增'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="onClosed()"
  >
    <div v-if="state.defaultLoading" v-loading="state.loading">
      <el-form ref="refForm" :model="state.form" :rules="rules" label-width="120px">
        <el-form-item label="广告标识" prop="pos_id">
          <el-select v-model="state.form.pos_id" placeholder="请选择">
            <el-option
              v-for="(item, index) in posListOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="广告类型" prop="url_type">
          <el-radio-group v-model="state.form.url_type">
            <el-radio v-for="(item, index) in adsTypeOptions.slice(1)" :key="index" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="state.form.url_type !== 0 " label="广告链接" prop="url">
          <el-input v-model="state.form.url" :placeholder="'请输入广告链接, 如：'+ (state.form.url_type === 1 ? 'http://www.baidu.com' : 'product_id|商品信息ID')" clearable />
          <el-text v-if="state.form.url_type === 2" type="info" class="notice">
            注意：选择内联广告时，请用以下方式输入
            <div>
              1.商品详情：product_id|商品信息ID
            </div>
          </el-text>
        </el-form-item>
        <el-form-item
          label="广告图片"
          prop="image"
        >
          <UploadImg v-model:image-url="state.form.image" />
          <div v-if="state.form.pos_id" style="width: 100%;">
            <el-text type="info" size="small">图片不得超过5M，建议分辨率为 {{ paraphrase({ value: state.form.pos_id, options: posListOptions, l: 'size' }) }}</el-text>
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="state.form.sort" :min="0" placeholder="排序" />
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
import { ElMessage, FormInstance, dayjs } from "element-plus";
import { adsTypeOptions } from "@/utils/serviceDict";
import { paraphrase } from "@/utils/filter";
import { addOrUpdate, posList } from "@/api/modules/ads";
import UploadImg from "@/components/Upload/Img.vue";

const refForm = ref<FormInstance>();

interface OptionsInstance {
  label: string;
  value: number|string;
  size?: string;
}
const posListOptions = ref<Array<OptionsInstance>>([]);

const getInitialData = () => ({
  visible: false,
  defaultLoading: false,
  loading: false,
  btnLoading: false,
  form: {
    id: 0,
    pos_id: '',
    image: '',
    url: '',
    url_type: 0,
    sort: 0
  }
});

const state = reactive(getInitialData());

const rules = ref({
  pos_id: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  image: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  url: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  url_type: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  sort: { required: true, message: "不能为空", trigger: ["blur", "change"] }
});

const getPosList = async () => {
  if (state.loading) return;
  state.loading = true;
  const { data } = await posList().finally(() => state.loading = false);
  posListOptions.value = data.map(v => {
    return {
      label: v.name,
      value: v.id,
      size: v.size
    }
  });
}

const init = (row: any) => {
  state.visible = true;
  state.defaultLoading = true;
  getPosList();
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
      const data = { ...state.form }
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
.notice {
  width: 100%;
  line-height: 1.5;
}
</style>
