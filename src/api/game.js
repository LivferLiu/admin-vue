import request from "@/utils/request";

// 游戏列表
export function gameList(params) {
  return request({
    url: "admin/game/index",
    method: "get",
    params
  });
}

// 区服列表
export function zoneList(params) {
  return request({
    url: "admin/gameZones/index",
    method: "get",
    params
  });
}

export function applyGame(params) {
  return request({
    url: "admin/game/apply",
    method: "post",
    data: params
  });
}
