<template>
  <div>
    <el-dialog
      v-model="state.visible"
      width="600"
      title="发货"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClosed"
    >
      <div v-if="state.defaultLoading">
        <el-form ref="refForm" :model="state.form" :rules="rules" label-width="80px">
          <el-form-item label="订单号">
            <!-- <el-space direction="vertical" alignment="left">
              <div class="goods-box" v-for="(item, index) in state.data.goods_order" :key="index">
                <Pic width="80px" height="80px" :is-domain="true" :src="currentProduct(item)?.image" />
                <div class="goods-info">
                  <div class="goods-name">
                    <span>
                      {{ item.goods_name }}
                    </span>
                  </div>
                  <div>
                    规格：{{ paraphrase({ value: item.sku ? 1 : 0, options: muchOptions }) }}
                  </div>
                </div>
              </div>
            </el-space> -->
            {{ state.data.order_no }}
          </el-form-item>
          <el-form-item label="物流公司">
            <el-select
              v-model="state.form.logistics_id"
              class="w-100"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="onRemoteMethod"
              :loading="state.logisticsLoading"
            >
              <el-option
                v-for="item in logisticsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号">
            <el-input
              v-model="state.form.logistics_no"
              clearable
              placeholder="请输入快递单号"
            />
          </el-form-item>
          <el-form-item label="配送员姓名">
            <el-input
              v-model="state.form.delivery_name"
              clearable
              placeholder="请输入配送员姓名"
            />
          </el-form-item>
          <el-form-item label="配送员电话">
            <el-input
              v-model="state.form.delivery_phone"
              clearable
              placeholder="请输入配送员电话"
            />
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
import { muchOptions } from '@/utils/serviceDict';
import { paraphrase } from '@/utils/filter';
import { filterLogistics } from '@/api/modules/common';
import { sendDelivery } from '@/api/modules/entityOrders';
import Pic from "@/components/Picture/Pic.vue";

const refForm = ref<FormInstance>();
const logisticsOptions = ref();

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  logisticsLoading: false,
  defaultLoading: false,
  data: {
    goods_order: ''
  },
  search: {
    keywords: ''
  },
  form: {
    order_id: "",
    logistics_id: "",
    logistics_no: "",
    delivery_name: "",
    delivery_phone: ""
  }
});

const state = reactive(getInitialData());

const rules = ref({
  logistics_id: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }],
  logistics_no: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }]
});

const init = (row: any) => {
  state.visible = true;
  state.defaultLoading = true;
  if (row) {
    state.form.order_id = row.id;
    state.data = row;
  }
};

// 展示的数据
const currentProduct = computed(() => {
  return (item) => {
    // 未请求到数据时 || 无规格
    const isData = item.id === 0;
    const isMuch = !item?.sku;
    if (isData || isMuch) {
      return {
        cny_price: item?.cny_price,
        image: item?.goods_image?.name
      }
    }
    return {
      ...item.sku,
      image: item.sku.image ? item.sku.image : item.goods_image?.name
    };
  }
})

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};

defineExpose({
  init
});

const onRemoteMethod = (query) => {
  if (query !== '') {
    state.search.keywords = query
    getLogistics()
  } else {
    logisticsOptions.value = []
  }
}

const getLogistics = () => {
  state.logisticsLoading = true
  filterLogistics(state.search).then((response) => {
    state.logisticsLoading = false
    logisticsOptions.value = response.data.map((v) => {
      return {
        label: v.name,
        value: v.id
      }
    })
  })
}

const emit = defineEmits(["refreshList"]);

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
      const data:any = { ...state.form };
      state.btnLoading = true;
      sendDelivery(data)
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
.goods-box {
  display: flex;
  .goods-info {
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;
    .goods-name {
      height: 56px;
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    div:nth-child(2) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
