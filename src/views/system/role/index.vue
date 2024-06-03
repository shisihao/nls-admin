<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="角色列表"
      :pagination="false"
      :columns="columns"
      :request-api="getList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
        <el-button type="danger" link :icon="Delete" @click="onDelete(row)"> 删除 </el-button>
      </template>
    </ProTable>

    <AddOrUpdate ref="refAddOrUpdate" @refresh-list="refreshList" />
  </div>
</template>

<script setup lang="tsx" name="role">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import AddOrUpdate from "./components/AddOrUpdate.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getList, deleteData } from '@/api/modules/role';

const proTable = ref<ProTableInstance>();

const state = reactive({
  list: []
})

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80 },
  {  prop: "name", label: "名称", search: { el: 'input' } },
  {  prop: "alias", label: "别名", search: { el: 'input' } },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

const refAddOrUpdate = ref<InstanceType<typeof AddOrUpdate> | null>(null);
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
</script>

<style lang="scss" scoped>
</style>
