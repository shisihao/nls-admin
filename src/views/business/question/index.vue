<template>
  <div class="main-box">
    <TreeFilter
      title="类型选择"
      :data="userTypeOptionsFilter"
      :default-value="state.search.tabValue"
      @change="changeTreeFilter"
    />
    <div class="table-box">
      <ProTable
        ref="proTable"
        title="课程分类列表"
        :columns="columns"
        :request-api="getTableList"
      >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
          <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
        </template>

        <!-- 表格 主体内容展示 -->
        <template #type="{ row }">
          <el-tag effect="plain" :type="paraphrase({ value: row.type, options: userTypeOptions, l: 'type' })">
            {{ paraphrase({ value: row.type, options: userTypeOptions }) }}
          </el-tag>
        </template>
        <template #seconds="{ row }">
          {{ row.seconds }}s
        </template>
        <!-- 表格操作 -->
        <template #operation="{ row }">
          <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
          <el-button type="danger" link :icon="Delete" @click="onDelete(row)"> 删除 </el-button>
        </template>
      </ProTable>
    </div>
    <AddOrUpdate ref="refAddOrUpdate" @refresh-list="refreshList" />
  </div>
</template>

<script setup lang="tsx" name="poster">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import ProTable from "@/components/ProTable/index.vue";
import TreeFilter from "@/components/TreeFilter/index.vue";
import { getList, deleteData } from '@/api/modules/question';
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { userTypeOptions } from '@/utils/serviceDict';
import { paraphrase } from '@/utils/filter';
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import AddOrUpdate from "./components/AddOrUpdate.vue";

const state = reactive({
  search: {
    tabValue: 0
  }
})

const userTypeOptionsFilter = userTypeOptions.slice(1).map((item) => {
  return {
    id: item.value,
    label: item.label
  }
})

const proTable = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.type = state.search.tabValue;
  return getList(newParams)
}

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80 },
  { prop: "type", label: "类型", width: 100, align: "center" },
  { prop: "ask", label: "问题", minWidth: 160, align: "left" },
  { prop: "answers", label: "回答", width: 160, align: "left" },
  { prop: "seconds", label: "回答限时", width: 80 },
  { prop: "sort", label: "排序", width: 80 },
  { prop: "created_at", label: "创建时间", width: 160 },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

const refAddOrUpdate = ref<InstanceType<typeof AddOrUpdate> | null>(null);
const onAddOrUpdate = (row?: any) => {
  refAddOrUpdate.value?.init(row)
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

const changeTreeFilter = (val) => {
  state.search.tabValue = val;
  proTable.value?.search();
}
</script>

<style lang="scss" scoped>
:deep(.el-popper) {
  max-width: 50% !important;
}

</style>