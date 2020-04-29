<template>
  <div class="app-container">
    <el-form ref="createStaffRef" v-loading="loading" :rules="createRules" :model="createStaff" label-width="80px">
      <el-form-item label="员工名称" prop="username">
        <el-input v-model="createStaff.username" :disabled="inputisDisabled" />
      </el-form-item>

      <el-form-item label="角色" prop="role_id">
        <el-radio v-model="createStaff.role_id" label="2" :disabled="inputisDisabled">组长</el-radio>
        <el-radio v-model="createStaff.role_id" label="3" :disabled="inputisDisabled">组员</el-radio>
      </el-form-item>

      <el-form-item label="所属小组" prop="group_id">
        <select-tree
          :props="props"
          :options="treeData"
          :value="valueId"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"
        />
      </el-form-item>

      <el-form-item label="登录账号" prop="login_name">
        <el-input v-model="createStaff.login_name" :disabled="inputisDisabled" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="createStaff.mobile" :disabled="inputisDisabled" />
      </el-form-item>
      <el-form-item
        label="登录密码"
        prop="password"
        :rules="id > 0 ? [{required:false,triiger: 'blur'}] : [{required: true, message: '请填写密码', trigger: 'blur' }]"
      >
        <el-input v-model="createStaff.password" show-password />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="buttonLoading" @click="submitForm">保存</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import selectTree from "@/components/SelectTree/selectTree";
import { treeData } from "@/api/group";
import { createStaff, staffShow, updateStaff } from "@/api/user";

export default {
  components: {
    selectTree
  },
  data() {
    return {
      id: 0,
      loading: false,
      treeData: [],
      buttonLoading: false,
      createRules: {
        username: [
          { required: true, message: "请填写员工名称", trigger: "blur" }
        ],
        role_id: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ],
        login_name: [
          { required: true, message: "请填写登录账号", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请填写密码", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请填写手机号", trigger: "blur" }
        ]
      },
      createStaff: {
        username: "",
        role_id: "3",
        mobile: null,
        group_id: null,
        login_name: null,
        password: null
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 0,
      groupId: 0,
      props: {
        // 配置项（必选）
        value: "id",
        label: "name",
        children: "child",
        disabled: this.inputisDisabled
      }
    };
  },
  computed: {
    showTreeData() {
      return this.treeData;
    },
    showStaffInfo() {
      return this.createStaff;
    },
    inputisDisabled() {
      return this.id > 0;
    }
  },
  watch: {
    showTreeData(value) {
      if (value && this.createStaff.group_id > 0) {
        this.$nextTick(() => {
          this.valueId = this.createStaff.group_id;
        });
      }
    },
    showStaffInfo(value) {
      if (value && this.treeData.length > 0) {
        this.$nextTick(() => {
          this.valueId = this.createStaff.group_id;
        });
      }
    }
  },
  created() {
    this.groupTreeData();
    this.id = this.$route.query.id;
    if (this.id) {
      this.adminUserShow();
    }
  },
  methods: {
    // 获取树
    groupTreeData() {
      treeData().then(response => {
        this.treeData = response.data;
        this.loading = false;
      });
    },
    // 子组件获取选择框被选择的id
    getValue(value) {
      this.valueId = value;
    },
    // 获取数据
    adminUserShow() {
      staffShow(this.id).then((response) => {
        this.createStaff = { ...response.data };
        this.createStaff.role_id = String(this.createStaff.role_id);
      });
    },
    // 提交数据
    submitForm() {
      this.$refs.createStaffRef.validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          this.createStaff.group_id = this.valueId;
          // 编辑
          if (this.id) {
            updateStaff(this.createStaff).then(response => {
              this.$message({
                type: "success",
                message: "提交成功",
                onClose: () => {
                  this.$router.go(-1);
                }
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            // 新增
            createStaff(this.createStaff).then(response => {
              this.$message({
                type: "success",
                message: "提交成功",
                onClose: () => {
                  this.$router.go(-1);
                }
              });
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        } else {
          this.buttonLoading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 300px
}

</style>
