<template>
  <div class="app-container">
    <search-item
      ref="searchRef"
      :form-options="formOptions"
      :limit="limit"
      :page="currentPage"
      @onSearch="onSearch"
    />
    <el-table :data="tableData" border>
      <el-table-column label="区服ID" prop="id" />
      <el-table-column label="区服名称" prop="zone_name" />
      <el-table-column label="所属游戏" prop="game_name" />
      <el-table-column label="开服时间" prop="zone_start" />
      <el-table-column label="描述" prop="zone_desc" />
      <el-table-column label="状态" prop="zone_status">
        <template slot-scope="scope">
          {{ scope.row.status | statusDesc }}
        </template>
      </el-table-column>
    </el-table>
    <admin-page
      v-if="!loading"
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
import { zoneList } from "@/api/game";
import config from "@/config/config";

export default {
  components: {
    searchItem,
    adminPage
  },
  data() {
    return {
      tableData: [],
      loading: false,
      limit: parseInt(config.limit),
      total: 0,
      currentPage: 1,
      formOptions: [
        {
          label: "游戏名称",
          prop: "game_name",
          element: "el-input"
        },
        {
          label: "开服时间",
          prop: "timeRange",
          element: "el-date-picker"
        }
      ]
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData(params = {}) {
      this.loading = true;
      const timeRange = params.timeRange || [];
      // 重置时间搜索
      params.start_at = "";
      params.end_at = "";
      if (timeRange.length > 0) {
        params.start_at = timeRange[0] || "";
        params.end_at = timeRange[1] || "";
        delete params.timeRange;
      }

      zoneList(params).then(response => {
        this.total = response.total;
        this.limit = parseInt(response.limit);
        this.tableData = [...response.data];
        this.loading = false;
      });
    },
    onSearch(params) {
      this.initData(params);
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
      this.initData(this.$refs.searchRef.getSearchParams());
    }
  }

};
</script>
