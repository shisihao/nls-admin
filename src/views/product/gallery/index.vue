<template>
  <div class="table-box">
    <ProTable ref="proTable" title="分类列表" :columns="columns" :request-api="getTableList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </template>

      <!-- 表格 主体内容展示 -->
      
      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
        <el-button type="danger" link :icon="Delete" @click="onDelete(row)"> 删除 </el-button>
      </template>
    </ProTable>
    <AddOrUpdate ref="refAddOrUpdate" @refresh-list="refreshList" />
  </div>
</template>

<script setup lang="tsx" name="Gallery">
import { reactive, ref } from "vue";
import { CirclePlus, EditPen, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getList, deleteData } from '@/api/modules/gallery';
import AddOrUpdate from "./components/AddOrUpdate.vue";

const proTable = ref<ProTableInstance>();

const state = reactive({
  search: {},
  list: []
});

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80 },
  { prop: "name", label: "分类名称", minWidth: 160, align: "left" },
  { prop: "sort", label: "排序", width: 80 },
  { prop: "created_at", label: "创建时间", width: 160 },
  { prop: "operation", label: "操作", fixed: "right", width: 180 }
];

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getList(newParams)
}

const refreshList = () => {
  proTable.value?.getTableList();
}

const refAddOrUpdate = ref<InstanceType<typeof AddOrUpdate> | null>(null);
const onAddOrUpdate = (row?: any) => {
  refAddOrUpdate.value?.init(row)
}

const onDelete = (row: any) => {
  const { name, id } = row
  ElMessageBox.confirm(`确定对[(#${id})${name}]进行[删除]操作?`, '删除', {
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
