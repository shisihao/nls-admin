<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="门店列表"
      :columns="columns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </template>
      
      <!-- 表格 主体内容展示 -->
      <template #cate_id="{ row }">
        <el-tag :type="paraphrase({ value: row.cate_id, options: storeTypeOptions, l: 'type' })" effect="plain">{{ paraphrase({ value: row.cate_id, options: storeTypeOptions }) }}</el-tag>
      </template>
      <template #image="{ row }">
        <Pic :is-domain="true" :src="row.image" />
      </template>
      <template #cover="{ row }">
        <el-scrollbar>
          <el-space>
            <Pic v-for="(item, index) in row.cover" :key="index" :is-domain="true" :src="item" />
          </el-space>
        </el-scrollbar>
      </template>
      <template #detail="{ row }">
        <el-link type="primary" :underline="false" @click="onContentPopup(row)">查看内容</el-link>
        <el-link :type="row.order?.length === row.count ? 'success' : 'primary'" :underline="false" @click="onOrderPopup(row)">合伙人({{ row.order_sum_num || 0 }}/{{ row.count }})</el-link>
      </template>
      <template #status="{ row }">
        <el-text :type="paraphrase({ value: row.status, options: storeStatusOptions, l: 'type' })">
          {{ filterStatus(row).label }}
          <span v-if="filterStatus(row).status === -3">
            (
              <el-countdown
                class="countdown-wrap"
                format="DD[天]HH:mm:ss"
                :value="dayjs(row.start_time)"
                @finish="onFinishStatus"
              />
            )
          </span>
        </el-text>
      </template>
      <template #ratio="{ row }">
        <div>合伙人分红比例: {{ row.dividend_ratio }}%</div>
        <div>推荐人分红比例: {{ row.recommend_ratio }}%</div>
        <div>分红倍率: {{ row.magnification }}</div>
        <div>价格/人: ¥{{ row.price }}</div>
      </template>
      <template #info="{ row }">
        <div>企业: {{ row.company?.company_name }}</div>
        <div>城市: {{ row.region?.merger_name }}</div>
        <div>选址: {{ row.address ? row.address?.region?.merger_name + " " + row.address?.address : '-' }}</div>
      </template>

      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
        <el-button type="primary" link @click="onChangeStatus(row)"> 状态更改 </el-button>
        <el-button type="primary" link :disabled="!row.can_sign" @click="onSendContract(row)"> 发起合同 </el-button>
        <el-button type="primary" link @click="onTradeLog(row)"> 门店流水 </el-button>
        <el-button type="primary" link @click="onRewardLog(row)"> 分红流水 </el-button>
        <!-- <el-button type="danger" link :icon="Delete" @click="onDelete(row)"> 删除 </el-button> -->
      </template>
    </ProTable>

    <AddOrUpdate ref="refAddOrUpdate" @refresh-list="refreshList" />
    <ChangeStatus ref="refChangeStatus" @refresh-list="refreshList" />
    <ContentPopup ref="refContentPopup" />
    <OrderPopup ref="refOrderPopup" />
  </div>
</template>

<script setup lang="tsx" name="stores">
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, dayjs } from 'element-plus'
import { storeToRefs } from "pinia";
import { useCommonStore } from '@/stores/modules/common';
import ProTable from "@/components/ProTable/index.vue";
import { getList, sendContract } from '@/api/modules/stores';
import { storeStatusOptions, storeTypeOptions } from "@/utils/serviceDict";
import { paraphrase } from "@/utils/filter";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import Pic from "@/components/Picture/Pic.vue";
import AddOrUpdate from "./components/AddOrUpdate.vue";
import ChangeStatus from "./components/ChangeStatus.vue";
import ContentPopup from "./components/ContentPopup.vue";
import OrderPopup from "./components/OrderPopup.vue";

const router = useRouter();

const commonStore = useCommonStore();
const { stores } = storeToRefs(commonStore);

const proTable = ref<ProTableInstance>();

