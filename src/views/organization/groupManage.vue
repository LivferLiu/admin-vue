<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-form ref="search" :model="search">
        <el-row>
          <el-col :span="6">
            <el-form-item label="小组:" prop="name">
              <el-input v-model="search.name" style="width:220px" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间:" prop="start_at">
              <el-date-picker v-model="search.start_at" type="date" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束时间" prop="end_at">
              <el-date-picker v-model="search.end_at" type="date" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-search" class="search_margin" @click="submitForm">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>

    <el-row v-loading="loading">
      <el-row>
        <el-col>
          <router-link :to="{name:'CreateGroup'}">
            <el-button type="primary">新增小组</el-button>
          </router-link>
        </el-col>
        <el-col class="group_table">
          <el-table :data="groupData" border>
            <el-table-column prop="id" label="小组ID" />
            <el-table-column prop="name" label="组名" />
            <el-table-column prop="parent_group_name" :formatter="formatParentName" label="上级组" />
            <el-table-column prop="updated_at" label="创建时间" />
            <el-table-column fixed="right" label="操作">
              <template slot-scope="actionButton">
                <router-link :to="{name:'EditGroup',query:{id:actionButton.row.id}}">
                  <el-button>编辑</el-button>
                </router-link>
                <el-button @click="destroy(actionButton.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col>
          <el-pagination
            v-if="!loading"
            class="paination"
            :current-page="currentPage"
            :page-sizes="[15, 20, 30, 40]"
            :limit="limit"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
      <router-view />
    </el-row>

  </div>
</template>

<script>
import { groupIndex, groupDestroy } from "@/api/group";

export default {
  data() {
    return {
      value: "",
      loading: true,
      search: {
        name: "",
        start_at: "",
        end_at: "",
        limit: process.env.VUE_APP_PAGE_LIMIT,
        page: 1
      },
      groupData: [],
      groupId: 0,
      total: 0,
      limit: process.env.VUE_APP_PAGE_LIMIT,
      currentPage: 1
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 列表
    initData() {
      groupIndex(this.search).then(response => {
        this.groupData = response.data;
        this.total = response.total;
        this.limit = parseInt(response.limit);
        this.currentPage = response.current_page;
        this.loading = false;
      });
    },
    // 删除
    destroy(id) {
      this.$confirm("是否删除该小组?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        groupDestroy(id).then(response => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.initData();
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "取消删除"
        });
      });
    },
    // 查询
    submitForm() {
      this.initData();
    },
    // 切换每页显示多少条数据
    handleSizeChange(val) {
      this.search.limit = val;
      this.initData(this.search);
    },
    // 点击页码
    handleCurrentChange(val) {
      this.search.page = val;
      this.initData(this.search);
    },
    // 格式化父级分组名称
    formatParentName(row, column, cellValue, index) {
      if (!cellValue) cellValue = "#";
      return cellValue;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.group_table {
    margin-top: 20px;
}
.search_margin {
    margin-left: 55px;
}
.paination {
  margin-top: 20px;
  float: right;
}
</style>
