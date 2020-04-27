import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/admin/login",
    method: "post",
    data
  });
}
// 获取登录用户信息
export function getInfo(token) {
  return request({
    url: "/admin/adminUser/show",
    method: "get"
  });
}

// 用户列表
export function adminUserIndex(params) {
  return request({
    url: "/admin/adminUser/index",
    method: "get",
    params
  });
}

// 创建用户
export function createStaff(params) {
  return request({
    url: "admin/adminUser/store",
    method: "post",
    data: params
  });
}

// 查看用户信息
export function staffShow(id) {
  return request({
    url: "admin/adminUser/edit/" + id,
    method: "get"
  });
}

export function updateStaff(params) {
  return request({
    url: "admin/adminUser/update",
    method: "post",
    data: params
  });
}

export function updateStatus(id) {
  return request({
    url: "admin/adminStatus/" + id,
    method: "put"
  });
}
