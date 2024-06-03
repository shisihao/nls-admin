<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="提现列表"
      :columns="columns"
      :request-api="getTableList"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="success" plain :icon="Download" :loading="state.downloadLoading" @click="onExportData"> 导出数据 </el-button>
      </template>
      
      <!-- 表格 主体内容展示 -->
      <template #user="{ row }">
        <el-space alignment="left">
          <div class="flx-align-center">
            <Avatar :is-domain="true" :src="row.user?.avatar" />
          </div>
          <el-space direction="vertical" alignment="left" :size="0">
            <div>
              {{ row.user?.name }}
              <span v-if="row.user?.certification">
                <el-divider direction="vertical" />
                <el-text type="primary">{{ row.user?.certification.name }}</el-text>
              </span>
            </div>
            <div>
              {{ row.user?.phone || row.user?.email }}
            </div>
          </el-space>
        </el-space>
      </template>
      <template #amount="{ row }">
        <el-row>
          <el-col :span="12">
            <div>
              提现：¥{{ row.amount }}
            </div>
            <div>
              到账：¥{{ row.account_amount }}
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              手续费：¥{{ row.service_charge }}
            </div>
            <div>
              余额：¥{{ row.withdraw_balance }}
            </div>
          </el-col>
        </el-row>
      </template>
      <template #account_info="{ row }">
        <div>
          持卡人：{{ row.account_info?.name }}
        </div>
        <div>
          开户行：{{ row.account_info?.deposit_bank }}
        </div>
        <div>
          卡号：{{ row.account_info?.account }}
        </div>
      </template>
      <template #account_type="{ row }">
        <el-space :size="3">
          <SvgIcon v-if="row.account_type" :name="row.account_type" />
          <span>{{ paraphrase({ value: row.account_type || null, options: payTypeOptions }) }}</span>
        </el-space>
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
              <el-text :type="paraphrase({ value: row.status, options: statusOptions, l: 'type' })">
                {{ paraphrase({ value: row.status, options: statusOptions }) }}<el-icon><QuestionFilled /></el-icon>
              </el-text>
            </template>
          </el-popover>
        </div>
        <el-text v-else :type="paraphrase({ value: row.status, options: statusOptions, l: 'type' })">
          {{ paraphrase({ value: row.status, options: statusOptions }) }}
        </el-text>

        <div v-if="row.handler">
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
        <div v-if="row.status === 0">
          <el-button type="primary" link :icon="Select" @click="onAuditStatus(row, 1)"> 通过 </el-button>
          <el-button type="danger" link :icon="CloseBold" @click="onAuditStatus(row, 2)"> 驳回 </el-button>
        </div>
      </template>
    </ProTable>
    
    <StatusWithdraw ref="refStatusWithdraw" @refresh-list="refreshList" />
  </div>
</template>

<script setup lang="tsx" name="withdrawals">
import { ref, reactive, computed } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { statusOptions, payTypeOptions } from "@/utils/serviceDict";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";
import { paraphrase } from "@/utils/filter";
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getList, examineAudit, exportData } from '@/api/modules/withdrawal';
import { Select, CloseBold, QuestionFilled, Download } from "@element-plus/icons-vue";
import Avatar from "@/components/Picture/Avatar.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import StatusWithdraw from "./components/StatusWithdraw.vue";

const userStore = useUserStore();
const { userInfo }: { userInfo: any } = storeToRefs(userStore);

const proTable = ref<ProTableInstance>();

const state = reactive({
  downloadLoading: false,
  model: {
    wait_count: 0
  },
  search: {
    start_time: '',
    end_time: '',
    status: '',
    account: ''
  }
})

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.created_at && (newParams.start_time = newParams.created_at[0]);
  newParams.created_at && (newParams.end_time = newParams.created_at[1]);
  delete newParams.created_at;
  newParams.status = state.search.status;
  state.search = newParams;
  return getList(newParams)
}

const dataCallback = (response: any) => {
  state.model.wait_count = response.wait_count;
  return {
    ...response.data,
    data: response.data.data,
  };
};

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80 },
  { prop: "user", label: "账号", minWidth: 160, align: "left" },
  { prop: "amount", label: "提现金额", minWidth: 300, align: "left" },
  { prop: "account_info", label: "银行卡信息", minWidth: 200, align: "left" },
  { prop: "account_type", label: "支付方式", width: 80, align: "left" },
  { prop: "status", label: "状态", width: 80,
    search: {
      el: "date-picker",
      label: '创建时间',
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss", clearable: true },
      defaultValue: []
    }
  },
  { prop: "created_at", label: "创建时间", width: 160,
    search: {
      span: 2,
      label: '状态',
      // 自定义 search 组件
      render: ({ searchParam }) => {
        return (
          <el-space>
            <el-radio-group model-value={state.search.status}>
              {
                statusOptions.map((item) => {
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

const refStatusWithdraw = ref();
const onAuditStatus = (row: any, status: number) => {
  refStatusWithdraw.value.init(row, status)
}
// 导出
const onExportData = () => {
  state.downloadLoading = true;
  exportData(state.search)
    .then((response:any) => {
      location.href = '/' + response.data.filename;
    })
    .finally(() => {
      state.downloadLoading = false;
    })
}
</script>

<style lang="scss" scoped>
:deep(.radio-button-badge) {
  .el-radio-button__inner {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>