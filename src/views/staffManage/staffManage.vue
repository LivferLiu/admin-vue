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
      <section class="table-action">
        <router-link :to="{name:'CreateStaff'}">
          <el-button type="primary">新增</el-button>
        </router-link>
      </section>
      <el-table v-if="!loading" :data="tableData" border>
        <el-table-column prop="admin_id" label="ID" />
        <el-table-column prop="username" label="员工名称" />
        <el-table-column prop="login_name" label="账号" />
        <el-table-column prop="group.name" label="组名" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | statusDesc }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column label="操作">
          <template slot-scope="actionButton">
            <router-link :to="{name:'EditStaff',query:{id:actionButton.row.admin_id}}">
              <el-button type="primary" size="mini">编辑</el-button>
            </router-link>
            <el-button size="mini" :disabled="apiLoading" :type="actionButton.row.status === 1 ? 'danger' : 'primary'" @click="updateStatus(actionButton.row,actionButton.$index)">{{ actionButton.row.status | statusButton }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <adminPagination
        v-if="!loading"
        :total="total"
        :limit="limit"
        :current-page="currentPage"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>

  </div>
</template>

<script>
import searchItem from "@/components/search/search";
import { adminUserIndex, updateStatus } from "@/api/user";
import config from "@/config/config";
import adminPagination from "@/components/pagination/adminPagination";

export default {
  components: {
    searchItem,
    adminPagination
  },
  data() {
    return {
      apiLoading: false,
      loading: true,
      tableData: [],
      formOptions: [
        {
          label: "小组",
          prop: "group_name",
          element: "el-input"
        },
        {
          label: "状态",
          prop: "status",
          initValue: 0,
          element: "el-select",
          options: [
            { label: "全部", value: 0 },
            { label: "启用", value: "1" },
            { label: "禁用", value: "2" }
          ]
        },
        {
          label: "创建时间",
          prop: "timeRange",
          element: "el-date-picker"
        }
      ],
      total: 0,
      limit: parseInt(config.limit),
      currentPage: 1,
      id: 0
    };
  },
  mounted() {
    this.initData();
  },
  created() {
    this.id = this.$route.query.id; // 编辑ID
  },
  methods: {
    initData() {
      const searchData = this.$refs.searchRef.formData;
      const timeRange = searchData.timeRange || [];
      if (timeRange.length > 0) {
        searchData.start_at = timeRange[0] || "";
        searchData.end_at = timeRange[1] || "";
        delete searchData.timeRange;
      }
      // 列表
      adminUserIndex(searchData).then(response => {
        this.tableData = response.data;
        this.total = response.total;
        this.limit = parseInt(response.limit);
        this.currentPage = response.current_page;

        this.loading = false;
      });
    },
    onSearch(val) {
      this.initData();
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
      this.initData(this.$refs.searchRef.formData);
    },
    updateStatus(row, index) {
      this.apiLoading = true;
      updateStatus(row.admin_id).then(() => {
        this.tableData[index]["status"] = row.status === 1 ? 2 : 1;
        this.apiLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
    .table-data {
        margin-top: 15px;
        .table-action {
            margin-bottom: 15px;;
        }
    }
</style>
