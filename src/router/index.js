import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/developRouter",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "create",
        name: "RouterCreate",
        component: () => import("@/views/developManage/children/create")
      },
      {
        path: "edit/:id",
        name: "RouterEdit",
        component: () => import("@/views/developManage/children/edit"),
        props: true
      }
    ]
  }
];

/**
 * 需要校验角色权限的路由
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () => new Router({
  // mode: 'history', // require service support

  // router滚动行为
  // 这个功能只在支持 history.pushState 的浏览器中可用
  scrollBehavior: () => ({ y: 0 }),

  // 不需要校验权限的路由列表
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();

  // matcher对象对外提供 match() 和 addRoutes()两个方法。
  // addRoutes() 作用是动态添加路由配置
  // match() 根据传入的rawLocation类型的raw 和当前的路径 currentRoute 计算出一个新的路径并返回
  router.matcher = newRouter.matcher; // reset router
}

export default router;
