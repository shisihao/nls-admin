<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="管理员列表"
      :columns="columns"
      :request-api="getList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </template>

      <!-- 表格 主体 -->
      <template #status="{ row }">
        <el-text :type="paraphrase({ value: row.status, options: companyStatusOptions, l: 'type' })">
          {{ paraphrase({ value: row.status, options: companyStatusOptions }) }}
        </el-text>
      </template>
      <template #account_receivable="{ row }">
        <el-popover
          placement="top"
          title="收款账户信息"
          :width="300"
          trigger="click"
        >
          <el-descriptions :column="1">
            <el-descriptions-item label="收款账户">{{ row.account_receivable?.account_name || '--' }} <el-link v-show="row.account_receivable?.account_name" type="primary" :underline="false" v-copy="row.account_receivable?.account_name"><el-icon><CopyDocument /></el-icon></el-link></el-descriptions-item>
            <el-descriptions-item label="开户行">{{ row.account_receivable?.bank || '--' }} <el-link v-show="row.account_receivable?.bank" type="primary" :underline="false" v-copy="row.account_receivable?.bank"><el-icon><CopyDocument /></el-icon></el-link></el-descriptions-item>
            <el-descriptions-item label="银行账号">{{ row.account_receivable?.account_number || '--' }} <el-link v-show="row.account_receivable?.account_number" type="primary" :underline="false" v-copy="row.account_receivable?.account_number"><el-icon><CopyDocument /></el-icon></el-link></el-descriptions-item>
          </el-descriptions>
          <template #reference>
            <el-link type="primary" :underline="false">查看内容</el-link>
          </template>
        </el-popover>
      </template>

      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
        <el-button v-if="row.status !== 1" type="primary" link @click="onAuthUrl(row)"> 认证链接 </el-button>
        <el-button type="danger" link :icon="Delete" @click="onDelete(row)"> 删除 </el-button>
      </template>
    </ProTable>
    
    <AddOrUpdate ref="refAddOrUpdate" @refresh-list="refreshList" />
    <AuthPopup ref="refAuthPopup" />
  </div>
</template>

<script setup lang="tsx" name="company">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus, Delete, EditPen, CopyDocument } from "@element-plus/icons-vue";
import { companyStatusOptions } from "@/utils/serviceDict";
import { paraphrase } from "@/utils/filter";
import { getList, deleteData } from '@/api/modules/company';
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import AddOrUpdate from "./components/AddOrUpdate.vue";
import AuthPopup from "./components/AuthPopup.vue";

const proTable = ref<ProTableInstance>();

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80 },
  { prop: "company_name", label: "企业名称" },
  { prop: "register_no", label: "统一社会信用代码" },
  { prop: "legal_person", label: "法人姓名" },
  { prop: "user_name", label: "联系人姓名" },
  { prop: "contact", label: "联系人电话", width: 160 },
  { prop: "account_receivable", label: "收款账户信息", width: 120 },
  { prop: "status", label: "状态", width: 80 },
  { prop: "created_at", label: "创建时间", width: 160 },
  { prop: "operation", label: "操作", fixed: "right", width: 200 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

const refAddOrUpdate = ref();
const onAddOrUpdate = (row?: any) => {
  refAddOrUpdate.value?.init(row)
}

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

const refAuthPopup = ref();
const onAuthUrl = (row:any) => {
  refAuthPopup.value?.init(row)
}
</script>

<style lang="scss" scoped>
</style>
