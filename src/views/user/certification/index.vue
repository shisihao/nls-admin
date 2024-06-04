<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="实名认证列表"
      :columns="columns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="success" plain :icon="Download" :loading="state.downloadLoading" @click="onExportData"> 导出数据 </el-button>
      </template>

      <!-- 表格 主体内容展示 -->
      <template #user="{ row }">
        <el-space alignment="left">
          <div class="flx-align-center">
            <Avatar :is-domain="true" :src="row.user.avatar" />
          </div>
          <el-space direction="vertical" alignment="left" :size="0">
            <div>
              {{ row.user.name }}
            </div>
            <div>
              {{ row.user.phone || row.user.email }}
            </div>
          </el-space>
        </el-space>
      </template>
      <template #certification="{ row }">
        <el-space direction="vertical" alignment="left" :size="0">
          <div>
            姓名：{{ row.name }}
          </div>
          <div>
            身份证：{{ row.number }}
          </div>
        </el-space>
      </template>
      <template #status="{ row }">
        <div v-if="row.status === 2">
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

        <div v-if="row.admin">
          <el-popover
            placement="top"
            width="200"
            trigger="hover"
          >
            <div>
              <div>
                # {{ row.admin.id }}
              </div>
              <div>
                {{ row.admin.name }}
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
        <div v-else>
          --
        </div>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="certification">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import ProTable from "@/components/ProTable/index.vue";
import { Select, CloseBold, QuestionFilled, Download } from "@element-plus/icons-vue";
import { statusOptions } from "@/utils/serviceDict";
import { paraphrase } from "@/utils/filter";
import { getList, auditStatus, exportCertifications } from '@/api/modules/certification';
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import Avatar from "@/components/Picture/Avatar.vue";

const proTable = ref<ProTableInstance>();

const state = reactive({
  downloadLoading: false,
  search: {
    status: '',
    phone: '',
    name: '',
    company_name: '',
    company_code: '',
    start_time: '',
    end_time: ''
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
  { prop: "id", label: "#", width: 80,
    search: {
      el: 'input',
      label: '手机号',
      key: 'phone',
      props: { placeholder: '请输入 手机号' }
    }
  },
  { prop: "user", label: "账号", minWidth: 160, align: "left",
    search: {
      el: 'input',
      label: '姓名',
      key: 'name',
      props: { placeholder: '请输入 姓名' }
    }
  },
  { prop: "certification", label: "认证信息", minWidth: 160, align: "left",
    search: {
      el: 'input',
      label: '公司名称',
      key: 'company_name',
      props: { placeholder: '请输入 公司名称' }
    }
  },
  { prop: "company_code", label: "", width: 0, align: "left",
    search: {
      el: 'input',
      label: '统一社会信用代码',
      key: 'company_code',
      props: { placeholder: '请输入 统一社会信用代码' }
    }
  },
  { prop: "status", label: "审核状态", width: 80,
    search: {
      el: "select",
      label: '审核状态',
      defaultValue: '',
      props: {
        clearable: true
      }
    },
    enum: statusOptions
  },
  { prop: "created_at", label: "创建时间", width: 160,
    search: {
      el: "date-picker",
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss", clearable: true },
      defaultValue: []
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

const onAuditStatus = (row: any, status: number) => {
  const { name, id } = row;
  const typeText = status == 1 ? '通过' : '驳回';
  const type = status == 1 ? 'success' : 'error';
  let msgBox:Promise<{ value?: string | undefined }>;
  if (status === 1) {
    msgBox = ElMessageBox.confirm(`确定对[(#${id})${name}]进行[${typeText}]操作?`, '提示', {
      autofocus: false,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: type
    })
  } else {
    msgBox = ElMessageBox.prompt(`确定对[(#${id})${name}]进行[${typeText}]操作?请输入${typeText}理由`, '提示', {
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

// 导出
const onExportData = () => {
  state.downloadLoading = true;
  exportCertifications(state.search)
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