<template>
  <div class="max-w-1100">
    <el-form-item label="商品详情" prop="detail">
      <WangEditor v-model:value="form.detail" height="400px" />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/modules/product";
import WangEditor from "@/components/WangEditor/index.vue";

const productStore = useProductStore();
const { form } = storeToRefs(productStore);
</script>

<style lang="scss" scoped>
.max-w-1100 {
  max-width: 1100px;
}
</style>