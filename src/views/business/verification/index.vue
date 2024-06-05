<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="课程分类列表"
      :columns="columns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <!-- <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </template> -->

      <!-- 表格 主体内容展示 -->
      <template #scene="{ row }">
        {{ paraphrase({ value: row.scene, options: sceneOptions }) }}
      </template>
      <template #type="{ row }">
        {{ paraphrase({ value: row.type, options: typeOptions }) }}
      </template>
      <template #state="{ row }">
        <el-text :type="paraphrase({ value: row.state, options: stateOptions, l: 'type' })">{{ paraphrase({ value: row.state, options: stateOptions }) }}</el-text>
      </template>
      <template #used="{ row }">
        <el-text :type="paraphrase({ value: row.used, options: usedOptions, l: 'type' })">{{ paraphrase({ value: row.used, options: usedOptions }) }}</el-text>
      </template>
      <template #used_at="{ row }">
        {{ row.used_at || '-' }}
      </template>
      <!-- 表格操作 -->
      <!-- <template #operation="{ row }">
        <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
        <el-button type="danger" link :icon="Delete" @click="onDelete(row)"> 删除 </el-button>
      </template> -->
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="poster">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import ProTable from "@/components/ProTable/index.vue";
import { getList } from '@/api/modules/verification';
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { userTypeOptions } from '@/utils/serviceDict';
import { paraphrase } from '@/utils/filter';
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";

const sceneOptions = [
  { label: '注册', value: 'register' },
  { label: '登录', value: 'login' },
  { label: '修改登录密码', value: 'update-login-pass' },
  { label: '设置/修改支付密码', value: 'set-pay-pass' }
]

const typeOptions = [
  { label: '手机短信', value: 'sms' },
  { label: '邮件类型', value: 'email' }
]

const stateOptions = [
  { label: '发送失败', value: 0, type: 'error' },
  { label: '发送成功', value: 1, type: 'success' }
]

const usedOptions = [
  { label: '未使用', value: 0, type: '' },
  { label: '已使用', value: 1, type: 'info' },
]

const proTable = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getList(newParams)
}

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80 },
  { prop: "number", label: "手机号", width: 120, align: "left",
    search: {
      el: 'input',
      props: { placeholder: '请输入 手机号' }
    }
  },
  { prop: "scene", label: "使用类型", width: 120 },
  { prop: "type", label: "验证类型", width: 120 },
  { prop: "code", label: "验证码", width: 120 },
  { prop: "message", label: "信息", minWidth: 120, align: "left" },
  { prop: "state", label: "发送状态", width: 120 },
  { prop: "used", label: "使用状态", width: 120 },
  { prop: "used_at", label: "使用时间", width: 160 },
  { prop: "created_at", label: "创建时间", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

// 删除
const onDelete = (row: any) => {
  const { id } = row
  ElMessageBox.confirm(`确定对[(#${id})]进行[删除]操作?`, '删除', {
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
:deep(.el-popper) {
  max-width: 50% !important;
}

</style>