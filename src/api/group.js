import request from "@/utils/request";

// 小组列表
export function groupIndex(params = {}) {
  return request({
    url: "admin/group/index",
    method: "get",
    params: params
  });
}

// 小组详情
export function groupShow(id) {
  return request({
    url: "admin/group/edit/" + id,
    method: "get"
  });
}

// 删除小组
export function groupDestroy(id) {
  return request({
    url: "admin/group/destroy/" + id,
    method: "delete"
  });
}

// 添加小组
export function groupStore(data) {
  return request({
    url: "admin/group/store",
    method: "post",
    data: data
  });
}

// 更新小组
export function groupUpdate(data) {
  return request({
    url: "admin/group/update",
    method: "post",
    data: data
  });
}

// 获取组树状结构
export function treeData() {
  return request({
    url: "admin/group/groupTree",
    method: "get"
  });
}
