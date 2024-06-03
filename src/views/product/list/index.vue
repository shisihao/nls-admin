<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="商品列表"
      :columns="columns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </template>

      <!-- 表格 主体内容展示 -->
      <template #images="{ row }">
        <el-scrollbar>
          <el-space>
            <Pic v-for="(item, index) in row.images" :key="index" :is-domain="true" :src="item.name" />
          </el-space>
        </el-scrollbar>
      </template>
      <template #cny_price="{ row }">
        <div>类型：<el-text :type="row.is_much ? 'primary' : 'warning'">{{ paraphrase({ value: row.is_much, options: muchOptions }) }}</el-text></div>
        <div>价格：￥{{ row.cny_price || 0 }}</div>
      </template>
      <template #stock="{ row }">
        <div>起售：{{ row.limit_num }}</div>
        <div>库存：<el-text :type="row.stock ? 'success' : 'danger'">{{ row.stock || 0 }}</el-text></div>
      </template>
      <template #other="{ row }">
        <div>物流类型：<el-text :type="row.delivery_type === 1 ? '' : 'danger'">{{ paraphrase({ value: row.delivery_type, options: deliveryTypeOptions }) }}</el-text></div>
        <div>运费模板：{{ row.delivery ? row.delivery.name : '-' }}</div>
        <div>开售：{{ row.start_time || '-' }}</div>
      </template>
      <template #status="{ row }">
        <el-switch v-model="row.status" :inactive-value="1" :active-value="0" :before-change="() => onChangeStatus(row)" />
      </template>

      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
        <el-button type="danger" link :icon="Delete" @click="onDelete(row)"> 删除 </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="product">
import { ref, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus';
import { CirclePlus, Delete, EditPen, Money, WarningFilled } from "@element-plus/icons-vue";
import BigNumber from "bignumber.js";
import { useProductStore } from '@/stores/modules/product'
import { launchOptions, muchOptions, deliveryTypeOptions } from '@/utils/serviceDict';
import { paraphrase } from '@/utils/filter';
import { getList, deleteData, auditStatus } from '@/api/modules/entityGoods';
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import Pic from "@/components/Picture/Pic.vue";

const router = useRouter();

const proTable = ref<ProTableInstance>();

const productStore = useProductStore()
const { form } = storeToRefs(productStore)

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.sold_start_time && (newParams.start_time = newParams.sold_start_time[0]);
  newParams.sold_start_time && (newParams.end_time = newParams.sold_start_time[1]);
  delete newParams.sold_start_time;
  return getList(newParams)
}

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80},
  { prop: "images", label: "商品头图", width: 222, align: "left", showOverflowTooltip: false },
  { prop: "name", label: "商品名称", "min-width": 180, align: "left",
    search: {
      el: 'input',
      props: { placeholder: '请输入 商品名称' }
    }
  },
  { prop: "cny_price", label: "商品信息", minWidth: 200, align: "left", showOverflowTooltip: false },
  { prop: "stock", label: "库存", minWidth: 200, align: "left", showOverflowTooltip: false },
  { prop: "other", label: "其他设置", minWidth: 200, align: "left", showOverflowTooltip: false },
  { prop: "status", label: "商品状态", width: 100,
    search: {
      el: "select",
      defaultValue: '',
      props: {
        clearable: true
      }
    },
    enum: launchOptions
  },
  { prop: "created_at", label: "创建时间", width: 160 },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

/** 金额格式化 */
const priceFormat = computed(() => {
  return (price: number|string) => {
    return new BigNumber(price).div(100).toFormat(2);
  }
})

/** 商品状态 */
const onChangeStatus = (row:any) => {
  return new Promise((resolve, reject) => {
    auditStatus({ id: row.id, status: row.status ? 0 : 1 })
      .then(({ msg = '设置成功' }) => {
        ElMessage.success({ message: msg });
        resolve(row);
      })
      .catch((msg = '设置失败') => {
        ElMessage.error({ message: msg });
        reject();
      })
  })
}

/** 添加修改 */
const onAddOrUpdate = (row?: any) => {
  const { id } = row || {};
  router.push({ name: 'productEdit', query: { id: id || 0 } })
}

const onDelete = (row: any) => {
  const { name, id } = row
  ElMessageBox.confirm(`确定对[(#${id})${name}]进行[删除]操作?`, '删除', {
    autofocus: false,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  })
    .then(() => {
      deleteData(id)
        .then(({ msg = '删除成功' }) => {
          ElMessage.success({ message: msg });
          refreshList()
        })
        .catch(() => {})
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
</style>
