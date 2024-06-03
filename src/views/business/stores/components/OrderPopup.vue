<template>
  <div>
    <el-dialog
      v-model="state.visible"
      width="600"
      title="合伙人"
      @closed="onClosed"
    >
      <div v-if="state.defaultLoading">
        <el-descriptions v-if="state.form.order.length > 0" border :column="2">
          <div v-for="(item, index) in state.form.order" :key="index">
            <el-descriptions-item label-align="center" label-class-name="w80" :label="`合伙人${index + 1}`">
              <el-space>
                <div class="flx-align-center">
                  <Avatar :is-domain="true" :src="item.user.avatar" />
                </div>
                <el-space direction="vertical" alignment="left" :size="0">
                  <div>
                    #{{ item.user.id }} {{ item.user.name }}
                    <span v-if="item.user.certification">
                      <el-divider direction="vertical" />
                      <el-text type="primary">{{ item.user.certification.name }}</el-text>
                    </span>
                  </div>
                  <div>
                    {{ item.user.phone || item.user.email }}
                  </div>
                </el-space>
              </el-space>
            </el-descriptions-item>
            <el-descriptions-item label-align="center" label-class-name="w80" label="数量">
              x{{ item.num }}
            </el-descriptions-item>
          </div>
        </el-descriptions>
        <el-empty v-else />
      </div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :loading="state.btnLoading" @click="onFormSubmit">确定</el-button>
          <el-button @click="state.visible = false"> 取消 </el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import Avatar from "@/components/Picture/Avatar.vue";

const getInitialData = () => ({
  visible: false,
  loading: false,
  btnLoading: false,
  defaultLoading: false,
  form: {
    id: 0,
    order: []
  }
});

const state = reactive(getInitialData());

const init = (row: any) => {
  state.visible = true;
  state.defaultLoading = true;
  if (row) {
    state.form = JSON.parse(JSON.stringify(row));
  }
};

const onClosed = () => {
  Object.assign(state, JSON.parse(JSON.stringify(getInitialData())));
};

defineExpose({
  init
});

const onFormSubmit = () => {
  state.visible = false;
};
</script>

<style lang="scss" scoped>
.content {
  min-height: 60vh;
  :deep(img) {
    max-width: 100%;
  }
  :deep(video) {
    max-width: 100%;
  }
}
</style>
