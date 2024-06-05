<template>
  <div>
    <el-row :gutter="20" class="panel-group">
      <el-col :xs="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">用户数</div>
            <el-space direction="vertical" alignment="left">
              <el-statistic title="用户总数" :value="state.panel.user.total" />
              <div style="height: 112px;"></div>
            </el-space>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">认证</div>
            <el-space direction="vertical" alignment="left">
              <el-statistic title="认证中" :precision="0" :value="state.panel.cert.wait" />
              <el-statistic title="认证通过" :precision="0" :value="state.panel.cert.success" />
              <el-statistic title="认证驳回" :precision="0" :value="state.panel.cert.fail" />
            </el-space>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="home">
import { reactive, onMounted } from "vue";
import BigNumber from "bignumber.js";
import { getList } from "@/api/modules/home";

const state = reactive({
  panel: {
    user: {
      total: 0, //用户总数
    },
    cert: {
      wait: 0,  //认证中
      success: 0, //认证通过
      fail: 0 //驳回
    }
  }
});

onMounted(() => {
  getList()
    .then((response: any) => {
      Object.keys(response.data).forEach(v => {
        Object.keys(response.data[v]).forEach(x => {
          state.panel[v][x] = new BigNumber(response.data[v][x]).toNumber();
        })
      })
    })
    .catch((error: any) => {});
})

</script>

<style scoped lang="scss">
.panel-group {
  .card-panel-col {
    margin-bottom: 20px;
  }
  .card-panel {
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px 20px;
      text-align: left;
      .card-panel-text {
        line-height: 18px;
        color: #262626;
        font-size: 14px;
        margin-bottom: 12px;
        font-weight: normal;
      }

      .card-panel-num {
        font-size: 20px;
      }
      .card-panel-warning {
        color: red;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
