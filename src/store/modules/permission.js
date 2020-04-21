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
    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children);
    }
    res.push(tmp);
  });

  return res;
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

