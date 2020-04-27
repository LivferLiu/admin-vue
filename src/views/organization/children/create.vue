<template>
  <div class="app-container">
    <el-form
      v-if="!loading"
      ref="createGroup"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      :model="createGroup"
      label-width="80px"
    >
      <el-form-item
        label="小组名称"
        prop="name"
        :rules="[{ required: true, message: '小组不能为空' }]"
      >
        <el-input v-model="createGroup.name" />
      </el-form-item>
      <el-form-item label="上级小组">
        <select-tree
          :props="props"
          :options="treeData"
          :value="valueId"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { treeData, groupStore, groupShow, groupUpdate } from "@/api/group";
import selectTree from "@/components/SelectTree/selectTree";

export default {
  components: {
    selectTree
  },
  data() {
    return {
      loading: true,
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 0, // 初始ID（可选）
      props: {
        // 配置项（必选）
        value: "id",
        label: "name",
        children: "child"
        // disabled:true
      },
      createGroup: {
        id: 0,
        name: "",
        pid: 0
      },
      treeData: [],
      groupId: 0
    };
  },
  computed: {
    groupAndTree() {
      const { treeData, createGroup } = this;
      return {
        treeData,
        createGroup
      };
    }
  },
  watch: {
    groupAndTree(value) {
      if (value.treeData.length > 0 && value.createGroup.id > 0) {
        this.$nextTick(() => {
          this.valueId = value.createGroup.pid;
        });
      }
    }
  },
  created() {
    this.groupTreeData();
    this.groupId = this.$route.query.id;
    if (this.groupId) this.groupShow(this.groupId);
  },
  methods: {
    // 取值
    getValue(value) {
      this.valueId = value;
    },
    // 获取树
    groupTreeData() {
      treeData().then(response => {
        this.treeData = response.data;
        this.loading = false;
      });
    },
    // 保存
    submitForm() {
      this.createGroup.pid = this.valueId;
      if (this.createGroup.id > 0) {
        groupUpdate(this.createGroup).then(() => {
          this.$message({
            type: "success",
            message: "修改成功",
            onClose: () => {
              this.$router.go(-1);
            }
          });
        });
      } else {
        groupStore(this.createGroup).then(() => {
          this.$message({
            type: "success",
            message: "添加成功",
            onClose: () => {
              this.$router.go(-1);
            }
          });
        });
      }
    },
    // 获取小组详情
    groupShow() {
      groupShow(this.groupId).then(response => {
        this.createGroup = { ...response.data };
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 300px;
}
</style>
