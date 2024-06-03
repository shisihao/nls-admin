<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="订单列表"
      :columns="columns"
      :default-expand-all="false"
      :cell-style="cellStyle"
      :request-api="getTableList"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="success" plain :icon="Download" :loading="state.downloadLoading" @click="onExportData"> 导出数据 </el-button>
      </template>

      <!-- 表格 主体内容展示 -->
      <template #expand="{ row }">
        <el-space direction="vertical" alignment="left" style="padding-bottom: 20px;">
          <el-space alignment="left" v-for="(item, index) in row.goods_order" :key="index">
            <div style="width: 80px;"></div>
            <el-space alignment="left" style="width: 300px;">
              <div class="flx-align-center">
                <Pic :is-domain="true" :src="currentProduct(item)?.image" />
              </div>
              <el-space direction="vertical" alignment="left" :size="0">
                <div>
                  ID：#{{ item.id }}
                </div>
                <div style="text-wrap: wrap;">
                  名称：{{ item.goods_name || '' }}
                </div>
                <div v-if="item.sku" style="text-wrap: wrap;">
                  规格：<el-text type="info">{{ (item.sku && item.sku.properties.toString()) || '' }}</el-text>
                </div>
              </el-space>
            </el-space>
            <div style="width: 200px;">
              <div>
                商品：<el-text tag="b">¥ {{ item.cny_price || '0.00' }}</el-text>
              </div>
              <div>
                运费：<el-text tag="b">¥ {{ item.postage_price || '0.00' }}</el-text>
              </div>
            </div>
            <div style="width: 100px;">
              <div>
                数量：<el-text type="primary" size="default">x{{ item.num || 1 }}</el-text>
              </div>
              <div>
                物流：<el-text :type="item.delivery_type === 1 ? '' : 'danger'">{{ paraphrase({ value: item.delivery_type, options: deliveryTypeOptions }) }}</el-text>
              </div>
            </div>
          </el-space>
        </el-space>
      </template>
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
      <!-- <template #good="{ row }">
        <el-space direction="vertical" alignment="left">
          <el-space alignment="left" v-for="(item, index) in row.goods_order" :key="index">
            <el-space alignment="left" style="width: 250px;">
              <div class="flx-align-center">
                <Pic :is-domain="true" :src="currentProduct(item)?.image" />
              </div>
              <el-space direction="vertical" alignment="left" :size="0">
                <div>
                  ID：#{{ item.id }}
                </div>
                <div style="text-wrap: wrap;">
                  名称：{{ item.goods_name || '' }}
                </div>
                <div v-if="item.sku" style="text-wrap: wrap;">
                  规格：<el-text type="info">{{ (item.sku && item.sku.properties.toString()) || '' }}</el-text>
                </div>
              </el-space>
            </el-space>
            <div style="width: 120px;">
              <div>
                商品：<el-text tag="b">¥ {{ item.cny_price || '0.00' }}</el-text>
              </div>
              <div>
                运费：<el-text tag="b">¥ {{ item.postage_price || '0.00' }}</el-text>
              </div>
            </div>
            <div style="width: 90px;">
              <div>
                数量：<el-text type="primary" size="default">x{{ item.num || 1 }}</el-text>
              </div>
              <div>
                物流：<el-text :type="item.delivery_type === 1 ? '' : 'danger'">{{ paraphrase({ value: item.delivery_type, options: deliveryTypeOptions }) }}</el-text>
              </div>
            </div>
          </el-space>
        </el-space>
      </template> -->
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
        <div>
          方式：<el-space :size="3">
                <SvgIcon v-if="row.pay_type" :name="row.pay_type" />
                <span>{{ paraphrase({ value: row.pay_type || null, options: payTypeOptions }) }}</span>
              </el-space>
        </div>
        <div>
          实付：<el-text tag="b">¥ {{ row.cny_price || '0.00' }}</el-text>
        </div>
      </template>
      <template #address="{ row }">
        <div>
          收货人：<el-text>{{ row.consignee?.name }}</el-text>
        </div>
        <div>
          手机号：<el-text>{{ row.consignee?.phone }}</el-text>
        </div>
        <div>
          地区：<el-text>{{ row.consignee?.region?.merger_name }}</el-text>
        </div>
        <div>
          详细地址：<el-text>{{ row.consignee?.address }}</el-text>
        </div>
      </template>
      <template #status="{ row }">
        <div v-if="[5].includes(row.status)">
          <el-popover
              placement="top"
              width="200"
              trigger="hover"
            >
            <div>
              {{ row.reason }}
            </div>
            <template #reference>
              <el-text :type="paraphrase({ value: row.status, options: orderProductStatusOptions, l: 'type' })">
                {{ paraphrase({ value: row.status, options: orderProductStatusOptions }) }}<el-icon><QuestionFilled /></el-icon>
              </el-text>
            </template>
          </el-popover>
        </div>
        <el-text v-else :type="paraphrase({ value: row.status, options: orderProductStatusOptions, l: 'type' })">
          {{ paraphrase({ value: row.status, options: orderProductStatusOptions }) }}
        </el-text>

        <div v-if="row.handler && [5].includes(row.status)">
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
      <template #payment_voucher="{ row }">
        <el-scrollbar>
          <el-space>
            <Pic v-for="(item, index) in row.payment_voucher" :key="index" :is-domain="true" :src="item" />
          </el-space>
        </el-scrollbar>
      </template>

      <!-- 表格操作 -->
      <template #operation="{ row }">
        <div v-if="row.status === 6">
          <el-button type="primary" link :icon="Select" @click="onAuditStatus(row, 1)"> 通过 </el-button>
          <el-button type="danger" link :icon="CloseBold" @click="onAuditStatus(row, 2)"> 驳回 </el-button>
        </div>
        <div v-if="row.status === 0">
          <el-button type="info" link :icon="CloseBold" @click="onCloseOrder(row)"> 取消订单 </el-button>
        </div>
        <div v-if="row.status === 1">
          <el-button type="primary" link :icon="Van" @click="onSendOrder(row)"> 发货 </el-button>
        </div>
        <div v-if="row.logistic">
          <el-popover
            placement="top-end"
            :width="300"
            trigger="hover"
          >
            <div>
              <div>
                物流公司：{{ row.logistic.logistics_name || '-' }} <el-button type="primary" link @click="onLogistics(row)"> 快递进度 </el-button>
              </div>
              <div>
                快递单号：{{ row.logistic.logistics_no || '-' }}
              </div>
              <div>
                配送员姓名：{{ row.logistic.delivery_name || '-' }}
              </div>
              <div>
                配送员电话：{{ row.logistic.delivery_phone || '-' }}
              </div>
            </div>
            <template #reference>
              <el-button type="primary" link> 查看物流 </el-button>
            </template>
          </el-popover>
        </div>
      </template>
    </ProTable>
    <DeliveryDialog ref="refDeliveryDialog" @refresh-list="refreshList" />
  </div>
