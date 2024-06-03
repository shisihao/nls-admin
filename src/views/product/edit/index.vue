<template>
  <div class="main-box">
    <!-- <div class="card filter-tabs">
      <div class="v-tabs">
        <el-space direction="vertical">
          <el-link type="primary" :underline="false" href="#info">基本信息</el-link>
          <el-link type="default" :underline="false" href="#sku">商品规格</el-link>
          <el-link type="default" :underline="false" href="#detail">商品详情</el-link>
        </el-space>
      </div>
    </div> -->
    <div class="card app-box" v-loading="state.loading">
      <div class="affix-container">
        <div class="affix-wrap">
          <el-form ref="refForm" :model="form" :rules="rules" size="default" label-width="120px" scroll-to-error :scroll-into-view-options="{ behavior: 'smooth', block: 'start', inline: 'nearest' }">
            <h2 class="title" id="info">基本信息</h2>
            <ProductInfo1 />
            <h2 class="title" id="sku">商品规格</h2>
            <ProductInfo2 />
            <h2 class="title" id="detail">商品详情</h2>
            <ProductInfo3 />
          </el-form>
        </div>
      </div>
      <div class="flx-center btn-wrap">
        <el-space alignment="center" :size="20">
          <el-button type="primary" size="default" :loading="state.btnLoading" @click="onFormSubmit"> 确定 </el-button>
          <el-button  size="default" @click="onBack"> 返回 </el-button>
        </el-space>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts" name="productEdit">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from "pinia";
import { ElMessage, FormInstance } from 'element-plus';
import BigNumber from "bignumber.js";
import { useProductStore } from '@/stores/modules/product';
import { addOrUpdate, detail } from '@/api/modules/entityGoods';
import ProductInfo1 from './components/ProductInfo1.vue';
import ProductInfo2 from './components/ProductInfo2.vue';
import ProductInfo3 from './components/ProductInfo3.vue';

const refForm = ref<FormInstance>();

const route = useRoute();
const router = useRouter();

const { query } = route;

const productStore = useProductStore()
const { form } = storeToRefs(productStore);

const rules = ref({
  gallery_id: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  name: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  desc: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  detail: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  cny_price: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  status: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  stock: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  limit_num: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  sales_num: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  sort: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  images: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  specs_properties: { required: true, message: "不能为空", trigger: ["blur", "change"] },
  skus: { required: true, message: "不能为空", trigger: ["blur", "change"] }
});

const state = reactive({
  loading: false,
  btnLoading: false,
  oldForm: {
    stock: 0
  }
})

const getDetail = (id) => {
  detail({ id })
    .then((response:any) => {
      const data = response.data || {};
      state.oldForm = JSON.parse(JSON.stringify(data));
      productStore.$patch((state) => {
        data.skus = data.skus.map((v:any) => {
          return {
            ...v,
            cny_price: new BigNumber(v.cny_price).toNumber()
          }
        })
        state.form = { ...data, delivery_id: data.delivery_id || '', cny_price: new BigNumber(data.cny_price).toNumber() }
      })
    })
}

onMounted(() => {
  const id = +query.id;
  if (id) {
    getDetail(id);
  }
})

onBeforeUnmount(() => {
  productStore.$reset()
})

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any, error: any) => {
    if (!valid) return;
    try {
      const newForm = JSON.parse(JSON.stringify(form.value));
      // 假如是 无规格 则 清空
      if (newForm.is_much === 0) {
        newForm.specs_properties = [];
        newForm.skus = [];
      } else {
        // 对比旧数据，判断是否更改库存
        const isChange = JSON.stringify(state.oldForm?.skus) !== JSON.stringify(newForm.skus);
        if (isChange) {
          newForm.is_change_stock = 1;
          newForm.old_stock = state.oldForm.stock;
          // 设置stock 为最新值
          form.value.stock = newForm.skus.reduce((prev, curr) => prev + curr.stock, 0);
          state.oldForm.stock = form.value.stock;
          newForm.stock = form.value.stock;
        }
      }
      
      state.btnLoading = true;
      addOrUpdate(newForm)
        .then(({ msg }) => {
          ElMessage.success({ message: msg });
          onBack();
        })
        .finally(() => {
          state.btnLoading = false;
        });
    } catch (error) {
      console.log(error);
    }
  });
};

const onBack = () => {
  router.back();
}
</script>

<style lang="scss" scoped>
  .filter-tabs {
    box-sizing: border-box;
    width: 150px;
    height: 100%;
    padding: 18px;
    margin-right: 10px;
  }
  .app-box {
    // width: calc(100% - 160px);
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;
    .affix-container {
      min-height: calc(100% - 52px);
      display: flex;
      .affix-wrap {
        padding: 20px;
        display: flex;
      }
      h2 {
        &.title {
          font-size: 16px;
          color: #666;
        }
      }
      .el-form {
        :deep(.form-item-block) {
          .el-form-item__content {
            display: block;
          }
        }
        :deep(.input-width) {
          width: 400px;
        }
        :deep(.input-width-100) {
          width: 100px;
        }
        :deep(.input-width-150) {
          width: 150px;
        }
        :deep(.input-width-200) {
          width: 200px;
        }
        :deep(.input-width-800) {
          width: 800px;
        }
        :deep(.dapei-panel) {
          max-width: 800px;
        }
      }
    }
    .btn-wrap {
      position: sticky;
      inset: 0;
      background-color: #fff;
      padding: 10px 0;
      z-index: 10;
    }
  }
</style>