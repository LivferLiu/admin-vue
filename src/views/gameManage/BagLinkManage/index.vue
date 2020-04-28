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
        <router-link :to="{name:'CreateGroup'}">
          <el-button type="primary">添加包链</el-button>
        </router-link>
      </el-col>
      <el-table border :data="tableData">
        <el-table-column label="编号" prop="id" />
        <el-table-column label="游戏名称" prop="game_name" />
        <el-table-column label="版本号" />
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
    }
  }
};
</script>

<style lang="scss" scope>
  .table-data {
    .table-action{
      padding-bottom: 1rem;
    }
  }
</style>
