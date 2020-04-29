<template>
  <div class="app-container">
    <el-form ref="formRef" :model="createForm" label-width="80px">
      <el-form-item
        label="游戏名称"
        prop="package_id"
        :rules="[{ required: true, message: '请选择游戏', trigger: 'blur' }]"
      >
        <el-select v-model="createForm.package_id" placeholder="选择游戏">
          <el-option v-for="item in gameOptions" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="包链所属" prop="admin_id">
        <select-tree
          :props="props"
          :options="treeData"
          :value="valueId"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"
          @pushValue="pushValue($event)"
        />
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import selectTree from "@/components/SelectTree/selectTreeMembers";
import { treeDataWithMembers } from "@/api/group";

export default {
  components: {
    selectTree
  },
  data() {
    return {
      createForm: {
        package_id: null,
        admin_id: []
      },
      treeData: [],
      gameOptions: [],
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 0,
      groupId: 0,
      props: {
        // 配置项（必选）
        value: "id",
        label: "name",
        children: "child",
        disabled: false
      }
    };
  },
  computed: {
    showTreeData() {
      return this.treeData;
    }
  },
  created() {
    this.treeDataWithMembers();
  },
  methods: {
    // 取值
    getValue(value) {
      this.valueId = value;
    },
    // 选择的组员ID
    pushValue(value) {
      this.createForm.admin_id = value;
      console.log(this.createForm.admin_id, "admin_id");
    },
    treeDataWithMembers() {
      treeDataWithMembers().then(response => {
        // this.treeData = response.data;
        const arrData = response.data;
        const arrLength = arrData.length;
        // 暂时通过循环树结构 将组员的id增加标识符来避免id重复
        for (let index = 0; index < arrLength; index++) {
          console.log(arrData[index]);
          if (arrData[index]["child"] && arrData[index]["child"].length > 0) {
            const secondChild = arrData[index]["child"];
            for (let i = 0, secondLength = secondChild.length; i < secondLength; i++) {
              if (secondChild[i]["child"] && secondChild[i]["child"].length > 0) {
                const members = secondChild[i]["child"];
                for (let j = 0, memberLength = members.length; j < memberLength; j++) {
                  arrData[index]["child"][i]["child"][j]["id"] = "u" + members[j]["id"];
                }
              }
            }
          }
        }
        this.treeData = arrData;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .el-input {
    width: 300px;
  }
}
</style>
