<template>
  <div class="product-info2">
    <div v-if="form.is_much == 1">
      <el-form-item label="规格列表" prop="specs_properties" class="form-item-block max-w-800">
        <div class="specs-card mb10" v-for="(item, index) in form.specs_properties" :key="index">
          <div class="delete-specs-item cursor" @click="onDelSpecs(index)"><el-icon color="#f56c6c"><Delete /></el-icon></div>
          <div class="specs-item mb20">
            <div class="flx-align-center">
              <div class="specs-name">
                规格名
              </div>
              <div class="specs-properties">
                <el-form-item :prop="`specs_properties.${index}.name`" :rules="rules.s_name">
                  <el-input
                    v-model="form.specs_properties[index].name"
                    class="input-width"
                    clearable
                    placeholder="请输入规格名"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="specs-item">
            <div class="flx-align-center">
              <div class="specs-name">
                规格值
              </div>
              <div class="specs-properties">
                <el-space wrap class="mb1">
                  <div v-for="(propertiesItem, propertiesIndex) in item.properties" :key="propertiesIndex" class="properties-tag">
                    <el-tag type="success" effect="plain" closable @close="onDelSpecsValue(index, propertiesIndex)">{{ propertiesItem }}</el-tag>
                  </div>
                </el-space>
                <div class="mb20">
                  <el-space>
                    <el-form-item :prop="`specs_properties.${index}.newSpecsValue`" :rules="rules.p_name">
                      <el-input
                        v-model.trim="item.newSpecsValue"
                        class="w300"
                        clearable
                        placeholder="请输入规格值"
                        @keyup.enter="onAddSpecsValue(index)"
                      >
                        <template #append><div class="flx-center cursor" @click="onAddSpecsValue(index)"><el-icon><Plus /></el-icon>添加</div></template>
                      </el-input>
                    </el-form-item>
                  </el-space>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-space>
          <el-button v-if="form.specs_properties.length < 3" type="primary" plain :icon="Plus" @click="onAddSpecs">添加规格</el-button>
          <el-button v-if="form.specs_properties.length > 0" type="danger" plain :icon="Delete" @click="onClearSpecs">清空规格</el-button>
        </el-space>
      </el-form-item>
      <el-form-item label="商品属性" prop="skus" class="form-item-block max-w-1200">
        <el-table
          border
          max-height="500"
          :data="form.skus"
        >
          <el-table-column label="商品图片" width="104" align="center">
            <template #default="{ row }">
              <UploadImg v-model:image-url="row.image" :show-domain="true" width="80px" height="80px" />
            </template>
          </el-table-column>
          <el-table-column label="库存" width="200" align="center">
            <template #default="{ row, $index }">
              <el-form-item :prop="`skus.${$index}.stock`" :rules="rules.stock">
                <el-input-number v-model="row.stock" controls-position="right" :min="0" :precision="0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="价格" width="200" align="center">
            <template #default="{ row, $index }">
              <el-form-item :prop="`skus.${$index}.cny_price`" :rules="rules.cny_price">
                <el-input-number v-model="row.cny_price" controls-position="right" :min="0" :precision="2" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in form.specs_properties"
            :key="index"
            :label="item.name"
            min-width="104"
            align="center"
          >
            <template #default="{ row }">
              {{ row.specs_properties[index] && row.specs_properties[index].p_name }}
            </template>
          </el-table-column>
        </el-table>
        <el-space class="mt10">
          <div>
            <span v-show="state.batch.visible">批量设置</span>
            <el-button v-show="!state.batch.visible" :disabled="form.skus.length === 0" @click="state.batch.visible = true">批量设置</el-button>
          </div>
          <el-space v-if="state.batch.visible">
            <el-select
              v-model="state.batch.numType"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in numOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input-number
              v-model.trim="state.batch.numTotal"
              controls-position="right"
              :precision="state.batch.numType === 1 || state.batch.numType === 2 ? 2 : 0"
              :min="0"
            />
            <el-button-group>
              <el-button @click="onSetNum">确 定</el-button>
              <el-button :icon="Close" @click="onCloseSetNum" />
            </el-button-group>
          </el-space>
        </el-space>
      </el-form-item>
    </div>
    <div v-else>
      <el-form-item label="规格列表">
        无规格
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/stores/modules/product";
import { Delete, Plus, Close } from "@element-plus/icons-vue";
import ShopSkuModel from "./ShopSkuModel";
import { descartes } from "@/utils/index";
import UploadImg from "@/components/Upload/Img.vue";

