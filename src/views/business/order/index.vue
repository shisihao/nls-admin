<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="订单列表"
      :columns="columns"
      :request-api="getTableList"
    >
    <!-- :data-callback="dataCallback" -->
      <!-- 表格 header 按钮 -->
      <!-- <template #tableHeader>
        <el-button type="success" plain :icon="Download" :loading="state.downloadLoading" @click="onExportData"> 导出数据 </el-button>
      </template> -->

      <!-- 表格 主体内容展示 -->
      <template #order="{ row }">
        <div>
          订单号：{{ row.order_no }}
        </div>
        <div>
          下单时间：{{ row.created_at }}
        </div>
        <div>
          付款时间：{{ row.pay_time ? row.pay_time : '-'}}
        </div>
      </template>
      <template #store="{ row }">
        <el-space alignment="left">
          <div class="flx-align-center">
            <Pic :is-domain="true" :src="row.store?.cover?.[0]" />
          </div>
          <el-space direction="vertical" alignment="left" :size="0">
            <div>
              ID：#{{ row.store.id }}
            </div>
            <div style="text-wrap: wrap;">
              名称：{{ row.store.name || '' }}
            </div>
          </el-space>
        </el-space>
      </template>
      <template #user="{ row }">
        <el-space alignment="left">
          <div class="flx-align-center">
            <Avatar :is-domain="true" :src="row.user.avatar" />
          </div>
          <el-space direction="vertical" alignment="left" :size="0">
            <div>
              {{ row.user.name }}
              <span v-if="row.user.certification">
                <el-divider direction="vertical" />
                <el-text type="primary">{{ row.user.certification.name }}</el-text>
              </span>
            </div>
            <div>
              {{ row.user.phone || row.user.email }}
            </div>
          </el-space>
        </el-space>
      </template>
      <template #price="{ row }">
        <div>实付：<el-text tag="b">¥ {{ row.pay_price || '0.00' }}</el-text></div>
        <div>
          数量：<el-text type="primary" size="default">x{{ row.num || 1 }}</el-text>
        </div>
        <div>
          方式：<el-space :size="3">
                <SvgIcon v-if="row.pay_type" :name="row.pay_type" />
                <span>{{ paraphrase({ value: row.pay_type || null, options: payTypeOptions }) }}</span>
              </el-space>
        </div>
      </template>
      <template #payment_voucher="{ row }">
        <el-scrollbar>
          <el-space>
            <Pic v-for="(item, index) in row.payment_voucher" :key="index" :is-domain="true" :src="item" />
          </el-space>
        </el-scrollbar>
      </template>
      <template #status="{ row }">
        <div v-if="[2].includes(row.status)">
          <el-popover
              placement="top"
              width="200"
              trigger="hover"
            >
            <div>
              {{ row.reason }}
            </div>
            <template #reference>
              <el-text :type="paraphrase({ value: row.status, options: orderStatusOptions, l: 'type' })">
                {{ paraphrase({ value: row.status, options: orderStatusOptions }) }}<el-icon><QuestionFilled /></el-icon>
              </el-text>
            </template>
          </el-popover>
        </div>
        <el-text v-else :type="paraphrase({ value: row.status, options: orderStatusOptions, l: 'type' })">
          {{ paraphrase({ value: row.status, options: orderStatusOptions }) }}
        </el-text>

        <div v-if="row.handler && [2, 4].includes(row.status)">
          <el-popover
            placement="top"
            width="200"
            trigger="hover"
          >
            <div>
              <div>
                # {{ row.handler.id }}
              </div>
              <div>
                {{ row.handler.name }}
              </div>
            </div>
            <template #reference>
              <el-text>审核人<el-icon><QuestionFilled /></el-icon></el-text>
            </template>
          </el-popover>
        </div>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <div v-if="row.status === 3">
          <el-button type="primary" link :icon="Select" @click="onAuditStatus(row, 1)"> 通过 </el-button>
          <el-button type="danger" link :icon="CloseBold" @click="onAuditStatus(row, 2)"> 驳回 </el-button>
        </div>
        <div v-if="row.status === 0">
          <el-button type="info" link :icon="CloseBold" @click="onCloseOrder(row)"> 取消订单 </el-button>
        </div>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="Order">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import BigNumber from "bignumber.js";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { orderStatusOptions, payTypeOptions } from "@/utils/serviceDict";
