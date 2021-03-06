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
      type: Number,
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
      defaultExpandedKey: []
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
        const nodeData = this.$refs.selectTree.getNode(this.valueId).data;
        this.valueTitle = nodeData[this.props.label]; // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId); // 设置默认选中
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
      this.valueTitle = node[this.props.label];
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
    append(node, ele) {
      const currentEl = this.$refs.selectTree.currentNode.$el;
      const checkBoxEl = currentEl.querySelectorAll(".el-checkbox");
      checkBoxEl.forEach(element => element.classList.add("is-checked"));
      currentEl.querySelectorAll(".el-checkbox__input").forEach(element => element.classList.add("is-checked"));
      console.log(checkBoxEl);
      console.log(this.$refs.selectTree.currentNode);
    },
    renderContent(h, { node, data, store }) {
      // console.log(node);
      if (node.level === 3) {
        return (
          <div>
            <span class='is-leaf el-tree-node__expand-icon el-icon-caret-right'></span>
            <label class='el-checkbox'>
              <span class='el-checkbox__input checkbox-padding'>
                <span class='el-checkbox__inner'></span>
                <input type='checkbox' aria-hidden='false' class='el-checkbox__original' value='' on-click={ () => this.append(node) }/>
              </span>
            </label>
            <span class='custom-tree-node'>{node.label}~{node.level}</span>
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
