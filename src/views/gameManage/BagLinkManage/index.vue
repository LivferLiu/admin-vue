<template>
  <div class="app-container">
    <search-item
      ref="searchRef"
      :form-options="formOptions"
      :limit="limit"
      :page="currentPage"
      @onSearch="onSearch"
    />
    <div v-loading="loading" class="table-data">
      <el-col class="table-action">
        <router-link :to="{ name: 'CreateBagLink' }">
          <el-button type="primary">添加包链</el-button>
        </router-link>
      </el-col>
      <el-table border :data="tableData">
        <el-table-column label="编号" prop="id" />
        <el-table-column label="游戏名称" prop="game_name" />
        <el-table-column label="版本号" prop="game_version" />
        <el-table-column label="下载地址" prop="subpackage_link" />
        <el-table-column label="平台" prop="app_system" />
        <el-table-column
          label="打包状态"
          prop="subpackage_status"
          :formatter="packageStatus"
        />
        <el-table-column label="包链所属" prop="username" />
        <el-table-column label="申请时间" prop="created_at" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini">复制链接</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="qrCode(scope.row.id)"
            >[生成二维码]</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="destroy(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <admin-page
      :total="total"
      :limit="limit"
      :current-page="currentPage"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>
<script>
import searchItem from "@/components/search/search";
import adminPage from "@/components/pagination/adminPagination";
import config from "@/config/config";
import { treeData } from "@/api/group";
import { adminUserIndex } from "@/api/user";

export default {
  components: {
    searchItem,
    adminPage
  },
  data() {
    return {
      tableData: [],
      loading: false,
      total: 0,
      limit: parseInt(config.limit),
      currentPage: 1,
      formOptions: [
        {
          label: "游戏名称",
          prop: "game_name",
          element: "el-input"
        },
        {
          label: "包链所属",
          prop: "group_id",
          element: "el-cascader",
          props: {
            value: "id",
            label: "name",
            children: "child"
          },
          showAllLevels: false,
          placeholder: "小组",
          options: [
          ],
          events: {
            change: (val) => {
              // 根据组查询成员
              const lastGroupId = val.slice(-1)[0];
              adminUserIndex({ group_id: lastGroupId }).then(response => {
                const users = [];
                response.data.forEach(item => {
                  users.push({ label: item.username, value: item.admin_id });
                });
                this.formOptions[2]["options"] = users;
              });
            }
          }
        },
        {
          label: "",
          prop: "username",
          element: "el-select",
          placeholder: "组员",
          options: [
          ]
        },
        {
          label: "开服时间",
          prop: "timeRange",
          element: "el-date-picker"
        }
      ],
      userData: []
    };
  },
  created() {
    this.groupTreeData();
  },
  methods: {
    initData(params = {}) {
      adminUserIndex(params).then(response => {
        this.userData = response.data;
      });
    },
    // 小组树结构
    groupTreeData() {
      treeData().then(response => {
        this.$nextTick(() => {
          this.formOptions[1]["options"] = response.data;
        });
      });
    },
    onSearch(val) {
      this.initData(val);
    },
    // 切换每页显示多少条数据
    handleSizeChange(val) {
      this.limit = val;
      this.currentPage = 1;
      this.initData();
    },
    // 点击页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
    },
    handleChange(value) {
      console.log(value);
    },
    packageStatus(row) {
      const packageStatusDesc = ["申请中", "打包中", "已驳回", "分包失败", "打包成功"];
      return packageStatusDesc[row.subpackage_status];
    }
  }
};
</script>

<style lang="scss" scope>
.table-data {
  .table-action {
    padding-bottom: 1rem;
  }
}
</style>
