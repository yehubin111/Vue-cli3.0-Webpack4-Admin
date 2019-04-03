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
import { Msgwarning } from "../../js/message";

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

      ifedit: false, // 是否为编辑状态

      indicatorOption: [
        {
          label: "最常见",
          value: "zcj",
          children: [
            { label: "已花费", value: "spent|1|已花费|true" }, // key | 操作类型 | name | 是否支持实时排期
            { label: "总花费", value: "lifetime_spent|1|总花费|false" },
            { label: "频次", value: "frequency|1|频次|true" },
            { label: "成效", value: "result|1|成效|true" },
            { label: "单次成效费用", value: "cost_per|1|单次成效费用|true" },
            {
              label: "移动应用安装",
              value: "mobile_app_install|1|移动应用安装|true"
            },
            {
              label: "单次移动应用安装费用",
              value: "cost_per_mobile_app_install|1|单次移动应用安装费用|true"
            },
            {
              label: "广告花费回报（ROAS）-移动应用购物",
              value:
                "mobile_app_purchase_roas|1|广告花费回报（ROAS）-移动应用购物|false"
            },
            {
              label: "广告花费回报（ROAS）-网站购物",
              value:
                "website_purchase_roas|1|广告花费回报（ROAS）-网站购物|false"
            },
            {
              label: "单日花费比率",
              value: "daily_ratio_spent|1|单日花费比率|true"
            },
            {
              label: "总花费比率",
              value: "lifetime_ratio_spent|1|总花费比率|true"
            },
            {
              label: "受众覆盖%",
              value: "audience_reached_percentage|1|受众覆盖%|true"
            }
          ]
        },
        {
          label: "设置",
          value: "sz",
          children: [
            {
              label: "广告系列名称",
              value: "campaign.name|2|广告系列名称|true"
            },
            { label: "广告组名称", value: "adset.name|2|广告组名称|true" },
            { label: "版位", value: "adset.placement.page_types|3|版位|true" },
            { label: "总预算", value: "lifetime_budget|1|总预算|true" },
            { label: "单日预算", value: "daily_budget|1|单日预算|true" },
            { label: "竞价金额", value: "bid_amount|1|竞价金额|true" },
            { label: "付费事件", value: "billing_event|3|付费事件|true" },
            { label: "优化目标", value: "optimization_goal|3|优化目标|true" }
          ]
        },
        {
          label: "时间",
          value: "sj",
          children: [
            {
              label: "创建时间（小时）",
              value: "hours_since_creation|1|创建时间（小时）|true"
            },
            {
              label: "投放时间（秒）",
              value: "active_time|1|投放时间（秒）|true"
            },
            { label: "当前时间", value: "current_time|4|当前时间|true" },
            { label: "创建时间", value: "created_time|4|创建时间|true" },
            {
              label: "上次编辑时间",
              value: "updated_time|4|上次编辑时间|true"
            },
            { label: "开始时间", value: "start_time|4|开始时间|true" }
          ]
        },
        {
          label: "移动应用事件",
          value: "ydyysj",
          children: [
            {
              label: "所有移动应用事件",
              value: "app_custom_event|1|所有移动应用事件|true"
            },
            {
              label: "移动应用解锁成就",
              value:
                "app_custom_event.fb_mobile_achievement_unlocked|1|移动应用解锁成就|true"
            },
            {
              label: "移动应用会话",
              value:
                "app_custom_event.fb_mobile_activate_app|1|移动应用会话|true"
            },
            {
              label: "移动应用添加支付信息",
              value:
                "app_custom_event.fb_mobile_add_payment_info|1|移动应用添加支付信息|true"
            },
            {
              label: "移动应用加入购物车",
              value:
                "app_custom_event.fb_mobile_add_to_cart|1|移动应用加入购物车|true"
            },
            {
              label: "移动应用加入心愿单",
              value:
                "app_custom_event.fb_mobile_add_to_wishlist|1|移动应用加入心愿单|true"
            },
            {
              label: "移动应用完成注册",
              value:
                "app_custom_event.fb_mobile_complete_registration|1|移动应用完成注册|true"
            },
            {
              label: "移动应用内容查看",
              value:
                "app_custom_event.fb_mobile_content_view|1|移动应用内容查看|true"
            },
            {
              label: "移动应用发起结账",
              value:
                "app_custom_event.fb_mobile_initiated_checkout|1|移动应用发起结账|true"
            },
            {
              label: "移动应用关卡完成",
              value:
                "app_custom_event.fb_mobile_level_achieved|1|移动应用关卡完成|true"
            },
            {
              label: "移动应用购物",
              value: "app_custom_event.fb_mobile_purchase|1|移动应用购物|true"
            },
            {
              label: "移动应用提交评分",
              value: "app_custom_event.fb_mobile_rate|1|移动应用提交评分|true"
            },
            {
              label: "移动应用搜索",
              value: "app_custom_event.fb_mobile_search|1|移动应用搜索|true"
            },
            {
              label: "移动应用点数花费",
              value:
                "app_custom_event.fb_mobile_spent_credits|1|移动应用点数花费|true"
            },
            {
              label: "移动应用完成教程",
              value:
                "app_custom_event.fb_mobile_tutorial_completion|1|移动应用完成教程|true"
            },
            {
              label: "移动应用其他操作",
              value: "app_custom_event.other|1|移动应用其他操作|true"
            }
          ]
        },
        {
          label: "单次移动应用事件费用",
          value: "dcydyysjfy",
          children: [
            {
              label: "单次移动应用成就解锁费用",
              value:
                "cost_per_mobile_achievement_unlocked|1|单次移动应用成就解锁费用|true"
            },
            {
              label: "单次移动应用会话费用",
              value: "cost_per_mobile_activate_app|1|单次移动应用会话费用|true"
            },
            {
              label: "单次移动应用添加支付信息费用",
              value:
                "cost_per_mobile_add_payment_info|1|单次移动应用添加支付信息费用|true"
            },
            {
              label: "单次移动应用加入购物车费用",
              value:
                "cost_per_mobile_add_to_cart|1|单次移动应用加入购物车费用|true"
            },
            {
              label: "单次移动应用加入心愿单费用",
              value:
                "cost_per_mobile_add_to_wishlist|1|单次移动应用加入心愿单费用|true"
            },
            {
              label: "单次移动应用完成注册费用",
              value:
                "cost_per_mobile_complete_registration|1|单次移动应用完成注册费用|true"
            },
            {
              label: "单次移动应用内容查看费用",
              value:
                "cost_per_mobile_content_view|1|单次移动应用内容查看费用|true"
            },
            {
              label: "单次移动应用发起结账费用",
              value:
                "cost_per_mobile_initiated_checkout|1|单次移动应用发起结账费用|true"
            },
            {
              label: "单次移动应用关卡完成费用",
              value:
                "cost_per_mobile_level_achieved|1|单次移动应用关卡完成费用|true"
            },
            {
              label: "单次移动应用购物费用",
              value: "cost_per_mobile_purchase|1|单次移动应用购物费用|true"
            },
            {
              label: "单次移动应用提交评分费用",
              value: "cost_per_mobile_rate|1|单次移动应用提交评分费用|true"
            },
            {
              label: "单次移动应用搜索费用",
              value: "cost_per_mobile_search|1|单次移动应用搜索费用|true"
            },
            {
              label: "单次移动应用点数花费的广告费用",
              value:
                "cost_per_mobile_spent_credits|1|单次移动应用点数花费的广告费用|true"
            },
            {
              label: "单次移动应用完成教程学习费用",
              value:
                "cost_per_mobile_tutorial_completion|1|单次移动应用完成教程学习费用|true"
            }
          ]
        },
        {
          label: "其他",
          value: "qt",
          children: [
            {
              label: "其他点击费用（链接）",
              value: "cost_per_link_click|1|其他点击费用（链接）|true"
            },
            { label: "链接点击量", value: "link_clicks|1|链接点击量|true" },
            { label: "千次发展费用", value: "cpm|1|千次发展费用|true" },
            {
              label: "点击率（链接）",
              value: "link_ctr|1|点击率（链接）|true"
            },
            {
              label: "总展示量",
              value: "lifetime_impressions|1|总展示量|false"
            },
            { label: "展示次数", value: "impressions|1|展示次数|true" },
            { label: "覆盖人数", value: "reach|1|覆盖人数|true" },
            { label: "潜在客户", value: "leadgen|1|潜在客户|true" },
            { label: "操作", value: "actions|1|操作|true" },
            { label: "点击量", value: "clicks|1|点击量|true" },
            { label: "CPA", value: "cpa|1|CPA|true" },
            { label: "CPC", value: "cpc|1|CPC|true" },
            // { label: "每点成本", value: "13|1" },
            { label: "点击率", value: "ctr|1|点击率|true" },
            { label: "成效率", value: "result_rate|1|成效率|true" },
            // { label: "社交点击量", value: "16|1" },
            // { label: "社交展示次数", value: "17|1" },
            {
              label: "单次独立点击费用",
              value: "cost_per_unique_click|1|单次独立点击费用|true"
            },
            {
              label: "独立用户点击量",
              value: "unique_clicks|1|独立用户点击量|true"
            },
            // { label: "独立用户社交点击量", value: "20|1" },
            // { label: "独立用户社交展示次数", value: "21|1" },
            { label: "今日花费", value: "today_spent|1|今日花费|false" },
            { label: "昨日花费", value: "yesterday_spent|1|昨日花费|false" },
            { label: "帖文互动", value: "post_engagement|1|帖文互动|true" },
            {
              label: "单次帖文互动",
              value: "cost_per_post_engagement|1|单次帖文互动|false"
            },
            {
              label: "观看视频达3秒的次数",
              value: "video_view|1|观看视频达3秒的次数|true"
            },
            {
              label: "单次视频观看费用",
              value: "cost_per_video_view|1|单次视频观看费用|false"
            },
            { label: "主页赞", value: "like|1|主页赞|true" },
            { label: "站外互动", value: "offsite_engagement|1|站外互动|true" },
            { label: "帖子", value: "post|1|帖子|true" },
            { label: "帖子评论", value: "post_comment|1|帖子评论|true" },
            { label: "帖子获赞", value: "post_like|1|帖子获赞|true" },
            { label: "帖子心情", value: "post_reaction|1|帖子心情|true" },
            { label: "内容查看", value: "view_content|1|内容查看|true" },
            { label: "点击播放视频", value: "video_play|1|点击播放视频|true" },
            { label: "提问回答", value: "vote|1|提问回答|true" },
            {
              label: "新增消息联系人数量",
              value:
                "onsite_conversion.messaging_first_reply|1|新增消息联系人数量|true"
            },
            {
              label: "单次新增消息联系人费用",
              value:
                "cost_per_messaging_first_reply|1|单次新增消息联系人费用|true"
            },
            {
              label: "消息回复次数",
              value: "onsite_conversion.messaging_reply|1|消息回复次数|true"
            },
            {
              label: "单次消息回复费用",
              value: "cost_per_messaging_reply|1|单次消息回复费用|true"
            },
            {
              label: "预估预算花费%",
              value: "estimated_budget_spending_percentage|1|预估预算花费%|true"
            }
          ]
        }
      ]
    };
  },
  methods: {
    editRuleInit(conditionlist) {
      // console.log(conditionlist);
      conditionlist.forEach(v => {
        let cond = null;
        let fatherkey = "";
        for (let i = 0; i < this.indicatorOption.length; i++) {
          cond = this.indicatorOption[i].children.find(
            g => g.value.split("|")[0] == v.field
          );
          if (cond) {
            fatherkey = this.indicatorOption[i].value;
            break;
          }
        }
        let vl = cond.value.split("|");
        this.indicator = [fatherkey, cond.value];
        // 初始化选项信息
        this.selectIndicator();
        this.operation = this.operationlist.find(g => g.imp == v.operator).key;
        // console.log(this.operation);
        let indicator = this.indicator[1].split("|");
        let ifdollar = this.dollarCheck(indicator[0]);
        switch (this.indicatortype) {
          case "1":
            if (this.operation == "1" || this.operation == "2") {
              this.indicatornum = ifdollar ? v.value / 100 : v.value;
            } else {
              this.indicatornum = ifdollar ? v.value[0] / 100 : v.value[0];
              this.indicatornumend = ifdollar ? v.value[1] / 100 : v.value[1];
            }
            break;
          case "2":
            this.indicatordata = v.value;
            break;
          case "3":
            this.indicatorselect = v.value;
            break;
          case "4":
            if (this.operation == "1" || this.operation == "2") {
              this.indicatortime = new Date(parseInt(v.value));
            } else {
              this.indicatortimerange = v.value.map(v => new Date(parseInt(v)));
            }
            break;
        }

        this.determineSearch("hole");
      });
    },
    editInit(condition) {
      this.indicator = condition.indicator;
      this.ifedit = true;
      // 初始化选项信息
      this.selectIndicator();
      // 填充数据
      this.operation = condition.operation;
      let optionvalue = condition.option;
      let indicator = this.indicator[1].split("|");
      let ifdollar = this.dollarCheck(indicator[0]);
      // console.log(ifdollar);
      switch (this.indicatortype) {
        case "1":
          if (this.operation == "1" || this.operation == "2") {
            this.indicatornum = ifdollar ? optionvalue.value / 100 : optionvalue.value;
          } else {
            this.indicatornum = ifdollar ? optionvalue.value[0] / 100 : optionvalue.value[0];
            this.indicatornumend = ifdollar ? optionvalue.value[1] / 100 : optionvalue.value[1];
          }
          break;
        case "2":
          this.indicatordata = optionvalue.value;
          break;
        case "3":
          this.indicatorselect = optionvalue.value;
          break;
        case "4":
          if (this.operation == "1" || this.operation == "2") {
            this.indicatortime = new Date(optionvalue.value);
          } else {
            this.indicatortimerange = optionvalue.value.map(v => new Date(v));
          }
          break;
      }
    },
    selectIndicator() {
      let condition = this.indicator[1].split("|");
      this.indicatortype = condition[1];
      this.indicatorval = condition[0];
      let selectOption = {
        "adset.placement.page_types": [
          { name: "Facebook动态（桌面版）", key: "DESKTOPFEED" },
          { name: "Facebook动态（移动版）", key: "MOBILEFEED" },
          { name: "Facebook右边栏", key: "RIGHTCOLUMN" },
          { name: "Instagram动态", key: "INSTAGRAMSTREAM" },
          { name: "Instagram快拍", key: "INSTAGRAMSTORY" },
          { name: "Audience Network", key: "MOBILEEXTERNAL" },
          { name: "Messenger收件箱", key: "MESSENGER_HOME" },
          { name: "Facebook Marketplace", key: "MOBILE-MARKETPLACE" }
        ],
        billing_event: [
          { name: "展示次数", key: "IMPRESSIONS" },
          { name: "应用安装", key: "APP_INSTALLS" },
          { name: "点击", key: "CLICKS" },
          { name: "链接点击量（单次点击费用）", key: "LINK_CLICKS" },
          { name: "领取优惠", key: "OFFER_CLAIMS" },
          { name: "主页赞", key: "PAGE_LIKES" },
          { name: "帖文互动", key: "POST_ENGAGEMENT" },
          { name: "观看视频达10秒的次数", key: "VIDEO_VIEWS" }
        ],
        optimization_goal: [
          { name: "应用安装量", key: "APP_INSTALLS" },
          { name: "品牌知名度", key: "BRAND_AWARENESS" },
          { name: "广告点击量", key: "CLICKS" },
          { name: "互动用户", key: "ENGAGED_USERS" },
          { name: "FBX使用率", key: "EXTERNAL" },
          { name: "活动响应", key: "EVENT_RESPONSES" },
          { name: "展示次数", key: "IMPRESSIONS" },
          { name: "开发潜在客户", key: "LEAD_GENERATION" },
          { name: "链接点击量", key: "LINK_CLICKS" },
          { name: "优惠领取", key: "OFFER_CLAIMS" },
          { name: "转化量", key: "OFFSITE_CONVERSIONS" },
          { name: "主页互动", key: "PAGE_ENGAGEMENT" },
          { name: "主页赞", key: "PAGE_LIKES" },
          { name: "帖文互动", key: "POST_ENGAGEMENT" },
          { name: "单日独立覆盖人数", key: "REACH" },
          { name: "回复次数", key: "REPLIES" },
          { name: "社交展示次数", key: "SOCIAL_IMPRESSIONS" },
          { name: "观看视频达10秒的次数", key: "VIDEO_VIEWS" }
        ]
      };

      switch (this.indicatortype) {
        case "1":
          this.operationlist = [
            { name: "大于", key: "1", imp: "GREATER_THAN" },
            { name: "小于", key: "2", imp: "LESS_THAN" },
            { name: "介于", key: "3", imp: "IN_RANGE" },
            { name: "不介于", key: "4", imp: "NOT_IN_RANGE" }
          ];
          break;
        case "2":
          this.operationlist = [
            { name: "包含", key: "1", imp: "CONTAIN" },
            { name: "不包含", key: "2", imp: "NOT_CONTAIN" }
          ];
          break;
        case "3":
          if (this.indicatorval == "adset.placement.page_types") {
            this.operationlist = [
              { name: "包含任意", key: "1", imp: "ANY" },
              { name: "包含所有", key: "2", imp: "ALL" },
              { name: "不包含", key: "3", imp: "NONE" }
            ];
          } else {
            this.operationlist = [
              { name: "是", key: "1", imp: "IN" },
              { name: "不是", key: "2", imp: "NOT_IN" }
            ];
          }
          this.indicatorselectlist = selectOption[this.indicatorval];
          break;
        case "4":
          this.operationlist = [
            { name: "大于", key: "1", imp: "GREATER_THAN" },
            { name: "小于", key: "2", imp: "LESS_THAN" },
            { name: "介于", key: "3", imp: "IN_RANGE" },
            { name: "不介于", key: "4", imp: "NOT_IN_RANGE" }
          ];
          break;
      }
      this.operation = "1";
      this.indicatorselect = [];
    },
    dataCheck() {
      if (this.indicator.length == 0) return [false, "请选择指标名称"];
      if (this.operation == "") return [false, "请选择运算"];
      switch (this.indicatortype) {
        case "2":
          if (this.indicatordata == "") return [false, "请填写内容"];
          break;
        case "3":
          if (this.indicatorselect == "") return [false, "请选择内容"];
          break;
        case "4":
          if (this.operation == "1" || this.operation == "2") {
            if (this.indicatortime == "") return [false, "请选择日期"];
          } else {
            if (!this.indicatortimerange || this.indicatortimerange.length != 2)
              return [false, "请选择日期"];
          }
          break;
      }

      return [true];
    },
    // 判断是否需要乘以100传参，费用类
    dollarCheck(key) {
      if (
        key.indexOf("ratio") == -1 &&
        (key.indexOf("amount") != -1 ||
          key.indexOf("cost") != -1 ||
          key.indexOf("budget") != -1 ||
          key.indexOf("spent") != -1 ||
          key.indexOf("cpm") != -1 ||
          key.indexOf("cpc") != -1 ||
          key.indexOf("cpa") != -1)
      ) {
        return true;
      } else return false;
    },
    determineSearch(frm) {
      let check = this.dataCheck();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }
      // console.log(this.indicator);
      // console.log(this.operationlist);
      // console.log(this.operation);

      let val;
      let indicator = this.indicator[1].split("|");
      let key = indicator[0];
      let compare = this.operationlist.find(v => v.key == this.operation);
      let name = `${indicator[2]}${compare.name}`;
      let trigger = eval(indicator[3]);
      let ifdollar = this.dollarCheck(indicator[0]);
      switch (this.indicatortype) {
        case "1":
          if (this.operation == "1" || this.operation == "2") {
            val = ifdollar ? this.indicatornum * 100 : this.indicatornum;
            name += (ifdollar ? "$" : "") + this.indicatornum;
          } else {
            val = [
              ifdollar ? this.indicatornum * 100 : this.indicatornum,
              ifdollar ? this.indicatornumend * 100 : this.indicatornumend
            ];
            name +=
              (ifdollar ? "$" : "") +
              this.indicatornum +
              "和" +
              (ifdollar ? "$" : "") +
              this.indicatornumend;
          }
          break;
        case "2":
          val = this.indicatordata;
          name += this.indicatordata;
          break;
        case "3":
          val = this.indicatorselect;
          let indicatorselectname = this.indicatorselect.map(
            v => this.indicatorselectlist.find(g => g.key == v).name
          );
          name += indicatorselectname.join(",");
          break;
        case "4":
          if (this.operation == "1" || this.operation == "2") {
            val = new Date(this.indicatortime).getTime().toString();
            name += this.$timeFormat(this.indicatortime, "yyyy-MM-dd HH:mm:ss");
          } else {
            val = this.indicatortimerange.map(v =>
              new Date(v).getTime().toString()
            );
            name +=
              this.$timeFormat(
                this.indicatortimerange[0],
                "yyyy-MM-dd HH:mm:ss"
              ) +
              "和" +
              this.$timeFormat(
                this.indicatortimerange[1],
                "yyyy-MM-dd HH:mm:ss"
              );
          }
          break;
      }

      let option = {
        field: key,
        value: val,
        operator: compare.imp
      };

      this.$emit("returnCondition", {
        name,
        key,
        option,
        trigger,
        indicator: this.indicator,
        operation: this.operation
      });
      this.ifedit = false;
      if (frm == "hole") {
        this.reset();
      } else {
        this.cancelSearch();
      }
    },
    cancelSearch() {
      this.$emit("update:status", false);
      if (this.ifedit) {
        this.$emit("cancelCondition");
      }

      this.reset();
    },
    reset() {
      this.indicator = [];
      this.indicatortype = "";
      this.indicatorval = "";
      this.operation = "";
      this.operationlist = []; // 运算方式列表

      this.indicatornum = 0;
      this.indicatornumend = 0;
      this.indicatordata = "";
      this.indicatortime = "";
      this.indicatortimerange = [];
      this.indicatorselect = [];
      this.indicatorselectlist = []; // 枚举列表

      this.ifedit = false;
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
