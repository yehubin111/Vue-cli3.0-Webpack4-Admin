<template>
  <div class="condition">
    <el-cascader
      class="ctrlselect"
      :options="indicatorOption"
      :show-all-levels="false"
      size="mini"
      v-model="indicator"
      @change="selectIndicator"
    ></el-cascader>
    <el-select
      class="select"
      size="mini"
      v-model="operation"
      placeholder="运算"
      @change="selectOperation"
    >
      <el-option :label="111" :value="222"></el-option>
    </el-select>
    <!-- 类型1 大于、小于、介于、不介于 数值-->
    <!-- 类型2 包含、不包含 字符 -->
    <el-input class="select" size="mini" v-show="indicatortype == '1' || indicatortype == '2'" v-model="indicatornum" placeholder></el-input>
    <!-- 类型3 枚举 多选 -->
    <el-select
      class="select"
      size="mini"
      v-model="indicatorselect"
      multiple
      placeholder=""
    >
      <el-option :label="111" :value="222"></el-option>
    </el-select>
    <!-- 类型4 大于、小于、介于、不介于 时间点 多选 -->
    <el-button type="success" icon="el-icon-check" circle size="mini" @click="determineSearch"></el-button>
    <el-button type="danger" icon="el-icon-close" circle size="mini" @click="cancelSearch"></el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      operation: "",
      indicator: "",
      indicatornum: "",
      indicatorselect: [],
      indicatortype: '',

      indicatorOption: [
        {
          label: "最常见",
          value: "zcj",
          children: [
            { label: "已花费", value: "1_1" },
            { label: "总花费", value: "2_1" },
            { label: "频次", value: "3_1" },
            { label: "成效", value: "4_1" },
            { label: "单次成效费用", value: "5_1" },
            { label: "移动应用安装", value: "6_1" },
            { label: "单次移动应用安装费用", value: "7_1" },
            { label: "广告花费回报（ROAS）-移动应用购物", value: "8_1" },
            { label: "广告花费回报（ROAS）-网站购物", value: "9_1" },
            { label: "单日花费比率", value: "10_1" },
            { label: "总花费比率", value: "11_1" },
            { label: "受众覆盖%", value: "12_1" }
          ]
        },
        {
          label: "设置",
          value: "sz",
          children: [
            { label: "广告系列名称", value: "1_2" },
            { label: "广告组名称", value: "2_2" },
            { label: "版位", value: "3_3" },
            { label: "总预算", value: "4_1" },
            { label: "单日预算", value: "5_1" },
            { label: "竞价金额", value: "6_1" },
            { label: "付费事件", value: "7_3" },
            { label: "优化目标", value: "8_3" }
          ]
        },
        {
          label: "时间",
          value: "sj",
          children: [
            { label: "创建时间（小时）", value: "1_1" },
            { label: "投放时间（秒）", value: "2_1" },
            { label: "当前时间", value: "3_4" },
            { label: "创建时间", value: "4_4" },
            { label: "上次编辑时间", value: "5_4" },
            { label: "开始时间", value: "6_4" }
          ]
        },
        {
          label: "移动应用事件",
          value: "ydyysj",
          children: [
            { label: "所有移动应用事件", value: "1_1" },
            { label: "移动应用解锁成就", value: "2_1" },
            { label: "移动应用会话", value: "3_1" },
            { label: "移动应用添加支付信息", value: "4_1" },
            { label: "移动应用加入购物车", value: "5_1" },
            { label: "移动应用加入心愿单", value: "6_1" },
            { label: "移动应用完成注册", value: "7_1" },
            { label: "移动应用内容查看", value: "8_1" },
            { label: "移动应用发起结账", value: "9_1" },
            { label: "移动应用关卡完成", value: "10_1" },
            { label: "移动应用购物", value: "11_1" },
            { label: "移动应用提交评分", value: "12_1" },
            { label: "移动应用搜索", value: "13_1" },
            { label: "移动应用点数花费", value: "14_1" },
            { label: "移动应用完成教程", value: "15_1" },
            { label: "移动应用其他操作", value: "16_1" }
          ]
        },
        {
          label: "单次移动应用事件费用",
          value: "dcydyysjfy",
          children: [
            { label: "单次移动应用成就解锁费用", value: "1_1" },
            { label: "单次移动应用会话费用", value: "2_1" },
            { label: "单次移动应用添加支付信息费用", value: "3_1" },
            { label: "单次移动应用加入购物车费用", value: "4_1" },
            { label: "单次移动应用加入心愿单费用", value: "5_1" },
            { label: "单次移动应用完成注册费用", value: "6_1" },
            { label: "单次移动应用内容查看费用", value: "7_1" },
            { label: "单次移动应用发起结账费用", value: "8_1" },
            { label: "单次移动应用关卡完成费用", value: "9_1" },
            { label: "单次移动应用购物费用", value: "10_1" },
            { label: "单次移动应用提交评分费用", value: "11_1" },
            { label: "单次移动应用搜索费用", value: "12_1" },
            { label: "单次移动应用点数花费的广告费用", value: "13_1" },
            { label: "单次移动应用完成教程学习费用", value: "14_1" }
          ]
        },
        {
          label: "其他",
          value: "qt",
          children: [
            { label: "其他点击费用（链接）", value: "1_1" },
            { label: "链接点击量", value: "2_1" },
            { label: "千次发展费用", value: "3_1" },
            { label: "点击率（链接）", value: "4_1" },
            { label: "总展示量", value: "5_1" },
            { label: "展示次数", value: "6_1" },
            { label: "覆盖人数", value: "7_1" },
            { label: "潜在客户", value: "8_1" },
            { label: "操作", value: "9_1" },
            { label: "点击量", value: "10_1" },
            { label: "CPA", value: "11_1" },
            { label: "CPC", value: "12_1" },
            { label: "每点成本", value: "13_1" },
            { label: "点击率", value: "14_1" },
            { label: "成效率", value: "15_1" },
            { label: "社交点击量", value: "16_1" },
            { label: "社交展示次数", value: "17_1" },
            { label: "单次独立点击费用", value: "18_1" },
            { label: "独立用户点击量", value: "19_1" },
            { label: "独立用户社交点击量", value: "20_1" },
            { label: "独立用户社交展示次数", value: "21_1" },
            { label: "今日花费", value: "22_1" },
            { label: "昨日花费", value: "23_1" },
            { label: "帖文互动", value: "24_1" },
            { label: "单次帖文互动", value: "25_1" },
            { label: "观看视频达3秒的次数", value: "26_1" },
            { label: "单次视频观看费用", value: "27_1" },
            { label: "主页赞", value: "28_1" },
            { label: "站外互动", value: "29_1" },
            { label: "帖子", value: "30_1" },
            { label: "帖子评论", value: "31_1" },
            { label: "帖子获赞", value: "32_1" },
            { label: "帖子心情", value: "33_1" },
            { label: "内容查看", value: "34_1" },
            { label: "点击播放视频", value: "35_1" },
            { label: "提问回答", value: "36_1" },
            { label: "新增消息联系人数量", value: "37_1" },
            { label: "单次新增消息联系人费用", value: "38_1" },
            { label: "消息回复次数", value: "39_1" },
            { label: "单次消息回复费用", value: "40_1" },
            { label: "预估预算花费%", value: "41_1" }
          ]
        }
      ]
    };
  },
  methods: {
    selectIndicator() {},
    determineSearch() {},
    cancelSearch() {}
  }
};
</script>

<style lang="less" scoped>
.condition {
  height: 40px;
  border: 1px solid #e5e5e5;
  padding: 0 10px 0 10px;
  border-radius: 4px;
  background-color: #f5f5f5;
  margin-bottom: 10px;
  .ctrlselect {
    width: 150px;
    margin-right: 10px;
  }
  .select {
    width: 100px;
    margin-right: 10px;
  }
}
</style>
