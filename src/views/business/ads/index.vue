<template>
  <div class="table-box">
    <div class="card app-box">
      <div class="mb10">
        <el-button type="primary" :icon="CirclePlus" @click="onAddOrUpdate()"> 新增 </el-button>
      </div>
      <el-empty v-if="state.list.length === 0" v-loading="state.loading" description="暂无数据" />
      <div v-else>
        <div class="all-card">
          <el-space wrap>
            <el-card v-for="(value, index) in state.list" :key="index" class="box-card" shadow="hover">
              <template #header>
                <div style="position: relative;">
                  <div>
                    {{ value.pos ? value.pos.name : '' }}
                  </div>
                  <div style="position: absolute;right: 0;top: 0;">
                    <el-link v-if="value.url_type === 1" :href="value.url" type="primary" target="_blank">{{ paraphrase({ value: value.url_type, options: adsTypeOptions }) }}</el-link>
                    <el-link v-else :underline="false">{{ paraphrase({ value: value.url_type, options: adsTypeOptions }) }}</el-link>
                  </div>
                </div>
              </template>

              <div class="card-content">
                <Pic width="100%" height="145px" :is-domain="true" :src="value.image" />
              </div>

              <div class="card-footer">
                <section @click="onAddOrUpdate(value)">
                  <el-text type="primary">
                    <el-icon>
                      <Edit />
                    </el-icon>
                    编辑
                  </el-text>
                </section>
                <section @click="onDelete(value)">
                  <el-text type="danger">
                    <el-icon>
                      <Delete />
                    </el-icon>
                    删除
                  </el-text>
                </section>
              </div>
            </el-card>
          </el-space>
        </div>
      </div>
      <el-pagination
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
    <AddOrUpdate ref="refAddOrUpdate" @refresh-list="refreshList" />
  </div>
</template>

<script setup lang="tsx" name="ad">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { CirclePlus, Delete, Edit } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";
import { pages, adsTypeOptions } from "@/utils/serviceDict";
import { paraphrase } from "@/utils/filter";
import { getList, deleteData } from '@/api/modules/ads';
import AddOrUpdate from "./components/AddOrUpdate.vue";
import Pic from "@/components/Picture/Pic.vue";

const userStore = useUserStore()
const { oss }: { oss: any } = storeToRefs(userStore)

const refAddOrUpdate = ref<InstanceType<typeof AddOrUpdate> | null>(null);

const state = reactive({
  loading: false,
  pages: {
    ...pages
  },
  list: []
})

const getTableList = () => {
  state.loading = true
  getList()
    .then((response:any) => {
      state.list = response.data.data;
      state.pages.total = response.data.total;
    })
    .finally(() => {
      state.loading = false;
    })
}

const refreshList = () => {
  getTableList()
}

const onAddOrUpdate = (row?: any) => {
  refAddOrUpdate.value?.init(row)
}

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

onMounted(() => {
  getTableList()
})
</script>

<style lang="scss" scoped>
.app-box {
  height: 100%;
  .box-card {
    width: 260px;
    height: 300px;
    margin: 10px;
    :deep(.el-card__header) {
      height: 55px;
    }
    :deep(.el-card__body) {
      height: calc(100% - 55px);
      padding: 0;
      .card-content {
        width: 100%;
        height: calc(100% - 60px);
        padding: 20px;
        margin-bottom: 19px;
        overflow: hidden;
        box-sizing: border-box;
        .el-empty__image {
          width: 60px;
        }
      }
      .card-footer {
        width: 100%;
        height: 40px;
        display: flex;
        border-top: 1px solid #e6ebf5;
        section {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &:nth-child(2) {
            width: calc(50% - 1px);
            border-left: 1px solid #e6ebf5;
          }
        }
      }
    }
  }
}
</style>
