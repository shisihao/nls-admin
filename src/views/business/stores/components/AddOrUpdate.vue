<template>
  <div>
    <el-dialog
      v-model="state.visible"
      top="30px"
      width="800"
      :title="state.form.id ? '编辑' : '新增'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClosed"
    >
      <div v-if="state.defaultLoading" v-loading="state.loading">
        <el-form ref="refForm" :model="state.form" :rules="rules" label-width="140px">
          <el-form-item label="门店类型" prop="cate_id">
            <el-radio-group v-model="state.form.cate_id">
              <el-radio v-for="(item, index) in storeTypeOptions.slice(1)" :key="index" :value="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="封面图" prop="image">
            <UploadImg v-model:image-url="state.form.image" />
            <div class="w-100">
              <el-text type="info" size="small">图片不得超过2M，建议分辨率为 686px * 344px</el-text>
            </div>
          </el-form-item>
          <el-form-item label="门店头图" prop="cover">
            <UploadImgs v-model:file-list="state.form.cover" :limit="5" :is-domain="true">
              <template #empty>
                <el-icon><Picture /></el-icon>
                <span>点击上传 {{ state.form.cover.length }}/5</span>
              </template>
            </UploadImgs>
            <div class="w-100">
              <el-text type="info" size="small">图片不得超过2M，建议分辨率为 686px * 686px</el-text>
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
          <el-form-item v-if="state.form.status === 0" label="预定地址" prop="address_id">
            <el-select v-model="state.form.address_id" class="w-100" placeholder="请选择">
              <el-option
                v-for="(item, index) in state.addressOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="企业" prop="company_id">
            <el-select v-model="state.form.company_id" class="w-100" placeholder="请选择">
              <el-option
                v-for="(item, index) in state.companyOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="城市" prop="region_id">
            <el-cascader
              v-model="state.form.regionVal"
              class="w-100"
              :options="treeAddress({ levels: 2 })"
              @change="onChangeAddress"
            />
          </el-form-item>
          <el-form-item label="合伙人人数" prop="count">
            <el-input-number v-model="state.form.count" :min="1" :max="6" :precision="0" />
            <div class="w-100">
              <el-text type="info" size="small">注意：合伙人人数 1-6</el-text>
            </div>
          </el-form-item>
          <el-form-item label="价格/人" prop="price">
            <el-input-number v-model="state.form.price" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="合伙人分红比例(%)" prop="dividend_ratio">
            <el-input-number v-model="state.form.dividend_ratio" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="推荐人分红比例(%)" prop="recommend_ratio">
            <el-input-number v-model="state.form.recommend_ratio" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="分红倍率" prop="magnification">
            <el-input-number v-model="state.form.magnification" :min="0" :precision="2" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="state.form.sort" :min="0" :precision="0" />
            <div class="w-100">
              <el-text type="info" size="small">注意：数字越大越靠前</el-text>
            </div>
          </el-form-item>
          <el-form-item label="内容" prop="detail">
            <el-link type="primary" :underline="false" @click="onEditor(state.form.detail)">点击编辑</el-link>
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
    <WangEditorPopup ref="refWangEditorPopup" @update-detail="onUpdateDetail" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";
import BigNumber from "bignumber.js";
import { ElMessage, FormInstance } from "element-plus";
import { treeAddress, treeId } from '@/utils/address';
import { storeTypeOptions } from "@/utils/serviceDict";
import { addOrUpdate } from '@/api/modules/stores';
import { filterCompany, filterAddress } from '@/api/modules/common';
import UploadImgs from "@/components/Upload/Imgs.vue";
import WangEditorPopup from "@/components/WangEditor/WangEditorPopup.vue";
import UploadImg from "@/components/Upload/Img.vue";

const userStore = useUserStore()
const { oss }: { oss: any } = storeToRefs(userStore)

const refForm = ref<FormInstance>();

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  companyOptions: [],
  addressOptions: [],
  form: {
    id: 0,
    cate_id: 1,
    image: '',
    cover: [],
    name: "",
    start_time: "",
    regionVal: [],
    address_id: "",
    region_id: "",
    company_id: "",
    count: 1,
    price: 0,
    status: 0,
    recommend_ratio: 0,
    dividend_ratio: 0,
    magnification: 0,
    sort: 0,
    detail: ""
  }
});

const state = reactive(getInitialData());

const rules = ref({
  cate_id: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  image: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  cover: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  name: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  start_time: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  region_id: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  company_id: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  count: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  price: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  recommend_ratio: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  dividend_ratio: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  magnification: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  sort: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  detail: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }]
});

const getFilterCompany = async () => {
  const data = await filterCompany();
  return data;
}

const getFilterAddress = async () => {
  const data = await filterAddress();
  return data;
}

const init = (row: any) => {
  state.visible = true;
  // state.loading = true;
  state.defaultLoading = true;
  
  getFilterCompany()
    .then((response) => {
      state.companyOptions = response.data.map(v => {
        return {
          label: v.company_name,
          value: v.id
        }
      });
    })

  if (!row || row.status === 0) {
    getFilterAddress()
      .then((response) => {
        state.addressOptions = response.data.map(v => {
          return {
            value: v.id,
            label: v.region?.merger_name  + " " +  v.address
          }
        });
        if (row?.address_id) {
          state.addressOptions.unshift({ value: row.address_id, label: row.address?.region?.merger_name  + " " +  row.address?.address });
        }
      })
  }
  if (row) {
    const data = JSON.parse(JSON.stringify(row));
    state.form = data;
    state.form.address_id = data.address_id || '';
    state.form.price = new BigNumber(data.price).toNumber();
    state.form.recommend_ratio = new BigNumber(data.recommend_ratio).toNumber();
    state.form.dividend_ratio = new BigNumber(data.dividend_ratio).toNumber();
    state.form.magnification = new BigNumber(data.magnification).toNumber();
    state.form.regionVal = treeId({ levels: 2 }).find(v => v.at(-1) === data.region_id);
    
    state.form.cover = data.cover.map((v) => {
      return {
        name: v,
        url: `${oss.value.DoMain}${v}`
      }
    });
  }
};

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};

defineExpose({
  init
});

const onChangeAddress = (val:any) => {
  state.form.region_id = [...val].pop();
}

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
      data.cover = state.form.cover.map((v) => {
        return v.name
      })
      data.address_id = data.address_id || 0;
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
