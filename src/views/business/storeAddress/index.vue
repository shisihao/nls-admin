<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="选址列表"
      :columns="columns"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <!-- <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </template> -->
      
      <!-- 表格 主体内容展示 -->
      <template #expand="scope">
        <el-descriptions size="default" :column="1">
          <el-descriptions-item label="创建时间">{{ scope.row.created_at }}</el-descriptions-item>
          <el-descriptions-item label="其他说明">{{ scope.row.remark }}</el-descriptions-item>
        </el-descriptions>
      </template>
      <template #user="{ row }">
        <el-space alignment="left">
          <div class="flx-align-center">
            <Avatar :is-domain="true" :src="row.user?.avatar" />
          </div>
          <el-space direction="vertical" alignment="left" :size="0">
            <div>
              {{ row.user?.name }}
              <span v-if="row.user?.certification">
                <el-divider direction="vertical" />
                <el-text type="primary">{{ row.user?.certification.name }}</el-text>
              </span>
            </div>
            <div>
              {{ row.user?.phone || row.user?.email }}
            </div>
          </el-space>
        </el-space>
      </template>
      <template #store="{ row }">
       <div>
        # {{ row.store?.id }}
       </div>
       <div>
        {{ row.store?.name }}
       </div>
      </template>
      <template #cover="{ row }">
        <el-scrollbar>
          <el-space>
            <Pic v-for="(item, index) in row.cover" :key="index" :is-domain="true" :src="item" />
          </el-space>
        </el-scrollbar>
      </template>
      <template #environment_images="{ row }">
        <el-scrollbar>
          <el-space>
            <Pic v-for="(item, index) in row.environment_images" :key="index" :is-domain="true" :src="item" />
          </el-space>
        </el-scrollbar>
      </template>
      <template #address="{ row }">
        {{ row.region?.merger_name }} {{ row.address }}
      </template>
      <template #cost="{ row }">
        <div>
          转让费：¥{{ row.transfer_fee }}
        </div>
        <div>
          中介费：¥{{ row.agency_fee }}
        </div>
        <div>
          门店面积：{{ row.area }}m²
        </div>
      </template>
      <template #rent="{ row }">
        <div>
          租金：¥{{ row.rent }}
        </div>
        <div>
          付款方式：{{ row.pay_type }}
        </div>
      </template>

      <!-- 表格操作 -->
      <template #operation="{ row }">
        <el-button v-show="isSetStore(row)" type="primary" link :icon="Aim" @click="onSetStore(row)"> 选定 </el-button>
      </template>
    </ProTable>

  </div>
</template>

<script setup lang="tsx" name="storeAddress">
import { ref, computed } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getList, setStore } from '@/api/modules/storeAddress';
import { Aim } from "@element-plus/icons-vue";
import Avatar from "@/components/Picture/Avatar.vue";
import Pic from "@/components/Picture/Pic.vue";

const proTable = ref<ProTableInstance>();

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getList(newParams)
}

const columns: ColumnProps[] = [
  { type: "expand", label: "Expand", width: 80 },
  { prop: "id", label: "#", width: 80 },
  { prop: "user", label: "账号", minWidth: 160, align: "left" },
  { prop: "store", label: "推荐门店信息", minWidth: 160, align: "left" },
  { prop: "cover", label: "现门店照片", width: 222, align: "left", showOverflowTooltip: false },
  { prop: "environment_images", label: "周围环境图", width: 222, align: "left", showOverflowTooltip: false },
  { prop: "address", label: "地址", width: 222, align: "left", showOverflowTooltip: false },
  { prop: "cost", label: "费用", width: 160, align: "left" },
  { prop: "rent", label: "租金", width: 160, align: "left" },
  { prop: "operation", label: "操作", fixed: "right", width: 160 }
];

const refreshList = () => {
  proTable.value?.getTableList();
}

const isSetStore = computed(() => {
  return (row) =>{
    return row.status === 0 && row.store?.address_id === 0 && row.store?.status === 1;
  }
})

const onSetStore = (row: any) => {
  const { region, address, id } = row
  ElMessageBox.confirm(`确定对地址[${ region?.merger_name } ${ address }]进行[选定]操作?`, '提示', {
    autofocus: false,
    type: 'success'
  })
    .then(() => {
      setStore({ id })
        .then(({ msg = '选定成功' }) => {
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