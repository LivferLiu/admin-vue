<template>
  <el-select :value="valueTitle" :clearable="clearable" :disabled="props.disabled" @clear="clearHandle">
    <el-input
      v-model="filterText"
      class="selectInput"
      :placeholder="placeholder"
    />

    <el-option :value="valueTitle" :label="valueTitle" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        :render-content="renderContent"
        @node-click="handleNodeClick"
      />
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "ElTreeSelect",
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: "id", // ID字段名
          label: "title", // 显示名称
          children: "children", // 子级字段名
          disabled: false
        };
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => { return []; }
    },
    /* 初始值 */
    value: {
      type: [Number, String],
      default: () => { return null; }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => { return true; }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => { return false; }
    },
    placeholder: {
      type: String,
      default: () => { return "检索关键字"; }
    },
    modelOptions: {
      type: [String, Number],
      default: () => { return "formRef.id"; }
    }
  },
  data() {
    return {
      filterText: "",
      valueId: this.value, // 初始值
      valueTitle: "",
      defaultExpandedKey: [],
      userId: []
    };
  },
  watch: {
    value() {
      this.valueId = this.value;
      this.initHandle();
    },
    filterText(val) {
      this.$refs.selectTree.filter(val);
    }
  },
  mounted() {
    this.initHandle();
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.valueId) {
        const currentNode = this.$refs.selectTree.getNode(this.valueId);
        const nodeData = currentNode.data;
        // 只有第三级可以选择
        if (currentNode.level === 3) {
          this.valueTitle = nodeData[this.props.label]; // 初始化显示
          this.$refs.selectTree.setCurrentKey(this.valueId); // 设置默认选中
        }
        this.defaultExpandedKey = [this.valueId]; // 设置默认展开
      }
      this.initScroll();
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        const scrollWrap = document.querySelectorAll(".el-scrollbar .el-select-dropdown__wrap")[0];
        const scrollBar = document.querySelectorAll(".el-scrollbar .el-scrollbar__bar");
        scrollWrap.style.cssText = "margin: 0px; max-height: none; overflow: hidden;";
        scrollBar.forEach(function(ele) {
          ele.style.width = 0;
        });
      });
    },
    // 切换选项
    handleNodeClick(node) {
      // 只有第三级可以选择
      if (node.level === 3) {
        this.valueTitle = node[this.props.label];
      }
      this.valueId = node[this.props.value];
      this.$emit("getValue", this.valueId);
      this.defaultExpandedKey = [];
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = "";
      this.valueId = null;
      this.defaultExpandedKey = [];
      this.clearSelected();
      this.$emit("getValue", null);
    },
    /* 清空选中样式 */
    clearSelected() {
      const allNode = document.querySelectorAll("#tree-option .el-tree-node");
      allNode.forEach((element) => element.classList.remove("is-current"));
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 选择当前
    clickNode(node) {
      // 当前点击的元素
      const currentEl = this.$refs.selectTree.currentNode.$el;
      // 当前点击的元素中的el-checbox
      const checkBoxEl = currentEl.querySelector(".el-checkbox");
      checkBoxEl.classList.toggle("is-checked");
      // 当前元素 input
      const checkInputEl = currentEl.querySelector(".el-checkbox__input");
      checkInputEl.classList.toggle("is-checked");
      // 只有这2个元素都添加is-checked 才会有样式
      const checkUserId = node.data.id.substr(1);

      if (checkBoxEl.classList.contains("is-checked") && checkInputEl.classList.contains("is-checked")) {
        // 选中增加到userId数组中
        this.userId.push(checkUserId);
        this.$emit("pushValue", this.userId);
      } else {
        // 取消删除被取消的userId
        this.userId.filter((element, index) => {
          if (element === checkUserId) {
            this.userId.splice(index, index + 1);
          }
        });
        this.$emit("pushValue", this.userId);
      }
    },
    renderContent(h, { node, data, store }) {
      if (node.level === 3) {
        return (
          <div>
            <span class='is-leaf el-tree-node__expand-icon el-icon-caret-right'></span>
            <label class='el-checkbox'>
              <span class='el-checkbox__input checkbox-padding'>
                <span class='el-checkbox__inner'></span>
                <input type='checkbox' aria-hidden='false' class='el-checkbox__original' value='' on-click={ () => this.clickNode(node) }/>
              </span>
            </label>
            <span class='custom-tree-node'>{node.label}</span>
          </div>
        );
      } else {
        return (
          <span class='custom-tree-node'>{node.label}</span>);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li >>>.el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree >>>.is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
  .selectInput{
    padding: 0 5px;
    box-sizing: border-box;
  }
  .el-checkbox__inner::after {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    content: "";
    border: 1px solid #FFF;
    border-left: 0;
    border-top: 0;
    height: 7px;
    left: 4px;
    position: absolute;
    top: 1px;
    -webkit-transform: rotate(45deg) scaleY(0);
    transform: rotate(45deg) scaleY(0);
    width: 3px;
    -webkit-transition: -webkit-transform .15s ease-in .05s;
    transition: -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s,-webkit-transform .15s ease-in .05s;
    -webkit-transform-origin: center;
    transform-origin: center;
}
.checkbox-padding {
    margin-right: 1rem;
  }
</style>