const state = reactive({
  model: {
    wait_count: 0
  },
  search: {
    cate_id: '',
    status: ''
  }
})

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.status = state.search.status;
  state.search = newParams;
  return getList(newParams)
}

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80 },
  { prop: "cate_id", label: "门店类型", width: 90, align: "center", showOverflowTooltip: false,
    search: {
      el: "select",
      defaultValue: '',
      props: {
        clearable: true
      }
    },
    enum: storeTypeOptions
  },
  { prop: "image", label: "封面图", width: 100, align: "center", showOverflowTooltip: false },
  { prop: "cover", label: "门店头图", width: 222, align: "left", showOverflowTooltip: false },
  { prop: "name", label: "门店名称", minWidth: 160, align: "left" },
  { prop: "detail", label: "详情", width: 100, align: "center", showOverflowTooltip: false },
  { prop: "ratio", label: "分红", width: 180, align: "left" },
  { prop: "info", label: "信息", minWidth: 160, align: "left" },
  { prop: "status", label: "状态", width: 160, showOverflowTooltip: false,
  search: {
      span: 2,
      label: '状态',
      // 自定义 search 组件
      render: ({ searchParam }) => {
        return (
          <el-space>
            <el-radio-group model-value={state.search.status}>
              {
                storeStatusOptions.map((item) => {
                  if (item.value === 0) {
                    return (
                      <el-badge value={state.model.wait_count} hidden={state.model.wait_count === 0}>
                        <el-radio-button class="radio-button-badge" value={item.value} onClick={() => onChangeSearchStatus(item.value)}>{item.label}</el-radio-button>
                      </el-badge>
                    );
                  } else {
                    return (
                      <el-radio-button value={item.value} onClick={() => onChangeSearchStatus(item.value)}>{item.label}</el-radio-button>
                    );
                  }
                })
              }
            </el-radio-group>
          </el-space>
        );
      }
    }
  },
  { prop: "sort", label: "排序", width: 80 },
  // { prop: "created_at", label: "创建时间", width: 160 },
  { prop: "operation", label: "操作", fixed: "right", width: 180 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

const onChangeSearchStatus = (value: string) => {
  state.search.status = value;
  refreshList();
}

const filterStatus = computed(() => {
  return (row) => {
    if (row.status === 0) {
      const difference = dayjs(row.start_time).diff(dayjs());
      if (difference > 0) { // 倒计时
        return {
          status: -3,
          label: "预启动"
        };
      } else if (difference <= 0 && row.order.length < 3) { // 进行中
        return {
          status: -2,
          label: "预启动(进行中)"
        };
      } else { // 已结束
        return {
          status: -1,
          label: "预启动(已结束)"
        };
      }
    } else {
      return {
        status: row.status,
        label: paraphrase({ value: row.status, options: storeStatusOptions })
      };
    }
  }
})

const onFinishStatus = () => {
  refreshList();
}

const refAddOrUpdate = ref<InstanceType<typeof AddOrUpdate> | null>(null);
const onAddOrUpdate = (row?: any) => {
  refAddOrUpdate.value?.init(row)
}

const refContentPopup = ref<InstanceType<typeof ContentPopup> | null>(null);
const onContentPopup = (row?: any) => {
  refContentPopup.value?.init(row)
}

const refOrderPopup = ref<InstanceType<typeof OrderPopup> | null>(null);
const onOrderPopup = (row?: any) => {
  refOrderPopup.value?.init(row)
}

const onSendContract = (row?: any) => {
  sendContract({ id: row.id })
    .then(({ msg }) => {
      ElMessage.success({ message: msg });
      row.can_sign = false;
    })
}

const onTradeLog = (row:any) => {
  const { id, name, status } = row;
  stores.value.id = id;
  stores.value.name = name;
  stores.value.status = status;
  router.push(`/business/stores/TradeLog`);
}

const onRewardLog = (row:any) => {
  const { id, name, status } = row;
  stores.value.id = id;
  stores.value.name = name;
  stores.value.status = status;
  router.push(`/business/stores/RewardLog`);
}

const refChangeStatus = ref<InstanceType<typeof ChangeStatus> | null>(null);
const onChangeStatus = (row?: any) => {
  refChangeStatus.value?.init(row)
}

// const onDelete = (row: any) => {
//   const { title , id } = row
//   ElMessageBox.confirm(`确定对[(#${id})${title}]进行[删除]操作?`, '删除', {
//     autofocus: false,
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//     type: 'error'
//   })
//     .then(() => {
//       deleteData(id)
//         .then(({ msg = '删除成功' }) => {
//           ElMessage.success({ message: msg });
//           refreshList()
//         })
//         .catch(() => {})
//     })
//     .catch(() => {})
// }
</script>

<style lang="scss" scoped>

:deep(.radio-button-badge) {
  .el-radio-button__inner {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
.countdown-wrap {
  display: inline-block;
  :deep(.el-statistic__content) {
    font-size: 12px;
  }
}
</style>