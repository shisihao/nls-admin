<template>
  <!-- 分页组件 -->
  <el-pagination
    small
    :background="true"
    :current-page="pageable.pageNum"
    :default-page-size="pagingable.limit"
    :page-size="pageable.pageSize"
    :page-sizes="pagingable.pageSizes"
    :total="pageable.total"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>

<script setup lang="ts" name="Pagination">
import { pages } from "@/utils/serviceDict"

const pagingable = {  ...pages };
interface Pageable {
  pageNum: number;
  pageSize: number;
  total: number;
}

interface PaginationProps {
  pageable: Pageable;
  handleSizeChange: (size: number) => void;
  handleCurrentChange: (currentPage: number) => void;
}

defineProps<PaginationProps>();
</script>