const productStore = useProductStore();
const { form } = storeToRefs(productStore);

const validatePName = (rule: any, value: any, callback: any) => {
  const fieldIndex = rule.field.split(".").at(1);
  const isValue = form.value.specs_properties[fieldIndex].properties.includes(value);
  if (isValue) {
    callback(new Error('已有该规格值'))
  } else {
    callback()
  }
}

const rules = ref({
  s_name: [{ required: true, message: '请输入规格名', trigger: ['blur', 'change'] }],
  p_name: [{ validator: validatePName, trigger: ['blur', 'change'] }],
  stock: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }],
  cny_price: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]
})

const numOptions = [
  { label: '库存', value: 0 },
  { label: '价格', value: 1 }
]

const state = reactive({
  batch: {
    visible: false,
    numType: 0,
    numTotal: 0
  }
})

// 添加规格模版
const onAddSpecs = () => {
  form.value.specs_properties.push({ name: '', properties: [] });
}

// 删除规格模版
const onDelSpecs = (index:number) => {
  form.value.specs_properties.splice(index, 1);
  // 删除规格模版 生成一次规格列表
  formatSkusList();
}

// 清空所有规格模版
const onClearSpecs = () => {
  form.value.specs_properties = [];
  form.value.skus = [];
}

// 添加单个规格值
const onAddSpecsValue = (index:number) => {
  // 空值不允许添加
  if (!form.value.specs_properties[index].newSpecsValue) return;
  // 已有值不允许添加
  if (form.value.specs_properties[index].properties.includes(form.value.specs_properties[index].newSpecsValue)) return;
  // 添加新值
  form.value.specs_properties[index].properties.push(form.value.specs_properties[index].newSpecsValue);
  // 清空输入框
  form.value.specs_properties[index].newSpecsValue = '';
  // 添加单个规格值 生成一次规格列表
  formatSkusList();
}

// 删除单个规格值
const onDelSpecsValue = (index:number, i:number) => {
  form.value.specs_properties[index].properties.splice(i, 1);
  // 删除单个规格值 生成一次规格列表
  formatSkusList();
}

// 生成规格列表
const formatSkusList = () => {
  // 获得skus组合类型
  const garr = form.value.specs_properties.map((v:{ properties:string[] }) => {
    return v.properties
  })
  // 生成笛卡尔积
  const properties = descartes(garr)
  
  const defaultData = properties.map(v => {
    // 生成规格名-规格值
    const specs_properties = form.value.specs_properties.map((specs:{ name:string }, specsIndex:number) => {
      return { s_name: specs.name, p_name: v[specsIndex] }
    })
    // 获取已有旧数据
    const rawItem = form.value.skus.find((o:{ specs_properties:any }) => {
      const oldPname = o.specs_properties.map((x:{ p_name:string }) => {
        return x.p_name
      })
      return oldPname.join('/') === v.join('/')
    })
    // 构造skus
    const item = new ShopSkuModel({
      ...rawItem,
      specs_properties
    })

    return item;
  })
  form.value.skus = defaultData;
}

// 批量设置规格属性
const onSetNum = () => {
  const { numType, numTotal } = state.batch;
  if (typeof numTotal !== "number" || numTotal < 0) return;
  const name = ['stock', 'cny_price'];
  form.value.skus.forEach((v:string, i:number) => {
    form.value.skus[i][name[numType]] = numTotal;
  })
  state.batch.numTotal = 0
  onCloseSetNum();
}

// 关闭批量设置并清空
const onCloseSetNum = () => {
  state.batch = { visible: false, numType: 0, numTotal: 0 }
}
</script>

<style lang="scss" scoped>
.product-info2 {
  .max-w-800 {
    max-width: 800px;
  }
  .max-w-1200 {
    max-width: 1200px;
  }
  .w300 {
    width: 300px;
  }
  .cursor {
    cursor: pointer;
    user-select: none;
  }
  .specs-card {
    position: relative;
    border: 1px solid #e4e7ed;
    padding: 10px;
    
    .delete-specs-item {
      line-height: 1;
      position: absolute;
      right: 6px;
      top: 6px;
    }
    .specs-item {
      .specs-name {
        flex-shrink: 0;
        align-self: flex-start;
        margin-right: 8px;
      }
      .specs-properties {
        margin-right: 8px;
        flex-grow: 1;
        .properties-tag {
          line-height: 1;
        }
      }
    }
  }
  .specs-divider {
    margin: 10px 0;
  }
}
</style>