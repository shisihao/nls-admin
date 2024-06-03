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
      <template #tableHeader>
        <el-button type="success" plain :icon="Download" :loading="state.downloadLoading" @click="onExportData"> 导出数据 </el-button>
      </template>

      <!-- 表格 主体内容展示 -->
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
      <template #amount="{ row }">
        <div><el-text tag="b">¥ {{ row.amount || '0.00' }}</el-text></div>
      </template>
      <!-- 表格操作 -->
      <!-- <template #operation="{ row }">
      </template> -->
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="withdrawals">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import ProTable from "@/components/ProTable/index.vue";
import { orderStatusOptions, payTypeOptions } from "@/utils/serviceDict";
import { paraphrase } from '@/utils/filter';
import { Select, CloseBold, QuestionFilled, Download } from "@element-plus/icons-vue";
import { filterStore } from '@/api/modules/common';
import { getList, exportData } from '@/api/modules/settlement';
import Avatar from "@/components/Picture/Avatar.vue";
import Pic from "@/components/Picture/Pic.vue";

const proTable = ref<ProTableInstance>();

const state = reactive({
  downloadLoading: false,
  search: {
    start_time: '',
    end_time: '',
    store_id: '',
    keywords: ''
  }
})

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.created_at && (newParams.start_time = newParams.created_at[0]);
  newParams.created_at && (newParams.end_time = newParams.created_at[1]);
  delete newParams.created_at;
  state.search = newParams;
  return getList(newParams);
}

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80},
  { prop: "store", label: "门店信息", minWidth: 260, align: "left",
    search: {
      el: "select",
      key: 'store_id',
      defaultValue: '',
      props: {
        clearable: true
      }
    },
    enum: filterStore,
    fieldNames: { label: "name", value: "id" }
  },
  { prop: "user", label: "用户信息", minWidth: 160, align: "left",
    search: {
      el: 'input',
      label: "名称/手机号",
      key: 'keywords',
      props: { placeholder: '请输入 用户名称/手机号' }
    }
  },
  { prop: "amount", label: "金额" },
  { prop: "created_at", label: "创建时间", width: 160,
    search: {
      el: "date-picker",
      label: '创建时间',
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss", clearable: true },
      defaultValue: []
    }
  },
  // { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
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

<style scoped lang="scss">
:deep(.radio-button-badge) {
  .el-radio-button__inner {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
