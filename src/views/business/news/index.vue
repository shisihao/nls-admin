<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="资讯列表"
      :columns="columns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </template>
      
      <!-- 表格 主体内容展示 -->
      <template #cover="{ row }">
        <Pic :is-domain="true" :src="row.cover" />
      </template>
      <template #content="{ row }">
        <el-link type="primary" :underline="false" @click="onContentPopup(row)">查看内容</el-link>
      </template>
      <template #is_top="{ row }">
        <el-switch v-model="row.is_top" :inactive-value="0" :active-value="1" :before-change="() => onChangeTop(row)" />
      </template>

      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
        <el-button type="danger" link :icon="Delete" @click="onDelete(row)"> 删除 </el-button>
      </template>
    </ProTable>

    <AddOrUpdate ref="refAddOrUpdate" @refresh-list="refreshList" />
    <ContentPopup ref="refContentPopup" />
  </div>
</template>

<script setup lang="tsx" name="LessonCategory">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import ProTable from "@/components/ProTable/index.vue";
import { getList, deleteData, addOrUpdate } from '@/api/modules/news';
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import Pic from "@/components/Picture/Pic.vue";
import AddOrUpdate from "./components/AddOrUpdate.vue";
import ContentPopup from "./components/ContentPopup.vue";

const proTable = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getList(newParams)
}

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80 },
  { prop: "cover", label: "封面图", width: 100, showOverflowTooltip: false },
  { prop: "title", label: "标题", minWidth: 160, align: "left" },
  { prop: "content", label: "内容", minWidth: 160 },
  { prop: "is_top", label: "置顶", width: 80 },
  { prop: "created_at", label: "创建时间", width: 160 },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

const onChangeTop = (row:any) => {
  return new Promise((resolve, reject) => {
    addOrUpdate({ ...row, is_top: row.is_top ? 0 : 1 })
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

const refAddOrUpdate = ref<InstanceType<typeof AddOrUpdate> | null>(null);
const onAddOrUpdate = (row?: any) => {
  refAddOrUpdate.value?.init(row)
}

const refContentPopup = ref<InstanceType<typeof ContentPopup> | null>(null);
const onContentPopup = (row?: any) => {
  refContentPopup.value?.init(row)
}

const onDelete = (row: any) => {
  const { title , id } = row
  ElMessageBox.confirm(`确定对[(#${id})${title}]进行[删除]操作?`, '删除', {
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