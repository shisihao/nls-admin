<template>
  <div class="table-box">
    <div class="card mb10">
      <el-page-header @back="onGoBack">
        <template #content>
          门店流水({{ stores.name }})
        </template>
      </el-page-header>
    </div>
    <div class="card mb10">
      <el-space>
        <div>
          日期选择：
        </div>
        <div>
          <el-date-picker
            v-model="state.date"
            type="month"
            placeholder="选择日期"
            @change="onChangeDate"
          />
        </div>
        <el-button type="primary" :icon="Search" @click="getTableList()"> 搜索 </el-button>
        <el-button type="primary" :icon="Plus" :disabled="stores.status !== 3" @click="onIssueLog"> 添加流水 </el-button>
      </el-space>
    </div>
    <div class="card table-main" v-loading="state.loading">
      <el-space v-if="state.list.length > 0" direction="vertical" alignment="left" :size="40">
        <div v-for="(item, index) in state.list" :key="index">
          <div>
            <el-space>
              <span>月份：{{ item.year }}-{{item.month}}</span>
              <span>月销售额：{{ item.total_amount }}</span>
            </el-space>
          </div>
          <el-table :data="item.logs" class="mt10">
            <el-table-column prop="date" label="日期" width="160" align="center" />
            <el-table-column prop="amount" label="日营业额" min-width="160" align="center" />
            <el-table-column prop="purchasing_cost" label="采购成本" min-width="160" align="center" />
            <el-table-column prop="fixed_cost" label="固定成本" min-width="160" align="center" />
          </el-table>
        </div>
      </el-space>
      <el-empty v-else />
    </div>
      
    <div class="card mt10">
      <el-pagination
        class="mt0"
        small
        :background="true"
        :current-page="state.pages.page"
        :default-page-size="state.pages.limit"
        :page-size="state.pages.limit"
        :page-sizes="state.pages.pageSizes"
        :total="state.pages.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="getTableList"
        @current-change="getTableList"
      />
    </div>
    <IssueLog ref="refIssueLog" @refresh-list="refreshList" />
  </div>
</template>

<script setup lang="tsx" name="TradeLog">
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router"
import { dayjs } from 'element-plus';
import { Search, Plus } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { useCommonStore } from '@/stores/modules/common';
import { pages } from '@/utils/serviceDict';
import { getTradeLogList } from '@/api/modules/stores';
import IssueLog from "./components/IssueLog.vue";

const router = useRouter();

const commonStore = useCommonStore();
const { stores } = storeToRefs(commonStore);

const onGoBack = () => {
  router.back();
}

const state = reactive({
  loading: false,
  pages: {
    ...pages
  },
  date: "",
  search: {
    store_id: stores.value.id,
    year: "",
    month: ""
  },
  list: []
});

const onChangeDate = (val) => {
  let year = "";
  let month = "";
  if (val) {
    year = dayjs(val).year();
    month = dayjs(val).month() + 1;
  }
  state.search.year = year;
  state.search.month = month;
}

const getTableList = () => {
  const { page, limit } = state.pages
  state.loading = true;
  getTradeLogList({ page, limit, ...state.search })
    .then((response) => {
      state.list = response.data.data;
      state.pages.total = response.data.total;
    })
    .finally(() => {
      state.loading = false;
    });
};

onMounted(() => {
  getTableList();
})

const refreshList = () => {
  getTableList();
}

const refIssueLog = ref<InstanceType<typeof IssueLog> | null>(null);
const onIssueLog = () => {
  refIssueLog.value?.init({ id: state.search.store_id })
}
</script>
<style lang="scss" scoped>
</style>
