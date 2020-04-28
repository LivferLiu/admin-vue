export default {
  layout: () => import("@/layout"),
  GameList: () => import("@/views/gameManage/gameList"),
  RouterConfig: () => import("@/views/developManage/routerConfig"),
  GroupManage: () => import("@/views/organization/groupManage"),
  CreateGroup: () => import("@/views/organization/children/create"),
  EditGroup: () => import("@/views/organization/children/create"),
  StaffManage: () => import("@/views/staffManage/staffManage"),
  CreateStaff: () => import("@/views/staffManage/children/create"),
  EditStaff: () => import("@/views/staffManage/children/create"),
  ZoneList: () => import("@/views/gameManage/zoneList"),
  BagLinkManage: () => import("@/views/gameManage/BagLinkManage/index"),
  CreateBagLink: () => import("@/views/gameManage/BagLinkManage/createBagLink")
};
