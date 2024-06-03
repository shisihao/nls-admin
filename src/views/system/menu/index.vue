<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="权限列表"
      :pagination="false"
      :columns="columns"
      :request-api="getList"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </template>

      <!-- 表格 主体 -->
      <template #type="{ row }">
        <el-tag :type="paraphrase({ value: row.type, options: menuTypeOptions, l: 'type' }) || 'primary'">{{ paraphrase({ value: row.type, options: menuTypeOptions }) }}</el-tag>
      </template>
      <template #show="{ row }">
        <el-tag effect="plain" :type="paraphrase({ value: row.show, options: isStatusOptions, l: 'type' }) || 'primary'">{{ paraphrase({ value: row.show, options: isStatusOptions }) }}</el-tag>
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

<script setup lang="tsx" name="menus">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import AddOrUpdate from "./components/AddOrUpdate.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getList, deleteData } from '@/api/modules/menu';
import { getPageFormatMenuList, getSelectFormatMenuList } from '@/utils';
import { menuTypeOptions, isStatusOptions } from '@/utils/serviceDict';
import { paraphrase } from '@/utils/filter';

const proTable = ref<ProTableInstance>();

const state = reactive({
  list: []
})

const dataCallback = (data: any) => {
  state.list = getSelectFormatMenuList(data) as any;
  return getPageFormatMenuList(data);
};

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 180 },
  { prop: "name", label: "权限名称", search: { el: 'input' } },
  { prop: "alias", label: "权限别名", search: { el: 'input' } },
  { prop: "icon", label: "权限图标" },
  { prop: "url", label: "跳转地址", align: "left", minWidth: 200 },
  { prop: "type", label: "类型", width: 80 },
  { prop: "show", label: "是否显示", width: 80 },
  { prop: "sort", label: "排序", width: 80 },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

const refAddOrUpdate = ref<InstanceType<typeof AddOrUpdate> | null>(null);
const onAddOrUpdate = (row?: any) => {
  refAddOrUpdate.value?.init({ row, menuList: state.list as any })
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
