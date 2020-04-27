import { asyncRoutes, constantRoutes } from "@/router";
import { menu } from "@/api/permission";
import componentsMap from "@/config/componentsMap";

// /**
//  * 通过比对角色是否包含在路由meta中,判断是否有此路由权限
//  * @param  roles
//  * @param  route
//  */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     // 路由meta中是否包含此角色
//     return roles.some(role => route.meta.roles.includes(role));
//   } else {
//     return true;
//   }
// }

/**
 * 通过递归获取所有有权限的路由
 * @param  routes asyncRoutes
 */
export function filterAsyncRoutes(routes) {
  const res = [];
  routes.map(route => {
    const tmp = { ...route };

    if (tmp.meta && tmp.meta.parent_id === 0) {
      tmp.component = componentsMap["layout"];
    } else {
      tmp.component = componentsMap[tmp.name];
    }

    if (tmp.meta && tmp.meta.noCache !== true) {
      tmp.meta.keepAlive = true;
    }
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children);
    }
    res.push(tmp);
  });

  return res;
}

/**
 * 将后台数据转化为树
 * @param  routes
 */
export function treeMenu(routes) {
  console.log(routes);
  for (const route of routes) {
    if (route.children) {
      const routeChildren = route.children;
      delete route.children;
      const tmp = treeMenuSecond(routeChildren, route.meta.id);
      route.children = tmp;
    }
  }
  return routes;
}

/**
 * 由于后台数据第一层有children,所以从第二层开始递归树
 * @param {object} routes
 * @param {Number} pid
 */
export function treeMenuSecond(routes, pid) {
  const tmp = [];
  for (const route of routes) {
    let p = {};
    if (route.meta.parent_id === pid) {
      p = { ...route };
      const children = treeMenuSecond(routes, route.meta.id);
      if (children && children.length) {
        p.children = children;
      }
      tmp.push(p);
    }
  }
  // console.log(tmp, "tmp");
  return tmp;
}

const state = {
  routes: [],
  addRoutes: [],
  permissionMenu: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
  SET_PERMISSION_MENU: (state, data) => {
    state.permissionMenu = data;
  }
};

const actions = {
  generateRoutes({ commit }, routes) {
    const accessedRoutes = filterAsyncRoutes(routes);
    // accessedRoutes = treeMenu(accessedRoutes);
    return new Promise(resolve => {
      accessedRoutes.forEach(route => {
        asyncRoutes.push(route);
      });
      commit("SET_ROUTES", asyncRoutes);
      resolve();
    });
  },
  menu({ commit }) {
    return new Promise((resolve, reject) => {
      menu().then(response => {
        const { data } = response;
        commit("SET_PERMISSION_MENU", data);
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

