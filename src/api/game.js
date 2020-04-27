import request from "@/utils/request";

// 游戏列表
export function gameList(params) {
  return request({
    url: "admin/game/index",
    method: "get",
    params
  });
}
