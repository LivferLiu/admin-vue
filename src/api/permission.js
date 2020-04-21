import request from "@/utils/request";

// 获取菜单
export function menu() {
  return request({
    url: "admin/permissions_menu",
    method: "get"
  });
}

// 提交菜单
export function store(data) {
  return request({
    url: "admin/menu_store",
    method: "post",
    params: data
  });
}
// 菜单详情
export function show(id) {
  return request({
    url: "admin/menu_info",
    method: "get",
    params: { id }
  });
}

// 路由菜单列表
export function menuList() {
  return request({
    url: "admin/menu",
    method: "get"
  });
}

export function menuDestroy(id) {
  return request({
    url: "admin/menu_del",
    method: "post",
    params: { id }
  });
}
