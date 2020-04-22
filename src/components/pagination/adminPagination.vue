<template>
  <div>
    <el-col>
      <el-pagination
        class="paination"
        :current-page.sync="currentPage"
        :page-sizes="[15, 20, 30, 40]"
        :limit="limit"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-col>
  </div>
</template>

<script>
export default {
  name: "AdminPagination",
  props: {
    total: {
      required: true,
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      currentPage: 1,
      limit: 15
    };
  },
  watch: {
    currentPage(value) {
      this.currentPage = value;
    },
    limit(value) {
      this.limit = value;
    }
  },
  methods: {
    handleCurrentChange(value) {
      this.$emit("handleCurrentChange", value);
    },
    handleSizeChange(value) {
      this.currentPage = 1;
      this.limit = value;
      // this.$parent.handleSizeChange(value);
      this.$emit("handleSizeChange", value);
    }
  }
};
</script>

<style lang="scss" scoped>
.paination {
  margin-top: 20px;
  float: right;
}
</style>
