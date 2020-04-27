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
      <el-table v-if="!loading" :data="tableData" border>
        <el-table-column prop="package_id" label="包ID" />
        <el-table-column prop="package_name" label="游戏名称" />
        <el-table-column prop="publish.full_name" label="发行商" />
        <el-table-column prop="game_version" label="版本号" />
        <el-table-column prop="status" label="签约状态">
          <template slot-scope="scope">
            {{ scope.row.status | applyDesc }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-if="actionButton.row.status === 3" slot-scope="actionButton">
            <router-link :to="{name:'ApplyName',query:{package_id:actionButton.row.package_id}}">
              <el-button type="primary" size="mini">申请游戏</el-button>
            </router-link>
          </template>
          <template v-else-if="actionButton.row.status === 2" slot-scope="actionButton">
            <router-link :to="{name:'CreateBagLink',query:{package_id:actionButton.row.package_id}}" />
            <el-button type="primary" size="mini">前往打包</el-button>
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
  </div>
</template>

<script>
import searchItem from "@/components/search/search";
import adminPage from "@/components/pagination/adminPagination";
import config from "@/config/config";
import { gameList } from "@/api/game";

export default {
  components: {
    searchItem,
    adminPage
  },
  filters: {
    applyDesc: function(value) {
      if (value === 1) {
        return "申请中";
      } else if (value === 2) {
        return "已接入";
      } else {
        return "未接入";
      }
    }
  },
  data() {
    return {
      formOptions: [
        {
          label: "游戏名称",
          prop: "game_name",
          element: "el-input"
        },
        {
          label: "签约状态",
          prop: "status",
          element: "el-select",
          options: [
            { label: "全部", value: 0 },
            { label: "申请中", value: 1 },
            { label: "已接入", value: 2 },
            { label: "未接入", value: 3 }
          ],
          initValue: 0
        }
      ],
      total: 0,
      limit: parseInt(config.limit),
      currentPage: 1,
      tableData: [],
      loading: true
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData(params = {}) {
      this.loading = true;
      gameList(params).then(response => {
        this.tableData = [...response.data];
        this.total = response.total;
        this.limit = parseInt(response.limit);
        this.currentPage = response.current_page;
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
