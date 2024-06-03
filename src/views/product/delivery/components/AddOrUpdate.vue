<template>
  <div>
    <el-dialog
      v-model="state.visible"
      width="800"
      top="30px"
      :title="state.form.id ? '编辑' : '新增'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClosed"
    >
      <div v-if="state.defaultLoading">
        <el-form ref="refForm" :model="state.form" :rules="rules" label-width="80px">
          <el-form-item label="模版名称" prop="name">
            <el-input v-model="state.form.name" placeholder="请输入分类名称" clearable />
          </el-form-item>
          <el-form-item label="城市" class="form-item-block">
            <el-space class="mb10">
              <el-link type="primary" :underline="false" @click="onAllTree">全选</el-link>
              <el-link type="info" :underline="false" @click="onCancelAllTree">取消全选</el-link>
            </el-space>
            <el-tree
              ref="refTree"
              node-key="value"
              show-checkbox
              render-after-expand
              :expand-on-click-node="false"
              :data="state.treeOptions"
              @check-change="onTreeChange"
            >
              <template #default="{ node, data }">
                <el-space>
                  <div>
                    {{ node.label }}
                  </div>
                  <div>
                    <el-input v-model="data.amount" class="w100" clearable placeholder="运费" oninput="value = value.replace(/[^0-9.]/g,'')" />
                  </div>
                  <div>
                    <el-input v-model="data.day" class="w100" clearable placeholder="预计天数" oninput="value = value.replace(/[^0-9.]/g,'')" />
                  </div>
                </el-space>
              </template>
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :loading="state.btnLoading" @click="onFormSubmit">确定</el-button>
          <el-button @click="state.visible = false"> 取消 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { treeAddress, treeId } from '@/utils/address';
import { addOrUpdate } from '@/api/modules/delivery';

const refForm = ref<FormInstance>();

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  treeOptions: JSON.parse(JSON.stringify(treeAddress())),
  form: {
    id: 0,
    name: "",
    freight: [],
    no_delivery: []
  }
});

const state = reactive(getInitialData());

const rules = ref({
  name: [{ required: true, message: "不能为空", trigger: ["blur", "change"] }]
});

const refTree = ref();

const init = (row: any) => {
  state.visible = true;
  state.defaultLoading = true;
  if (row) {
    state.form = JSON.parse(JSON.stringify(row));
    if (row.id) {
      nextTick(() => {
        // 省市区县
        const county = Array.from(new Set(treeId().flat()));
        // 与不配送的差集
        const differ = county.filter(v => !state.form.no_delivery.includes(v))
        // 设置
        refTree.value.setCheckedKeys(differ)

        // 设置价格
        const freight = new Map()
        state.form.freight.forEach(v => {
          if (v.amount > 0) {
            freight.set(v.id, v.amount)
          }
        })
        // 设置天数
        const days = new Map()
        state.form.freight.forEach(v => {
          if (v.day > 0) {
            days.set(v.id, v.day)
          }
        })

        function updateTree(tree, freight, days) {  
          // 处理数组中的每个节点  
          tree.forEach(v => {
            freight.has(v.value) && (v.amount = freight.get(v.value));
            days.has(v.value) && (v.day = days.get(v.value));
            if (v.children && v.children.length > 0) {
              updateTree(v.children, freight, days); // 递归处理子节点  
            }
          });
        };
        updateTree(state.treeOptions, freight, days)
      })
    }
  }
};

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};

defineExpose({
  init
});

// 全选
const onAllTree = () => {
  refTree.value.setCheckedNodes(state.treeOptions);
}
// 取消全选
const onCancelAllTree = () => {
  refTree.value.setCheckedNodes([]);

}
// 被选中时
const onTreeChange = () => {
  // 获取已选中的节点
  const allcheckedNodes = refTree.value.getCheckedNodes();
  // 所有选择的值的id
  const allId = allcheckedNodes.map(v => v.value)
  // 差集 过滤掉被选中的节点
  state.form.no_delivery = Array.from(new Set(treeId().flat())).filter(v => !allId.includes(v))
}

// 设置有 运费 天数 的数据
const onSetFreight = () => {
  // 获取已选中的节点
  const allcheckedNodes = refTree.value.getCheckedNodes();

  state.form.freight = allcheckedNodes.filter(v => parseFloat(v.amount) >= 0 || parseFloat(v.day) > 0)
    .map(v => {
      return {
        id: v.value,
        amount: v.amount,
        day: v.day
      }
    })
}

const emit = defineEmits(["refreshList"]);

const onFormSubmit = () => {
  refForm.value?.validate(async (valid: any) => {
    if (!valid) return;
    try {
      onSetFreight();
      const data:any = { ...state.form };
      state.btnLoading = true;
      addOrUpdate(data)
        .then(({ msg }) => {
          ElMessage.success({ message: msg });
          state.visible = false;
          emit("refreshList");
        })
        .finally(() => {
          state.btnLoading = false;
        });
    } catch (error) {
      console.log(error);
    }
  });
};
</script>

<style lang="scss" scoped>
.el-form {
  :deep(.form-item-block) {
    .el-form-item__content {
      display: block;
    }
  }
}
</style>
