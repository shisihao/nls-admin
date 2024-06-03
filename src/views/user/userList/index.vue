<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户列表"
      :columns="columns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
        <el-button type="success" plain :icon="Download" :loading="state.downloadLoading" @click="onExportData"> 导出数据 </el-button>
      </template>

      <!-- 表格 主体内容展示 -->
      <template #user="{ row }">
        <el-space alignment="left">
          <div class="flx-align-center">
            <Avatar :is-domain="true" :src="row.avatar" />
          </div>
          <el-space direction="vertical" alignment="left" :size="0">
            <div>
              {{ row.name }}
              <span v-if="row.id_card">
                <el-divider direction="vertical" />
                <el-text type="primary">{{ row.id_card }}</el-text>
              </span>
            </div>
            <div>
              {{ row.phone || row.email }}
            </div>
          </el-space>
        </el-space>
      </template>
      <template #type="{ row }">
        <el-tag effect="plain" :type="paraphrase({ value: row.type, options: userTypeOptions, l: 'type' })">
          {{ paraphrase({ value: row.type, options: userTypeOptions }) }}
        </el-tag>
      </template>
      <template #company="{ row }">
        <div v-if="row.type === 1">
          <div>{{ row.company_name }}</div>
          <div>{{ row.company_code }}</div>
        </div>
        <div v-else>
          -
        </div>
      </template>
      <template #level="{ row }">
        {{ row.level }}
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
      </template>
    </ProTable>

    <AddOrUpdate ref="refAddOrUpdate" @refresh-list="refreshList" />
  </div>
</template>

<script setup lang="tsx" name="user">
import { reactive, ref } from "vue";
import { ElMessage } from 'element-plus'
import ProTable from "@/components/ProTable/index.vue";
import { getList, addOrUpdate, exportUser } from '@/api/modules/user';
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Download, EditPen } from "@element-plus/icons-vue";
import { isStatusOptions, userTypeOptions } from '@/utils/serviceDict';
import { paraphrase } from '@/utils/filter';
import Avatar from "@/components/Picture/Avatar.vue";
import AddOrUpdate from "./components/AddOrUpdate.vue";

const proTable = ref<ProTableInstance>();

const state = reactive({
  downloadLoading: false,
  search: {
    phone: '',
    name: '',
    company_name: '',
    company_code: '',
    type: ''
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
  { prop: "id", label: "#", width: 80 },
  { prop: "user", label: "手机号", minWidth: 160, align: "left",
    search: {
      el: 'input',
      key: 'keywords',
      props: { placeholder: '请输入 手机号' }
    }
  },
  { prop: "type", label: "类型", width: 100, align: "center",
    search: {
      el: 'input',
      label: '姓名',
      key: 'name',
      props: { placeholder: '请输入 姓名' }
    }
  },
  { prop: "company", label: "公司信息", minWidth: 160, align: "left",
    search: {
      el: 'input',
      label: '公司名称',
      key: 'company_name',
      props: { placeholder: '请输入 公司名称' }
    }
  },
  { prop: "product", label: "产品信息", minWidth: 160, align: "left",
    search: {
      el: 'input',
      label: '统一社会信用代码',
      key: 'company_code',
      props: { placeholder: '请输入 公司名称' }
    }
  },
  { prop: "level", label: "风险等级", minWidth: 160, align: "left",
    search: {
      el: "select",
      key: 'type',
      label: '类型',
      defaultValue: '',
      props: {
        clearable: true
      }
    },
    enum: userTypeOptions
  },
  { prop: "created_at", label: "创建时间", width: 160,
    // search: {
    //   el: "date-picker",
    //   props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss", clearable: true },
    //   defaultValue: []
    // }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

const onChangeStatus = (row:any) => {
  return new Promise((resolve, reject) => {
    addOrUpdate({ ...row, state: row.state ? 0 : 1 })
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

// 新增/编辑
const refAddOrUpdate = ref<InstanceType<typeof AddOrUpdate> | null>(null);
const onAddOrUpdate = (row?: any) => {
  refAddOrUpdate.value?.init(row)
}

// 团队
const refSubset = ref<InstanceType<typeof Subset> | null>(null);
const onSubset = (row?: any) => {
  refSubset.value?.init(row)
}

// 流水
const refWallet = ref<InstanceType<typeof Wallet> | null>(null);
const onWallet = (row?: any) => {
  refWallet.value?.init(row)
}

// 导出
const onExportData = () => {
  state.downloadLoading = true;
  exportUser(state.search)
    .then((response:any) => {
      location.href = '/' + response.data.filename;
    })
    .finally(() => {
      state.downloadLoading = false;
    })
}
</script>

<style lang="scss" scoped>
</style>