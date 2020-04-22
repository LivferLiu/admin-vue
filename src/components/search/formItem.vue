<template>
  <div class="form-item">
    <el-input
      v-if="isInput"
      v-model="currentVal"
      v-bind="bindProps"
      size="mini"
      v-on="bindEvents"
    />

    <el-input-number
      v-if="isInputNumber"
      v-model="currentVal"
      v-bind="bindProps"
      :controls-position="itemOptions['controls-position'] || 'right'"
      size="mini"
      v-on="bindEvents"
    />

    <el-select
      v-if="isSelect"
      v-model="currentVal"
      v-bind="bindProps"
      size="mini"
      clearable
      v-on="bindEvents"
    >
      <el-option
        v-for="item in itemOptions.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-date-picker
      v-if="isDatePickerDateRange"
      v-model="currentVal"
      v-bind="bindProps"
      :type="itemOptions.type || 'datetimerange'"
      size="mini"
      clearable
      :picker-options="pickerOptionsRange"
      start-placeholder="开始日期"
      range-separator="至"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']"
      value-format="yyyy-MM-dd HH:mm:ss"
      v-on="bindEvents"
    />

    <el-date-picker
      v-if="isDatePickerMonthRange"
      v-model="currentVal"
      v-bind="bindProps"
      type="monthrange"
      size="mini"
      clearable
      :picker-options="pickerOptionsRangeMonth"
      start-placeholder="开始日期"
      range-separator="至"
      end-placeholder="结束日期"
      value-format="yyyy-MM"
      v-on="bindEvents"
    />

    <el-date-picker
      v-if="isDatePickerOthers"
      v-model="currentVal"
      v-bind="bindProps"
      :type="itemOptions.type"
      size="mini"
      clearable
      placeholder="请选择日期"
      v-on="bindEvents"
    />

    <el-cascader
      v-if="isCascader"
      v-model="currentVal"
      v-bind="bindProps"
      size="mini"
      clearable
      v-on="bindEvents"
    />
  </div>
</template>

<script>
import searchConfig from "./searchTool";

export default {
  name: "SearchFormItem",
  inheritAttrs: false,

  props: {
    value: {
      type: [Object, String, Number, Array],
      default: () => { return ""; }
    },
    itemOptions: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      pickerOptionsRange: searchConfig.pickerOptionsRange, // 日期选择器默认选项
      pickerOptionsRangeMonth: searchConfig.pickerOptionsRangeMonth, // 月份范围默认选项
      formData: {}
    };
  },

  computed: {
    // 双向绑定数据值
    currentVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    // 绑定属性
    bindProps() {
      const obj = { ...this.itemOptions };
      // 移除多余属性
      delete obj.label;
      delete obj.prop;
      delete obj.initValue;
      delete obj.rules;
      delete obj.events;
      if (obj.element === "el-select") {
        delete obj.options;
      }
      delete obj.element;
      return obj;
    },
    // 绑定方法
    bindEvents() {
      return this.itemOptions.events || {};
    },
    // el-input
    isInput() {
      return this.itemOptions.element === "el-input";
    },
    // el-input-number
    isInputNumber() {
      return this.itemOptions.element === "el-input-number";
    },
    // el-select
    isSelect() {
      return this.itemOptions.element === "el-select";
    },
    // el-date-picker (type: datetimerange/daterange)
    isDatePickerDateRange() {
      const isDatePicker = this.itemOptions.element === "el-date-picker";
      const isDateRange =
        !this.itemOptions.type ||
        this.itemOptions.type === "datetimerange" ||
        this.itemOptions.type === "daterange";
      return isDatePicker && isDateRange;
    },
    // el-date-picker (type: monthrange)
    isDatePickerMonthRange() {
      const isDatePicker = this.itemOptions.element === "el-date-picker";
      const isMonthRange = this.itemOptions.type === "monthrange";
      return isDatePicker && isMonthRange;
    },
    isDatePickerOthers() {
      const isDatePicker = this.itemOptions.element === "el-date-picker";
      return (
        isDatePicker &&
          !this.isDatePickerDateRange &&
          !this.isDatePickerMonthRange
      );
    },
    // el-cascader
    isCascader() {
      return this.itemOptions.element === "el-cascader";
    }
  }
};
</script>
