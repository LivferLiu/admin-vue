<template>
  <div class="search-form-box">
    <el-form ref="formRef" :model="formData" :inline="true">
      <el-form-item
        v-for="(item, index) in formOptions"
        :key="newKeys[index]"
        :prop="item.prop"
        :rules="item.rules"
        :label="item.label ? (item.label + '：') : ''"
      >
        <form-item v-model="formData[item.prop]" :item-options="item" />
      </el-form-item>
    </el-form>
    <!-- 提交按钮 -->
    <div class="btn-box">
      <el-button
        v-if="btnItems.includes('search')"
        size="mini"
        type="primary"
        class="btn-search"
        @click="onSearch"
      >搜索</el-button>

      <el-button
        v-if="btnItems.includes('export')"
        size="mini"
        type="primary"
        class="btn-export"
        @click="onExport"
      >导出</el-button>

      <el-button
        v-if="btnItems.includes('reset')"
        size="mini"
        type="default"
        class="btn-reset"
        @click="onReset"
      >重置</el-button>
    </div>
  </div>
</template>

<script>
import formItem from "@/components/search/formItem";
import searchConfig from "@/components/search/searchTool";

export default {
  components: {
    formItem
  },
  props: {
    /**
     * 表单配置
     * 示例：
     * [{
     * label: '用户名', // label文字
     * prop: 'username', // 字段名
     * element: 'el-input', // 指定elementui组件
     * initValue: '阿黄', // 字段初始值
     * placeholder: '请输入用户名', // elementui组件属性
     * rules: [{ required: true, message: '必填项', trigger: 'blur' }], // elementui组件属性
     * events: { // elementui组件方法
     *  input (val) {
     *  console.log(val)
     *  },
     *  ...... // 可添加任意elementui组件支持的方法
     * }
     * ...... // 可添加任意elementui组件支持的属性
     * }]
     */
    formOptions: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    btnItems: {
      type: String,
      default() {
        return "search";
      }
    },
    limit: {
      type: Number,
      default: () => { return 15; }
    },
    page: {
      type: Number,
      default: () => { return 1; }
    }
  },
  data() {
    return {
      formData: {}
    };
  },
  computed: {
    newKeys() {
      return this.formOptions.map(v => {
        return searchConfig.createUniqueString();
      });
    }

  },
  watch: {
    limit(value) {
      this.formData.limit = value;
    },
    page(value) {
      this.formData.page = value;
    }
  },
  created() {
    this.addInitValue();
  },
  methods: {
    onValidate(callback) {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          callback();
        }
      });
    },
    onSearch() {
      this.onValidate(() => {
        this.page = 1;
        this.$emit("onSearch", this.formData);
      });
    },
    onReset() {
      this.$refs.formRef.resetFields();
    },
    addInitValue() {
      const obj = {};
      this.formOptions.forEach(v => {
        if (v.initValue !== undefined) {
          obj[v.prop] = v.initValue;
        }
      });
      this.formData = obj;
      this.formData.limit = this.limit;
      this.formData.page = this.page;
      console.log(this.formData);
    },
    getSearchParams() {
      return this.formData;
    }
  }
};
</script>

<style lang="scss" scoped>
.search-form-box {
  display: flex;
  margin-bottom: 15px;
}
.btn-box {
  padding-top: 5px;
  display: flex;
  button {
    height: 28px;
  }
}
.el-form {
  /deep/ .el-form-item__label {
    padding-right: 0;
  }
  .el-form-item {
    margin-bottom: 0;

    &.is-error {
      margin-bottom: 22px;
    }
  }
  // el-input宽度
  /deep/ .form-item {
    > .el-input:not(.el-date-editor) {
      width: 120px;
    }
  }
  /deep/ .el-select {
    width: 120px;
  }
  /deep/ .el-cascader {
    width: 200px;
  }
}
</style>
