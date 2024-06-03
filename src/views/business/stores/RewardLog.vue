<template>
  <div class="table-box">
    <div class="card mb10">
      <el-page-header @back="onGoBack">
        <template #content>
          分红流水({{ stores.name }})
        </template>
      </el-page-header>
    </div>
    <div class="card table-main" v-loading="state.loading">
      <ProTable ref="proTable" title="流水列表" :columns="columns" :request-api="getTableList">
        <!-- 表格 header 按钮 -->
        <!-- <template #tableHeader>
          <el-button type="success" plain :icon="Download" :loading="state.downloadLoading" @click="onExportData"> 导出数据 </el-button>
        </template> -->

        <!-- 表格 主体内容展示 -->
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
        <template #action="{ row }">
          <el-text :type="row.action === 1 ? 'success' : 'danger'">{{ paraphrase({ value: row.action, options: actionOptions }) }}</el-text>
        </template>
        <template #currency="{ row }">
          <el-tag>{{ paraphrase({ value: row.currency, options: fundType }) }}</el-tag>
        </template>
        <template #type="{ row }">
          <el-tag>{{ paraphrase({ value: row.type, options: typeOptions }) }}</el-tag>
        </template>
        
        <!-- 表格操作 -->
      </ProTable>
    </div>
  </div>
</template>

<script setup lang="tsx" name="TradeLog">
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router"
import { Search, Plus } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { useCommonStore } from '@/stores/modules/common';
import ProTable from "@/components/ProTable/index.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { fundType, actionOptions } from '@/utils/serviceDict';
import { paraphrase } from "@/utils/filter";
import { getRewardLogList } from '@/api/modules/stores';
import Avatar from "@/components/Picture/Avatar.vue";

const proTable = ref<ProTableInstance>();

const router = useRouter();

const commonStore = useCommonStore();
const { stores } = storeToRefs(commonStore);

const onGoBack = () => {
  router.back();
}

const typeOptions = [
  { label: "合伙人分红", value: "sale_reward" },
  { label: "推荐人分红", value: "recommend_reward" }
] 

const state = reactive({
  loading: false,
  search: {
    store_id: stores.value.id
  },
  list: []
});

const columns: ColumnProps[] = [
  { prop: "id", label: "#", width: 80 },
  { prop: "user", label: "账号", minWidth: 160, align: "left" },
  { prop: "title", label: "标题", minWidth: 160, align: "left" },
  { prop: "amount", label: "数量", width: 120 },
  { prop: "action", label: "收支类型", width: 80,
    // search: {
    //   el: "select",
    //   defaultValue: '',
    //   props: {
    //     clearable: true
    //   }
    // },
    // enum: actionOptions
  },
  { prop: "currency", label: "资产类型", width: 80,
    // search: {
    //   el: "select",
    //   defaultValue: '',
    //   props: {
    //     clearable: true
    //   }
    // },
    // enum: fundType
  },
  { prop: "type", label: "流水类型", width: 100,
    search: {
      el: "select",
      defaultValue: 'sale_reward',
      props: {
        clearable: true
      }
    },
    enum: typeOptions
  },
  { prop: "created_at", label: "创建时间", width: 160,
    // search: {
    //   el: "date-picker",
    //   props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss", clearable: true },
    //   defaultValue: []
    // }  
  }
];

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.store_id = stores.value.id;
  return getRewardLogList(newParams)
}
</script>
<style lang="scss" scoped>
</style>
