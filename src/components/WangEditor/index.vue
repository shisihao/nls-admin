<template>
  <div> 
    <div v-if="resetEditor" :class="['editor-box', self_disabled ? 'editor-disabled' : '']">
      <Toolbar v-if="!hideToolBar" class="editor-toolbar" :editor="editorRef" :default-config="toolbarConfig" :mode="mode" />
      <Editor
        v-model="valueHtml"
        class="editor-content"
        :style="{ height }"
        :mode="mode"
        :default-config="editorConfig"
        @on-created="handleCreated"
        @on-blur="handleBlur"
      />
    </div>
    <el-dialog v-model="state.visible" append-to-body title="富文本内容预览" width="1000px" top="30px" style="min-height: 500px;">
      <div v-if="valueHtml" class="preview-content" v-html="valueHtml"></div>
      <el-empty v-else />
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="WangEditor">
import { nextTick, computed, inject, shallowRef, onBeforeUnmount, reactive } from "vue";
import { IToolbarConfig, IEditorConfig, IDomEditor, IButtonMenu, Boot } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { uploadAliOssApi } from "@/components/Upload/uploadAliOss";
import "@wangeditor/editor/dist/css/style.css";
import { formContextKey, formItemContextKey } from "element-plus";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore()
const { oss }: { oss: any } = storeToRefs(userStore)

const state = reactive({
  visible: false
})

// 自定义 预览
class previewButtonMenu implements IButtonMenu {   // TS 语法

  constructor() {
    this.title = '预览' // 自定义菜单标题
    // this.iconSvg = '<svg>...</svg>' // 可选
    this.tag = 'button'
  }

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor: IDomEditor): string | boolean {   // TS 语法
  // getValue(editor) {                              // JS 语法
    return false
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor: IDomEditor): boolean {  // TS 语法
  // isActive(editor) {                    // JS 语法
    return false
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor: IDomEditor): boolean {   // TS 语法
  // isDisabled(editor) {                     // JS 语法
    return false
  }

  // 点击菜单时触发的函数
  exec(editor: IDomEditor, value: string | boolean) {   // TS 语法
  // exec(editor, value) {                              // JS 语法
    if (this.isDisabled(editor)) return
    state.visible = true
    // editor.insertText(value) // value 即 this.value(editor) 的返回值
  }
}

const menuPreviewConf = {
  key: 'menuPreview', // 定义 menu key ：要保证唯一、不重复（重要）
  factory() {
    return new previewButtonMenu() // 把 `YourMenuClass` 替换为你菜单的 class
  },
}

// 富文本 DOM 元素
const editorRef = shallowRef();

// 实列化编辑器
const handleCreated = (editor: any) => {
  if (!editor.getAllMenuKeys().includes('menuPreview')) {
    Boot.registerMenu(menuPreviewConf)
  }
  editorRef.value = editor;
};

// 接收父组件参数，并设置默认值
interface RichEditorProps {
  value: string; // 富文本值 ==> 必传
  toolbarConfig?: Partial<IToolbarConfig>; // 工具栏配置 ==> 非必传（默认为空）
  editorConfig?: Partial<IEditorConfig>; // 编辑器配置 ==> 非必传（默认为空）
  height?: string; // 富文本高度 ==> 非必传（默认为 500px）
  mode?: "default" | "simple"; // 富文本模式 ==> 非必传（默认为 default）
  hideToolBar?: boolean; // 是否隐藏工具栏 ==> 非必传（默认为false）
  disabled?: boolean; // 是否禁用编辑器 ==> 非必传（默认为false）
  resetEditor?: boolean; // 重置编辑器 ==> 非必传（默认为false）
}
const props = withDefaults(defineProps<RichEditorProps>(), {
  toolbarConfig: () => {
    return {
      excludeKeys: [],
      insertKeys: {
        index: -1, // 插入的位置，基于当前的 toolbarKeys
        keys: ['menuPreview']
      }
    };
  },
  editorConfig: () => {
    return {
      placeholder: "请输入内容...",
      autoFocus: false,
      MENU_CONF: {}
    };
  },
  height: "500px",
  mode: "default",
  hideToolBar: false,
  disabled: false,
  resetEditor: true
});

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

// 判断当前富文本编辑器是否禁用
if (self_disabled.value) nextTick(() => editorRef.value.disable());

// 富文本的内容监听，触发父组件改变，实现双向数据绑定
type EmitProps = {
  (e: "update:value", val: string): void;
  (e: "check-validate"): void;
};
const emit = defineEmits<EmitProps>();
const valueHtml = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    // 防止富文本内容为空时，校验失败
    if (editorRef.value.isEmpty()) val = "";
    emit("update:value", val);
  }
});

/**
 * @description 图片自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 * */
type InsertFnTypeImg = (url: string, alt?: string, href?: string) => void;
props.editorConfig.MENU_CONF!["uploadImage"] = {
  async customUpload(file: File, insertFn: InsertFnTypeImg) {
    if (!uploadImgValidate(file)) return;
    let formData = new FormData();
    formData.append("file", file);
    try {
      const data = await uploadAliOssApi({ file: file });
      let fileName = `${oss.value.DoMain}${data.name}`;
      insertFn(fileName);
    } catch (error) {
      console.log(error);
    }
  }
};

// 图片上传前判断
const uploadImgValidate = (file: File): boolean => {
  console.log(file);
  return true;
};

/**
 * @description 视频自定义上传
 * @param file 上传的文件
 * @param insertFn 上传成功后的回调函数（插入到富文本编辑器中）
 * */
type InsertFnTypeVideo = (url: string, poster?: string) => void;
props.editorConfig.MENU_CONF!["uploadVideo"] = {
  async customUpload(file: File, insertFn: InsertFnTypeVideo) {
    if (!uploadVideoValidate(file)) return;
    let formData = new FormData();
    formData.append("file", file);
    try {
      const data = await uploadAliOssApi({ file: file });
      let fileName = `${oss.value.DoMain}${data.name}`;
      insertFn(fileName);
    } catch (error) {
      console.log(error);
    }
  }
};

// 视频上传前判断
const uploadVideoValidate = (file: File): boolean => {
  console.log(file);
  return true;
};

// 编辑框失去焦点时触发
const handleBlur = () => {
  formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  if (!editorRef.value) return;
  editorRef.value.destroy();
});

defineExpose({
  editor: editorRef
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
