<template>
  <div class="max-w-800">
    <el-form-item label="商品分类" prop="gallery_id">
      <el-select
        v-model="form.gallery_id"
        class="input-width"
        placeholder="请选择"
      >
        <el-option
          v-for="(item, index) in galleryOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="规格标准" prop="is_much">
      <el-radio-group v-model="form.is_much">
        <el-radio v-for="(item, index) in muchOptions.slice(1)" :key="index" :value="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="商品名称" prop="name">
      <el-input
        v-model="form.name"
        clearable
        placeholder="请输入商品名称"
      />
    </el-form-item>
    <el-form-item label="商品简介" prop="desc">
      <el-input
        v-model="form.desc"
        type="textarea"
        :rows="4"
        clearable
        placeholder="请输入商品简介"
      />
    </el-form-item>
    <el-form-item label="封面图" prop="images" class="form-item-block">
      <div>
        <UploadImgs v-model:file-list="form.images" :limit="5" :is-domain="true">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>点击上传 {{ form.images.length }}/5</span>
          </template>
        </UploadImgs>
      </div>
      <el-text type="info" size="small">上传2-5张，第1张建议选用高清优质图，提升客流。图片不得超过2M，建议分辨率为 686px * 686px</el-text>
    </el-form-item>
    <el-form-item label="商品价格" prop="cny_price">
      <el-input-number v-model="form.cny_price" class="input-width-200" :min="0" :precision="2" />
    </el-form-item>
    <el-form-item label="商品库存" prop="stock">
      <el-input-number v-if="form.is_much === 0" v-model="form.stock" class="input-width-200" :min="0" :precision="0" />
      <el-input-number v-if="form.is_much === 1" v-model="computedStock" class="input-width-200" :disabled="true" :min="0" :precision="0" />
    </el-form-item>
    <el-form-item label="起售份数" prop="limit_num" class="form-item-block">
      <div>
        <el-input-number v-model="form.limit_num" class="input-width-200" :min="0" :precision="0" />
      </div>
      <el-text size="small">注意：0表示不限购</el-text>
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input-number v-model="form.sort" class="input-width-200" :min="0" :precision="0" />
    </el-form-item>
    <el-form-item label="物流类型" prop="delivery_type">
      <el-radio-group v-model="form.delivery_type">
        <el-radio v-for="(item, index) in deliveryTypeOptions.slice(1)" :key="index" :value="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="运费模板" prop="delivery_id">
      <el-select
        v-model="form.delivery_id"
        clearable
        class="input-width"
        placeholder="选择运费模板"
      >
        <el-option v-for="item in deliveryOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="开售时间" prop="start_time">
      <el-date-picker
        v-model="form.start_time"
        type="datetime"
        placeholder="请选择开售时间"
        value-format="YYYY-MM-DD HH:mm:ss"
        :disabled-date="disabledDate"
      />
    </el-form-item>
    <el-form-item label="是否上架" prop="status">
      <el-radio-group v-model="form.status">
        <el-radio v-for="(item, index) in launchOptions.slice(1)" :key="index" :value="item.value">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted } from "vue";
import BigNumber from 'bignumber.js'
import { Plus, Delete, QuestionFilled } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/modules/product";
import { filterGallery, filterDelivery } from "@/api/modules/common";
import { launchOptions, muchOptions, deliveryTypeOptions } from "@/utils/serviceDict";
import UploadImgs from "@/components/Upload/Imgs.vue";

const productStore = useProductStore();
const { form } = storeToRefs(productStore);

const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7;
}

const galleryOptions = ref([]);
const deliveryOptions = ref([]);

const state = reactive({
  fileList1: [],
});

const computedStock = computed(() => {
  if (form.value.is_much === 1) {
    return form.value.skus.reduce((prev, curr) => prev + curr.stock, 0);
  }
  return form.value.stock;
})

onMounted(() => {
  filterGallery()
    .then((response) => {
      galleryOptions.value = response.data.map((item: {id: number; name: string}) => {
        return {
          label: item.name,
          value: item.id
        }
      });
    })
  filterDelivery()
    .then((response) => {
      deliveryOptions.value = response.data.map(v => {
        return { label: v.name, value: v.id }
      })
    })
})

</script>

<style lang="scss" scoped>
.max-w-800 {
  max-width: 800px;
}
</style>