import { paraphrase } from '@/utils/filter';
import { Select, CloseBold, QuestionFilled, Download } from "@element-plus/icons-vue";
import { getList, closeOrder, exportOrder, auditStatus } from '@/api/modules/order';
import Avatar from "@/components/Picture/Avatar.vue";
import Pic from "@/components/Picture/Pic.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";

const proTable = ref<ProTableInstance>();

const state = reactive({
  downloadLoading: false,
  model: {
    wait_count: 0
  },
  search: {
    status: '',
    user_info: ''
  }
})

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.status = state.search.status;
  state.search = newParams;
  return getList(newParams);
}

// const dataCallback = (response: any) => {
//   state.model.wait_count = response.wait_count;
//   return {
//     ...response.data,
//     data: response.data.data,
//   };
// };

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80},
  { prop: "order", label: "订单信息", width: 260, align: "left" },
  { prop: "store", label: "门店信息", width: 260, align: "left" },
  { prop: "user", label: "用户信息", minWidth: 180, align: "left",
    search: {
      el: 'input',
      label: "名称/手机号",
      key: 'user_info',
      props: { placeholder: '请输入 用户名称/手机号' }
    }
  },
  { prop: "price", label: "价格", width: 160, align: "left" },
  { prop: "payment_voucher", label: "凭证", width: 222, align: "left", showOverflowTooltip: false },
  { prop: "status", label: "状态", width: 80,
    search: {
      span: 2,
      // 自定义 search 组件
      render: ({ searchParam }) => {
        return (
          <el-space>
            <el-radio-group model-value={state.search.status}>
              {
                orderStatusOptions.map((item) => {
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
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

const onChangeSearchStatus = (value: string) => {
  state.search.status = value;
  refreshList();
}

const onAuditStatus = (row: any, status: number) => {
  const { order_no, id } = row;
  const typeText = status == 1 ? '通过' : '驳回';
  const type = status == 1 ? 'success' : 'error';
  let msgBox:Promise<{ value?: string | undefined }>;
  if (status === 1) {
    msgBox = ElMessageBox.confirm(`确定对[(#${id})${order_no}]进行[${typeText}]操作?`, '提示', {
      autofocus: false,
      type: type
    })
  } else {
    msgBox = ElMessageBox.prompt(`确定对[(#${id})${order_no}]进行[${typeText}]操作?请输入${typeText}理由`, '提示', {
      inputPattern: /\S/,
      inputErrorMessage: '不能为空',
    })
  }
  msgBox
    .then(({ value }) => {
      const data:any = { id, status };
      if (status === 2) {
        data.reason = value ? value.trim() : '';
      }
      auditStatus(data)
        .then(({ msg = `已${typeText}` }) => {
          ElMessage.success({ message: msg });
          refreshList()
        })
        .catch(() => {})
    })
    .catch(() => {})
}

const onCloseOrder = (row: any) => {
  const { id, order_no } = row;
  const typeText = '关闭订单';
  const type = 'error';
  let msgBox:Promise<{ value?: string | undefined }>;
  ElMessageBox.prompt(`确定对订单号[${order_no}]的订单进行[${typeText}]操作?请输入${typeText}理由`, '提示', {
    inputPattern: /\S/,
    inputErrorMessage: '不能为空',
  })
  .then(({ value }) => {
    const data:any = { order_no };
    data.reason = value ? value.trim() : '';
    closeOrder(data)
      .then(({ msg = `已${typeText}` }) => {
        ElMessage.success({ message: msg });
        refreshList()
      })
      .catch(() => {})
  })
  .catch(() => {})
}

// 导出
const onExportData = () => {
  state.downloadLoading = true;
  exportOrder(state.search)
    .then((response:any) => {
      location.href = '/' + response.data.filename;
    })
    .finally(() => {
      state.downloadLoading = false;
    })
}
</script>

<style scoped lang="scss">
:deep(.radio-button-badge) {
  .el-radio-button__inner {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
