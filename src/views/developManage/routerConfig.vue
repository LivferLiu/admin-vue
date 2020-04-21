<template>
  <div class="app-container">
    <el-row>
      <el-col :span="20" />
      <el-col :span="4">
        <router-link :to="{name:'RouterCreate'}">
          <el-button type="primary">新增</el-button>
        </router-link>
      </el-col>
    </el-row>
    <el-row class="row-margin">
      <el-col :span="24">
        <el-table :data="tableData" row-key="id" border :tree-props="{children:'_child',hasChilden: '_child'}">
          <el-table-column
            prop="id"
            label="ID"
            sortable
          />

          <el-table-column
            prop="title"
            label="菜单名称"
            width="180"
          />

          <el-table-column
            prop="name"
            label="路由名称"
            width="180"
          />

          <el-table-column
            prop="path"
            label="前端路由路径"
            width="180"
          />

          <el-table-column
            prop="component"
            label="前端路由组件"
            width="180"
          />

          <el-table-column
            prop="sort"
            label="菜单排序"
            sortable
            width="180"
          />

          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <router-link :to="{name:'RouterEdit',params:{id:scope.row.id}}">
                <el-button
                  size="mini"
                >编辑</el-button></router-link>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { menuList, menuDestroy } from "../../api/permission";
export default {
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      menuList().then(response => {
        this.tableData = response.data;
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除" + row.title + "是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        menuDestroy(row.id).then(response => {
          this.initData();
          this.$message({
            type: "success",
            message: "删除成功"
          });
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .row-margin {
    margin-top: 10px;
  }
</style>

