<template>
  <div class="condition" v-show="status">
    <el-cascader
      class="ctrlselect"
      :options="indicatorOption"
      :show-all-levels="false"
      size="mini"
      placeholder="指标名称"
      v-model="indicator"
      @change="selectIndicator"
    ></el-cascader>
    <el-select
      class="select"
      size="mini"
      v-model="operation"
      no-data-text="请先选择指标名称"
      placeholder="运算"
      @change="selectOperation"
    >
      <el-option v-for="item in operationlist" :key="item.key" :label="item.name" :value="item.key"></el-option>
    </el-select>
    <!-- 类型1 大于、小于、介于、不介于 数值-->
    <el-input-number
      class="numberinput"
      v-model="indicatornum"
      size="mini"
      :precision="2"
      :min="0"
      :step="0.1"
      v-show="indicatortype == 1"
    ></el-input-number>
    <!-- <span class="unit" v-if="specilkey100.indexOf(conditionSelkey) != -1">%</span> -->
    <el-input-number
      class="numberinput"
      v-model="indicatornumend"
      v-show="indicatortype == 1 && (operation == 3 || operation == 4)"
      size="mini"
      :precision="2"
      :min="0"
      :step="0.1"
    ></el-input-number>
    <!-- 类型2 包含、不包含 字符 -->
    <el-input
      class="select"
      size="mini"
      v-show="indicatortype == 2"
      v-model="indicatordata"
      placeholder
    ></el-input>
    <!-- 类型3 枚举 多选 -->
    <el-select
      class="selectcontent"
      size="mini"
      v-model="indicatorselect"
      collapse-tags
      multiple
      placeholder
      v-show="indicatortype == 3"
    >
      <el-option
        v-for="item in indicatorselectlist"
        :key="item.key"
        :label="item.name"
        :value="item.key"
      ></el-option>
    </el-select>
    <!-- 类型4 大于、小于、介于、不介于 时间点 多选 -->
    <el-date-picker
      v-model="indicatortime"
      v-show="indicatortype == 4 && (operation == 1 || operation == 2)"
      size="mini"
      class="timeselect"
      type="datetime"
      :clearable="false"
      placeholder="选择日期时间"
    ></el-date-picker>
    <el-date-picker
      v-model="indicatortimerange"
      type="datetimerange"
      class="timerange"
      v-show="indicatortype == 4 && (operation == 3 || operation == 4)"
      range-separator="至"
      size="mini"
      :clearable="false"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
    <el-button type="success" icon="el-icon-check" circle size="mini" @click="determineSearch"></el-button>
    <el-button type="danger" icon="el-icon-close" circle size="mini" @click="cancelSearch"></el-button>
  </div>
</template>

<script>
export default {
  props: ["status"],
  data() {
    return {
      indicator: [],
      indicatortype: "",
      indicatorval: "",
      operation: "",
      operationlist: [], // 运算方式列表

      indicatornum: 0,
      indicatornumend: 0,
      indicatordata: "",
      indicatortime: "",
      indicatortimerange: [],
      indicatorselect: [],
      indicatorselectlist: [], // 枚举列表

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
            { label: "版位", value: "bw_3" },
            { label: "总预算", value: "4_1" },
            { label: "单日预算", value: "5_1" },
            { label: "竞价金额", value: "6_1" },
            { label: "付费事件", value: "ffsj_3" },
            { label: "优化目标", value: "yhmb_3" }
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
    selectIndicator() {
      let condition = this.indicator[1].split("_");
      this.indicatortype = condition[1];
      this.indicatorval = condition[0];
      let selectOption = {
        bw: [
          { name: "Facebook动态（桌面版）", key: "1" },
          { name: "Facebook动态（移动版）", key: "2" },
          { name: "Facebook右边栏", key: "3" },
          { name: "Instagram动态", key: "4" },
          { name: "Instagram快拍", key: "5" },
          { name: "Audience Network", key: "6" },
          { name: "Messenger收件箱", key: "7" },
          { name: "Facebook Marketplace", key: "8" }
        ],
        ffsj: [
          { name: "展示次数", key: "1" },
          { name: "应用安装", key: "2" },
          { name: "点击", key: "3" },
          { name: "链接点击量（单次点击费用）", key: "4" },
          { name: "领取优惠", key: "5" },
          { name: "主页赞", key: "6" },
          { name: "帖文互动", key: "7" },
          { name: "观看视频达10秒的次数", key: "8" }
        ],
        yhmb: [
          { name: "应用安装量", key: "1" },
          { name: "品牌知名度", key: "2" },
          { name: "广告点击量", key: "3" },
          { name: "互动用户", key: "4" },
          { name: "FBX使用率", key: "5" },
          { name: "活动响应", key: "6" },
          { name: "展示次数", key: "7" },
          { name: "开发潜在客户", key: "8" },
          { name: "链接点击量", key: "9" },
          { name: "优惠领取", key: "10" },
          { name: "转化量", key: "11" },
          { name: "主页互动", key: "12" },
          { name: "主页赞", key: "13" },
          { name: "帖文互动", key: "14" },
          { name: "单日独立覆盖人数", key: "15" },
          { name: "回复次数", key: "16" },
          { name: "社交展示次数", key: "17" },
          { name: "观看视频达10秒的次数", key: "18" }
        ]
      };

      switch (this.indicatortype) {
        case "1":
          this.operationlist = [
            { name: "大于", key: "1" },
            { name: "小于", key: "2" },
            { name: "介于", key: "3" },
            { name: "不介于", key: "4" }
          ];
          break;
        case "2":
          this.operationlist = [
            { name: "包含", key: "1" },
            { name: "不包含", key: "2" }
          ];
          break;
        case "3":
          if (this.indicatorval == "bw") {
            this.operationlist = [
              { name: "包含任意", key: "1" },
              { name: "包含所有", key: "2" },
              { name: "不包含", key: "3" }
            ];
          } else {
            this.operationlist = [
              { name: "是", key: "1" },
              { name: "不是", key: "2" }
            ];
          }
          this.indicatorselectlist = selectOption[this.indicatorval];
          break;
        case "4":
          this.operationlist = [
            { name: "大于", key: "1" },
            { name: "小于", key: "2" },
            { name: "介于", key: "3" },
            { name: "不介于", key: "4" }
          ];
          break;
      }
      this.operation = "1";
      this.indicatorselect = [];
    },
    determineSearch() {
      console.log(this.indicator);
      console.log(this.operation);
    },
    cancelSearch() {
      this.$emit("update:status", false);
    },
    selectOperation() {}
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
  display: inline-block;
  .ctrlselect {
    width: 140px;
    margin-right: 10px;
  }
  .select {
    width: 100px;
    margin-right: 10px;
  }
  .selectcontent {
    width: 260px;
    margin-right: 10px;
  }
  .numberinput {
    margin-right: 10px;
  }
  .timeselect {
    margin-right: 10px;
    width: 180px;
  }
  .timerange {
    margin-right: 10px;
    width: 320px;
  }
}
</style>