</template>

<script setup lang="tsx" name="EntityOrders">
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import BigNumber from "bignumber.js";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { orderProductStatusOptions, payTypeOptions, deliveryTypeOptions } from "@/utils/serviceDict";
import { paraphrase } from '@/utils/filter';
import { Van, CloseBold, QuestionFilled, Download, Select } from "@element-plus/icons-vue";
import { getList, closeOrder, exportOrder, auditStatus } from '@/api/modules/entityOrders';
import Avatar from "@/components/Picture/Avatar.vue";
import Pic from "@/components/Picture/Pic.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import DeliveryDialog from "./components/DeliveryDialog.vue";

const proTable = ref<ProTableInstance>();

const state = reactive({
  downloadLoading: false,
  model: {
    wait_count: 0,
    paid_count: 0
  },
  search: {
    status: '',
    start_time: '',
    end_time: ''
  }
})

const cellStyle = ({ row, column, rowIndex, columnIndex })=> {
  if (!([undefined, 'id', 'status', 'payment_voucher', 'operation'].includes(column.property))) {
    return { 'vertical-align': 'top' }
  }
}

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.created_at && (newParams.start_time = newParams.created_at[0]);
  newParams.created_at && (newParams.end_time = newParams.created_at[1]);
  delete newParams.created_at;
  newParams.status = state.search.status;
  state.search = newParams;
  return getList(newParams);
}

const dataCallback = (response: any) => {
  state.model.wait_count = response.wait_count;
  state.model.paid_count = response.paid_count;
  return {
    ...response.data,
    data: response.data.data,
  };
};

const columns: ColumnProps[] = [
  { type: "expand", label: "展开商品", width: 80 },
  { prop: "id", label: "#", width: 80},
  { prop: "order", label: "订单信息", width: 250, align: "left", showOverflowTooltip: false,
    search: {
      el: 'input',
      label: "订单号",
      key: 'order_no',
      props: { placeholder: '请输入 订单号' }
    }
  },
  // { prop: "good", label: "商品信息", minWidth: 500, align: "left", showOverflowTooltip: false },
  { prop: "user", label: "用户信息", minWidth: 180, align: "left",
    search: {
      el: "date-picker",
      label: '下单时间',
      key: 'created_at',
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss", clearable: true },
      defaultValue: []
    }
  },
  { prop: "price", label: "价格", width: 160, align: "left" },
  { prop: "address", label: "收货地址", minWidth: 220, align: "left", showOverflowTooltip: false },
  { prop: "status", label: "状态", width: 80,
    search: {
      span: 2,
      // 自定义 search 组件
      render: ({ searchParam }) => {
        return (
          <el-space>
            <el-radio-group model-value={state.search.status}>
              {
                orderProductStatusOptions.map((item) => {
                  if (item.value === 0) {
                    return (
                      <el-badge value={state.model.wait_count} hidden={state.model.wait_count === 0}>
                        <el-radio-button class="radio-button-badge" value={item.value} onClick={() => onChangeSearchStatus(item.value)}>{item.label}</el-radio-button>
                      </el-badge>
                    );
                  } else if (item.value === 1) {
                    return (
                      <el-badge value={state.model.paid_count} hidden={state.model.paid_count === 0}>
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
  { prop: "payment_voucher", label: "凭证", width: 222, align: "left", showOverflowTooltip: false },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

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

// 关闭订单
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
    const data:any = { id };
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

// 发货
const refDeliveryDialog = ref();
const onSendOrder = (row:any) => {
  refDeliveryDialog.value.init(row);
}

// 查看物流
const onLogistics = (row) => {
  if (!row.logistic.logistics_code && !row.logistic.logistics_no) return ElMessage.warning('无法查询');
  if (row.logistic.logistics_code && row.logistic.logistics_no) {
    window.open(`http://www.kuaidi.com/all/${row.logistic.logistics_code}/${row.logistic.logistics_no}.html`, '_blank')
  }
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
