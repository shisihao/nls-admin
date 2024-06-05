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
        <!-- <el-button type="success" plain :icon="Download" :loading="state.downloadLoading" @click="onExportData"> 导出数据 </el-button> -->
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
      <template #video_url="{ row }">
        <div v-if="row.video_url">
          <VideoPopup :image-url="''" :video-url="row.video_url" />
        </div>
        <div v-else>
          --
        </div>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <div>
          <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
          <el-button type="danger" link :icon="Delete" @click="onDelete(row)"> 删除 </el-button>
        </div>
        <div v-if="row.status === 0">
          <el-button type="primary" link :icon="Select" @click="onAuditStatus(row, 1)"> 通过 </el-button>
          <el-button type="danger" link :icon="CloseBold" @click="onAuditStatus(row, 2)"> 驳回 </el-button>
        </div>
      </template>
    </ProTable>

    <AddOrUpdate ref="refAddOrUpdate" @refresh-list="refreshList" />
  </div>
</template>

<script setup lang="tsx" name="user">
import { reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import ProTable from "@/components/ProTable/index.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";
import { getList, addOrUpdate, exportUser, deleteData, auditStatus } from '@/api/modules/user';
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Download, EditPen, Delete, Select, CloseBold } from "@element-plus/icons-vue";
import { isStatusOptions, userTypeOptions, statusOptions, classType } from '@/utils/serviceDict';
import { paraphrase } from '@/utils/filter';
import Avatar from "@/components/Picture/Avatar.vue";
import AddOrUpdate from "./components/AddOrUpdate.vue";

const statusOptionsFilter = statusOptions
if (statusOptionsFilter.find(item => item.value === -1) === undefined) {
  statusOptionsFilter.splice( 1, 0, { label: '未提交', value: -1, type: 'info' })
}

const userStore = useUserStore()
const { oss }: { oss: any } = storeToRefs(userStore)

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
  { prop: "video_url", label: "视频地址", width: 160 },
  { prop: "cert_result", label: "认证结果", width: 160 },
  { prop: "status", label: "审核状态", width: 80,
    search: {
      el: "select",
      label: '审核状态',
      defaultValue: '',
      props: {
        clearable: true
      }
    },
    enum: statusOptionsFilter
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

// 删除
const onDelete = (row: any) => {
  const { name , id } = row
  ElMessageBox.confirm(`确定对[${name}(#${id})]进行[删除]操作?`, '删除', {
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

const onLook = (row:{ video_url:string }) => {
  let url = `${oss.value.DoMain}${row.resource_url}`;
  url = 'http://view.officeapps.live.com/op/view.aspx?src=' + url;
  window.open(url);
}
</script>

<style lang="scss" scoped>
</style>