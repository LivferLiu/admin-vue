<template>
  <div class="app-container">
    <el-form ref="ruleForm" label-width="100px" :model="ruleForm" :rules="rules">
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-form-item label="菜单名称-">
              <el-input v-model="ruleForm.name" placeholder="菜单名称" clearable />
            </el-form-item>
            <el-form-item label="菜单图标">
              <el-input v-model="ruleForm.icon" placeholder="菜单图标" />
            </el-form-item>
            <el-form-item label="路由名称" prop="title">
              <el-input v-model="ruleForm.title" placeholder="路由名称" />
            </el-form-item>
            <el-form-item label="路由路径">
              <el-input v-model="ruleForm.path" placeholder="前端路由路径" />
            </el-form-item>
            <el-form-item label="路由隐藏">
              <el-radio-group v-model="ruleForm.hidden">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="开发者菜单">
              <el-radio-group v-model="ruleForm.is_develop">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-form-item label="路由组件">
              <el-input v-model="ruleForm.component" placeholder="前端路由组件" />
            </el-form-item>
            <el-form-item label="路由别名">
              <el-input v-model="ruleForm.api_path" placeholder="Api接口地址" />
            </el-form-item>
            <el-form-item label="菜单排序">
              <el-input v-model="ruleForm.sort" placeholder="菜单排序" />
            </el-form-item>
            <el-form-item label="组件是否缓存">
              <el-radio-group v-model="ruleForm.cached">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="系统菜单">
              <el-radio-group v-model="ruleForm.system">
                <el-radio-button label="1">是</el-radio-button>
                <el-radio-button label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="ruleForm.type" prop="type">
                <el-radio-button label="1">菜单</el-radio-button>
                <el-radio-button label="3">按钮</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-button
            type="primary"
            class="button-large-center"
            :loading="buttonLoading"
            @click="onSubmit"
          >提交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { store, show } from "@/api/permission";

export default {
  props: {
    id: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      buttonLoading: false,
      ruleForm: {
        id: this.id,
        cached: 0, // 缓存按钮
        system: 0,
        hidden: 0,
        is_develop: 0,
        type: 1,
        name: "",
        title: "",
        sort: 255,
        api_path: "",
        component: "",
        path: "",
        icon: ""
      },
      rules: {
        title: [
          { required: true, message: "请填写名称", trigger: blur },
          { max: 64, message: "最大长度64个字符", trigger: blur }
        ],
        type: [
          { required: true, message: "请选择类型", trigger: blur }
        ]
      }
    };
  },
  mounted() {
    this.showMenu();
  },
  methods: {
    showMenu() {
      show(this.id).then(response => {
        this.ruleForm = { ...response.data };
      });
    },
    onSubmit() {
      this.$refs["ruleForm"].validate((valid, fields) => {
        if (valid) {
          this.buttonLoading = true;
          store(this.ruleForm).then((response) => {
            Message("提交成功");
            this.buttonLoading = false;
          }).catch(() => {
            this.buttonLoading = false;
          });
        } else {
          Message("请检查必填项");
          this.buttonLoading = false;
        }
      });
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
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .button-large-center {
    padding: 15px 55px;
    font-size: 17px;
    border-radius: 4px;
    display:block; margin:0 auto
  }
</style>
