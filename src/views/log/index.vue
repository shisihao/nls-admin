<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="门店列表"
      :columns="columns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <!-- <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </template> -->

      <!-- 表格 主体内容展示 -->
      <template #admin="{ row }">
        <div>
          # {{ row.admin_id }}
        </div>
        <div>
          {{ row.admin_name }}
        </div>
      </template>

      <!-- 表格操作 -->
      <!-- <template #operation="{ row }">
        <el-button type="primary" link :icon="EditPen" @click="onAddOrUpdate(row)"> 编辑 </el-button>
      </template> -->
    </ProTable>
  </div>
</template>

<script setup lang="tsx" name="log">
import { ref } from "vue";
import ProTable from "@/components/ProTable/index.vue";
import { getSystemlogList } from '@/api/modules/common';
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";

const proTable = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getSystemlogList(newParams)
}

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80 },
  { prop: "ip", label: "IP", width: 120 },
  { prop: "request_method", label: "请求方式", width: 80 },
  { prop: "code", label: "状态码", width: 80 },
  { prop: "module", label: "路由", minWidth: 180, align: "left" },
  { prop: "message", label: "信息", minWidth: 120, align: "left" },
  { prop: "admin", label: "管理员", minWidth: 120, align: "left" },
  { prop: "created_at", label: "创建时间", width: 160 }
];
</script>

<style lang="scss" scoped>
</style>
