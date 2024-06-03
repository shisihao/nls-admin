import { RouteRecordRaw } from "vue-router";
import { HOME_URL, LOGIN_URL } from "@/config";

/** 路由参数简介 */
interface customRouteRecordRaw {
	/** 路由访问路径 */
	path: string;
	/** 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选) */
	name: string;
	/** 路由重定向地址 */
	redirect: string;
	/** 视图文件路径 */
	component: string | (() => Promise<unknown>);
	/** 路由元信息 */
	meta: {
		/** 菜单和面包屑对应的图标 */
		icon: string;
		/** 路由标题 (用作 document.title || 菜单的名称) */
		title: string;
		/** 是否在菜单中隐藏, 需要高亮的 path (通常用作详情页高亮父级菜单) */
		activeMenu: string;
		/** 路由外链时填写的访问地址 */
		isLink: string;
		/** 是否在菜单中隐藏 (通常列表详情页需要隐藏) */
		isHide: boolean;
		/** 菜单是否全屏 (示例：数据大屏页面) */
		isFull: boolean;
		/** 菜单是否固定在标签页中 (首页通常是固定项) */
		isAffix: boolean;
		/** 当前路由是否缓存 */
		isKeepAlive: boolean;
	};
	/** 多级路由嵌套 */
	children: RouteRecordRaw[];
}

/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: HOME_URL
  },
  {
    path: LOGIN_URL,
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录"
    }
  },
  {
    path: "/layout",
    name: "layout",
    component: () => import("@/layouts/index.vue"),
    // component: () => import("@/layouts/indexAsync.vue"),
    redirect: HOME_URL,
    children: []
  }
];

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/components/ErrorMessage/403.vue"),
    meta: {
      title: "403页面"
    }
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/components/ErrorMessage/404.vue"),
    meta: {
      title: "404页面"
    }
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/components/ErrorMessage/500.vue"),
    meta: {
      title: "500页面"
    }
  },
  // Resolve refresh page, route warnings
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/components/ErrorMessage/404.vue")
  }
];
