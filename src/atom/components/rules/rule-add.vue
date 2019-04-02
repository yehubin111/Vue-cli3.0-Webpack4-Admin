<template>
  <el-dialog class="dialogrule" title="创建规则" :visible="status" @close="hideBox">
    <el-form label-position="left">
      <el-form-item label="广告账户" label-width="110px">
        <el-select
          class="select"
          v-model="form.account"
          filterable
          multiple
          collapse-tags
          :disabled="Boolean(editid)"
          placeholder="请选择广告账户，可搜索"
        >
          <el-option
            v-for="item in adaccountlist"
            :key="item.fbId"
            :label="item.name + (item.fbId != -1?'('+item.fbId+')':'')"
            :value="item.fbId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则应用对象" label-width="110px">
        <el-select
          class="select"
          v-model="form.ruleobject"
          filterable
          placeholder="选择对象"
          :disabled="Boolean(editid)"
          @change="selectObject"
        >
          <el-option
            v-for="item in adObjectOption"
            :key="item.difkey"
            :label="item.name"
            :value="item.key"
          ></el-option>
          <el-option
            v-for="item in objectOption"
            :key="item.difkey"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作" label-width="110px">
        <div>
          <el-cascader
            class="ctrlselect"
            :options="ctrlList"
            :show-all-levels="false"
            v-model="form.ctrlmethod"
            @change="selectCtrl"
          ></el-cascader>
          <el-input
            v-show="form.ctrlmethodwant && form.ctrlmethodwant != 'other'"
            class="ctrlnum"
            v-model="ctrlway1.ctrlnum"
            placeholder
          ></el-input>
          <el-select
            class="unitselect"
            v-model="ctrlway1.ruleunit"
            filterable
            placeholder
            v-show="form.ctrlmethodwant && form.ctrlmethodwant != 'other'"
          >
            <el-option label="%" value="PERCENTAGE"></el-option>
            <el-option label="$" value="ACCOUNT_CURRENCY"></el-option>
          </el-select>
        </div>
        <p
          v-show="form.ctrlmethodwant"
        >只有使用{{form.ctrlmethodname}}的{{form.ruleobjectname}}能受这个规则操作控制。</p>
        <el-form-item
          class="maxdaybudget"
          v-show="form.ctrlmethodwant && form.ctrlmethodwant != 'other'"
          :label="`${form.ctrlmethodname}${form.ctrlmethodwant == 'decrease'?'下限':'上限'}`"
          label-width="110px"
        >
          <el-input class="wid200" v-model="ctrlway1.daybudget" placeholder></el-input>
          <el-tooltip
            :class="{item3: form.ctrlmethodkey == 'daybudget',item2: form.ctrlmethodkey == 'bid',item4: form.ctrlmethodkey == 'totalbudget'}"
            effect="dark"
            :content="`这是在规则管理下每个${form.ruleobjectname}可获得的${form.ctrlmethodwant == 'decrease'?'最低':'最高'}${form.ctrlmethodname}`"
            placement="top-start"
          >
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="调整目标"
          v-show="form.ctrlmethodwant && form.ctrlmethodwant == 'other'"
          class="maxdaybudget"
          label-width="110px"
        >
          <el-select class="wid300" v-model="ctrlway2.target" filterable placeholder>
            <el-option
              v-for="item in targetList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
          <el-tooltip class="item2" effect="dark" placement="top-start">
            <div slot="content">
              竞价或预算将按此字段调整。
              <br>对于每个广告组，我们会在计算如何更改竞价或预算时计算这个字段的当前值。
              <br>根据容错范围字段，我们建议在下方添加“不介于”条件，否则，我们会继续尝试按实际值调整你的竞价或预算。
              <br>例如，如果你的目标是 0.5 且容错率是 10%，你可以把字段值指定为“不介于” 0.45 到 0.55 之间。这样，当前值在此范围内时，规则就不会执行。
            </div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="目标价值"
          v-show="form.ctrlmethodwant && form.ctrlmethodwant == 'other'"
          class="maxdaybudget"
          label-width="110px"
        >
          <el-input class="wid200" v-model="ctrlway2.targetworth" placeholder></el-input>
          <el-tooltip class="item2" effect="dark" placement="top-start">
            <div slot="content">
              这是你为上方目标字段选择的目标值，系统将据此调整竞价或预算。
              <br>我们会根据输入的目标值和目标字段的当前值按比例调整当前竞价或预算。通过判断目标值是否高于当前值，系统会相应提高或降低竞价或预算
            </div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          :label="`${form.ctrlmethodname}范围`"
          v-show="form.ctrlmethodwant && form.ctrlmethodwant == 'other'"
          class="maxdaybudget"
          label-width="110px"
        >
          <el-input class="wid100" v-model="ctrlway2.firstdist" placeholder></el-input>
          <span>-</span>
          <el-input class="wid100" v-model="ctrlway2.seconddist" placeholder></el-input>
          <el-tooltip
            :class="{item3: form.ctrlmethodkey == 'daybudget',item2: form.ctrlmethodkey == 'bid',item4: form.ctrlmethodkey == 'totalbudget'}"
            effect="dark"
            :content="`这是在规则管理下每个${form.ruleobjectname}可获得的${form.ctrlmethodwant == 'decrease'?'最低':'最高'}${form.ctrlmethodname}`"
            placement="top-start"
          >
            <div slot="content">
              这是规则所管理的广告组{{form.ctrlmethodname}}变化值限定范围。
              <br>
              定位规则的{{form.ctrlmethodname}}上限值和下限值。当广告组的{{form.ctrlmethodname}}达到范围界限并尝试调整到你的目标值时，{{form.ctrlmethodname}}可能会有所增加或减少。
            </div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="操作频率" v-show="form.ctrlmethodwant" label-width="110px">
          <el-select class="wid200" v-model="frequency" filterable placeholder="操作频率">
            <el-option
              v-for="item in frequencyList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="条件" label-width="110px">
        <el-tooltip
          class="conditiontip"
          effect="dark"
          content="实时规则建议把难度较高的规则放在前面，以便能及时触发；实时必须要有统计类指标，且某些统计类指标不支持实时"
          placement="top-start"
        >
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <span
          class="tagline"
          v-for="cond in form.conditionlist"
          :key="cond.key"
          @click="editCondition(cond.key)"
        >
          <el-tag class="tag" closable type @close="deleteCondtion(cond.key)">{{cond.name}}</el-tag>
        </span>
        <rule-condition
          ref="setCondition"
          :status.sync="conditionStatus"
          @cancelCondition="cancelCondition"
          @returnCondition="returnCondition"
        ></rule-condition>
        <p>
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            v-show="!conditionStatus"
            @click="conditionStatus = true"
          ></el-button>
        </p>
        <el-form-item label="时间范围" label-width="110px">
          <el-cascader
            class="ctrlselect"
            :options="timeOption"
            :show-all-levels="false"
            v-model="timerange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="统计时间窗" label-width="110px">
          <el-radio-group v-model="form.timewindow">
            <el-radio :label="1">账号默认设置</el-radio>
            <el-radio :label="2">自定义</el-radio>
          </el-radio-group>
          <div class="windowdeploy" v-show="form.timewindow == 2">
            浏览广告后
            <el-select class="wid100" v-model="form.timecustom1" filterable placeholder size="mini">
              <el-option
                v-for="item in viewcustomlist"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>点击广告后
            <el-select class="wid100" v-model="form.timecustom2" filterable placeholder size="mini">
              <el-option
                v-for="item in clickcustomlist"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form-item>
      <el-form-item label="排期" label-width="110px">
        <el-select
          class="select"
          v-model="form.schedule"
          placeholder="选择排期"
          @change="selectSchedule"
        >
          <el-option label="实时（至多7分钟）" value="TRIGGER|" :disabled="!trigger"></el-option>
          <el-option
            v-for="item in schedulelist"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
        <p v-show="form.schedulekey == 'DAILY'">每日的12点指的是广告账户时间</p>
        <p v-show="form.schedulekey == 'CUSTOM'">每天12点；自定义的12点指的是广告账户时间</p>
        <el-select
          class="select"
          v-model="form.week"
          multiple
          collapse-tags
          v-show="form.schedulekey == 'CUSTOM'"
          placeholder="选择星期"
        >
          <el-option v-for="item in weeklist" :key="item.key" :label="item.name" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则名称" label-width="110px">
        <el-input class="select" v-model="form.rulename" placeholder="请输入规则名称"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveRule">确 定</el-button>
      <el-button @click="hideBox">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import RuleCondition from "./rule-condition";
import { mapState } from "vuex";
import { Msgwarning, Msgerror } from "../../js/message";
import { setTimeout } from "timers";

export default {
  props: ["status"],
  components: {
    RuleCondition
  },
  data() {
    return {
      adObjectOption: [],
      objectOption: [
        { name: "投放中的全部广告系列", key: "CAMPAIGN", difkey: 4 },
        { name: "投放中的全部广告组", key: "ADSET", difkey: 5 },
        { name: "投放中的全部广告", key: "AD", difkey: 6 }
      ],
      ctrlList: [],
      ctrlOption: [
        {
          value: "PAUSE",
          label: "关闭",
          children: null
        },
        {
          value: "UNPAUSE",
          label: "开启",
          children: null
        },
        {
          value: "CHANGE_BUDGET",
          label: "调整预算",
          children: [
            {
              value: "daybudget_increase",
              label: "将单日预算增加"
            },
            {
              value: "daybudget_decrease",
              label: "将单日预算减少"
            },
            {
              value: "totalbudget_increase",
              label: "将总预算增加"
            },
            {
              value: "totalbudget_decrease",
              label: "将总预算减少"
            },
            {
              value: "daybudget_other",
              label: "根据目标调整单日预算"
            },
            {
              value: "totalbudget_other",
              label: "根据目标调整总预算"
            }
          ]
        },
        {
          value: "CHANGE_BID",
          label: "调整手动竞价",
          children: [
            {
              value: "bid_increase",
              label: "将竞价提高"
            },
            {
              value: "bid_decrease",
              label: "将竞价降低"
            },
            {
              value: "bid_other",
              label: "根据目标调整竞价"
            }
          ]
        }
      ],
      form: {
        account: [],
        ruleobject: "",
        ruleobjectname: "",
        ctrlmethod: [],
        ctrlmethodkey: "",
        ctrlmethodname: "",
        ctrlmethodwant: "",
        conditionlist: [],
        timewindow: 1,

        timecustom1: "1",
        timecustom2: "28",
        schedule: "",
        schedulegrade: "",
        schedulekey: "",
        week: [],
        rulename: ""
      },
      ctrlname: "", // 操作类型名称， 单日预算 or 总预算 or 竞价 or ''
      ctrlsort: "", // 操作类型方式， 增加 or 减少
      ctrlway1: {
        // 第一种操作方式
        ctrlnum: "",
        ruleunit: "PERCENTAGE",
        daybudget: "" // 单日预算上限
      },
      ctrlway2: {
        // 第二种操作方式
        target: "", // 调整目标
        targetworth: "", // 目标价值
        firstdist: "", // 范围
        seconddist: "" // 范围
      },
      frequency: "720", // 操作频率
      frequencyList: [
        { name: "每小时一次", key: "60" },
        { name: "每12小时一次", key: "720" },
        { name: "每周一次", key: "10080" },
        { name: "两周一次", key: "20160" }
      ],
      // 非统计指标, 不选择统计指标的情况下无法使用实时
      specialIndicator: [
        "campaign.name",
        "adset.name",
        "adset.placement.page_types",
        "lifetime_budget",
        "daily_budget",
        "bid_amount",
        "billing_event",
        "optimization_goal",
        "hours_since_creation",
        "active_time",
        "current_time",
        "created_time",
        "updated_time",
        "start_time"
      ],
      targetList: [
        // 调整目标list
        {
          name: "广告花费回报 (ROAS) - 移动应用购物",
          key: "mobile_app_purchase_roas"
        },
        {
          name: "广告花费回报 (ROAS) - 网站购物",
          key: "website_purchase_roas"
        },
        { name: "单次移动应用安装费用", key: "cost_per_mobile_app_install" },
        { name: "单次移动应用购物费用", key: "cost_per_mobile_purchase" },
        // { name: "单次线下购物费用", key: "5" },
        { name: "单次成效费用", key: "cost_per" },
        { name: "千次展示费用", key: "cpm" },
        { name: "CPA", key: "cpa" },
        { name: "CPC", key: "cpc" }
      ],
      timerange: ["LIFETIME"],
      timeOption: [
        { label: "广告发布期间", value: "LIFETIME" },
        { label: "今天", value: "TODAY" },
        { label: "昨天", value: "YESTERDAY" },
        { label: "过去2天", value: "LAST_2D" },
        { label: "过去3天", value: "LAST_3D" },
        { label: "过去7天", value: "LAST_7D" },
        { label: "过去14天", value: "LAST_14D" },
        { label: "过去28天", value: "LAST_28D" },
        { label: "过去30天", value: "LAST_30D" },
        {
          label: "包括今天",
          value: "10",
          children: [
            { label: "过去2天（包括今天）", value: "LAST_2_DAYS" },
            { label: "过去3天（包括今天）", value: "LAST_3_DAYS" },
            { label: "过去7天（包括今天）", value: "LAST_7_DAYS" },
            { label: "过去14天（包括今天）", value: "LAST_14_DAYS" },
            { label: "过去28天（包括今天）", value: "LAST_28_DAYS" },
            { label: "过去30天（包括今天）", value: "LAST_30_DAYS" }
          ]
        },
        {
          label: "过去7天",
          value: "11",
          children: [
            { label: "过去 14 天到过去 7 天", value: "LAST_ND_14_8" },
            { label: "过去 30 天到过去 7 天", value: "LAST_ND_30_8" },
            { label: "过去 60 天到过去 7 天", value: "LAST_ND_60_8" },
            { label: "过去 120 天到过去 7 天", value: "LAST_ND_120_8" },
            { label: "过去 180 天到过去 7 天", value: "LAST_ND_180_8" },
            { label: "广告发布期间到过去 7 天", value: "LAST_ND_LIFETIME_8" }
          ]
        },
        {
          label: "过去28天",
          value: "12",
          children: [
            { label: "过去 60 天到过去 28 天", value: "LAST_ND_60_29" },
            { label: "过去 120 天到过去 28 天", value: "LAST_ND_120_29" },
            { label: "过去 180 天到过去 28 天", value: "LAST_ND_180_29" },
            { label: "广告发布期间到过去 28 天", value: "LAST_ND_LIFETIME_29" }
          ]
        }
      ],
      conditionStatus: false,
      viewcustomlist: [
        { name: "无（不计算浏览的转化）", key: "0" },
        { name: "1天", key: "1" },
        { name: "7天", key: "7" },
        { name: "28天", key: "28" }
      ],
      clickcustomlist: [
        { name: "无（不计算点击的转化）", key: "0" },
        { name: "1天", key: "1" },
        { name: "7天", key: "7" },
        { name: "28天", key: "28" }
      ],
      schedulelist: [
        { name: "每半小时", key: "SCHEDULE|SEMI_HOURLY" },
        { name: "每小时", key: "SCHEDULE|HOURLY" },
        { name: "每日（每天12点）", key: "SCHEDULE|DAILY" },
        { name: "自定义", key: "SCHEDULE|CUSTOM" }
      ],
      weeklist: [
        { name: "星期一", key: 1 },
        { name: "星期二", key: 2 },
        { name: "星期三", key: 3 },
        { name: "星期四", key: 4 },
        { name: "星期五", key: 5 },
        { name: "星期六", key: 6 },
        { name: "星期日", key: 0 }
      ],
      editrule: null,
      adselect: [],
      adtype: "",
      idkey: "",
      from: "",
      trigger: true,
      editid: '',
      editfbid: ''
    };
  },
  mounted() {
    this.ctrlList = this.ctrlOption.slice(0, 2);
  },
  computed: {
    ...mapState(["adaccountlist", "newrulelist"])
  },
  methods: {
    adInit(select, type) {
      this.adselect = select;
      this.from = "ad"; // 表面是从广告管理页面创建规则
      switch (type) {
        case "campaignName":
          this.adObjectOption = this.adObjectOption.concat([
            {
              name: `${select.length}个广告系列`,
              key: "CAMPAIGN|ad",
              difkey: 1
            },
            {
              name: `${select.length}个广告系列中正在投放的广告组`,
              key: "ADSET|ad",
              difkey: 2
            },
            {
              name: `${select.length}个广告系列中正在投放的广告`,
              key: "AD|ad",
              difkey: 3
            }
          ]);
          this.adtype = "CAMPAIGN";
          this.idkey = "campaignId";
          break;
        case "adSetName":
          this.adObjectOption = this.adObjectOption.concat([
            { name: `${select.length}个广告组`, key: "ADSET|ad", difkey: 1 },
            {
              name: `${select.length}个广告组中正在投放的广告`,
              key: "AD|ad",
              difkey: 2
            }
          ]);
          this.adtype = "ADSET";
          this.idkey = "adsetId";
          break;
        case "adName":
          this.adObjectOption = this.adObjectOption.concat([
            { name: `${select.length}个广告`, key: "AD|ad", difkey: 1 }
          ]);
          this.adtype = "AD";
          this.idkey = "adId";
          break;
      }
    },
    async initEdit(id, fbid) {
      let object = this.newrulelist.find(v => v.id == id);
      let level = object.level;

      let evaluationSpec = JSON.parse(object.evaluationSpec);
      let executionSpec = JSON.parse(object.executionSpec);
      let scheduleSpec = object.scheduleSpec
        ? JSON.parse(object.scheduleSpec)
        : null;
      // 广告账户
      this.form.account = object.fbAccountId.split(",");
      // 规则应用对象
      let entity = evaluationSpec["filters"].find(
        v => v.field == "entity_type"
      );
      let fromad = evaluationSpec["filters"].find(
        v =>
          v.field == "campaign.id" ||
          v.field == "adset.id" ||
          v.field == "ad.id" ||
          v.field == "id"
      );
      if (fromad) {
        let adidkey = "";
        let adtype = "";
        if (fromad.field != "id") {
          level = fromad.field.split(".")[0].toLocaleUpperCase();
        }
        console.log(level);
        switch (level) {
          case "CAMPAIGN":
            adidkey = "campaignId";
            adtype = "campaignName";
            break;
          case "ADSET":
            adidkey = "adsetId";
            adtype = "adSetName";
            break;
          case "AD":
            adidkey = "adId";
            adtype = "adName";
            break;
        }
        let addata = fromad.value.map(v => {
          let obj = {};
          obj[adidkey] = v;
          return obj;
        });
        this.adInit(addata, adtype);
        this.form.ruleobject = entity.value + "|ad";
      } else {
        this.form.ruleobject = entity.value;
      }

      this.selectObject();
      /**
       * 操作部分数据初始化逻辑
       */
      this.form.ctrlmethod.push(executionSpec["execution_type"]);
      let budget = evaluationSpec["filters"].find(
        v => v.field == "budget_reset_period"
      );
      let changespec = executionSpec["execution_options"]
        ? executionSpec["execution_options"].find(v => v.field == "change_spec")
        : null;
      // 如果存在则表示不是开启或关闭
      if (changespec) {
        if (budget)
          this.form.ctrlmethodkey =
            budget[0] == "day" ? "daybudget" : "totalbudget";
        else this.form.ctrlmethodkey = "bid";

        switch (this.form.ctrlmethodkey) {
          case "daybudget":
            this.form.ctrlmethodname = "单日预算";
            break;
          case "totalbudget":
            this.form.ctrlmethodname = "总预算";
            break;
          case "bid":
            this.form.ctrlmethodname = "竞价";
            break;
        }

        if (changespec["value"]["target_field"]) {
          this.form.ctrlmethodwant = "other";
          this.ctrlway2.targetworth = changespec["value"]["amount"] / 100;
          this.ctrlway2.target = changespec["value"]["target_field"];
          this.ctrlway2.firstdist = changespec["value"]["limit"][0] / 100;
          this.ctrlway2.seconddist = changespec["value"]["limit"][1] / 100;
        } else {
          if (changespec["value"]["amount"] < 0) {
            this.form.ctrlmethodwant = "decrease";
          } else {
            this.form.ctrlmethodwant = "increase";
          }
          this.ctrlway1.ruleunit = changespec["value"]["unit"];
          this.ctrlway1.ctrlnum =
            this.ctrlway1.ruleunit == "ACCOUNT_CURRENCY"
              ? changespec["value"]["amount"] / 100
              : changespec["value"]["amount"];
          this.ctrlway1.daybudget = changespec["value"]["limit"] / 100;
        }

        this.form.ctrlmethod.push(
          this.form.ctrlmethodkey + "_" + this.form.ctrlmethodwant
        );
      }
      /**
       * 操作部分数据初始化逻辑
       */

      /**
       * 条件初始化逻辑
       */
      // 定时情况
      if (evaluationSpec["trigger"]) {
        let triggercond = evaluationSpec["trigger"];
        delete triggercond["type"];

        await this.$barrageTime(300);
        this.$refs.setCondition.editRuleInit(triggercond);
      }
      let condition = evaluationSpec["filters"].filter(
        v => v.operator != "EQUAL"
      );
      // 排除特殊情况
      condition = condition.filter(
        v =>
          v.field != "budget_reset_period" &&
          v.field != level.toLocaleLowerCase() + ".id" &&
          v.field != "id"
      );

      await this.$barrageTime(300);
      this.$refs.setCondition.editRuleInit(condition);
      // 时间范围
      let timepreset = evaluationSpec["filters"].find(
        v => v.field == "time_preset"
      );
      if (!this.timeOption.find(v => v.value == timepreset.value)) {
        this.timeOption.forEach(v => {
          if (v.children.find(g => g.value == timepreset.value)) {
            this.timerange.push(v.value);
          }
        });
      }
      this.timerange = [timepreset.value];
      // 统计时间窗逻辑
      let attributionWindow = evaluationSpec["filters"].find(
        v => v.field == "attribution_window"
      );
      switch (attributionWindow.value) {
        case "ACCOUNT_DEFAULT":
          this.form.timewindow = 1;
          break;
        case "DEFAULT":
          this.form.timewindow = 2;
          this.form.timecustom1 = "1";
          this.form.timecustom2 == "28";
          break;
        case "INLINE":
          this.form.timewindow = 2;
          this.form.timecustom1 = "0";
          this.form.timecustom2 == "0";
          break;
        default:
          this.form.timewindow = 2;
          let ar = attributionWindow.value.split("_");
          let view = ar.indexOf("VIEW");
          let click = ar.indexOf("CLICK");
          this.form.timecustom1 =
            view != -1 ? ar[view - 1].replace("D", "") : "0";
          this.form.timecustom2 =
            click != -1 ? ar[click - 1].replace("D", "") : "0";
          break;
      }
      /**
       * 条件初始化逻辑
       */
      // 排期
      this.form.schedule =
        evaluationSpec["evaluation_type"] +
        "|" +
        (scheduleSpec ? scheduleSpec["schedule_type"] : "");
      this.selectSchedule();
      if (scheduleSpec && scheduleSpec["schedule_type"] == "CUSTOM") {
        this.form.week = scheduleSpec["schedule"][0]["days"];
      }
      // 规则名称
      this.form.rulename = object["name"];

      this.editid = id;
      this.editfbid = fbid;
    },
    editCondition(key) {
      let condition = this.form.conditionlist.find(v => v.key == key);
      this.form.conditionlist = this.form.conditionlist.filter(
        v => v.key != key
      );

      this.conditionStatus = true;
      // 初始化条件编辑逻辑
      this.$refs.setCondition.editInit(condition);

      this.editrule = condition;
    },
    cancelCondition() {
      this.form.conditionlist.push(this.editrule);
    },
    deleteCondtion(key) {
      this.form.conditionlist = this.form.conditionlist.filter(
        v => v.key != key
      );
      // 判断是否支持实时
      this.setTriggerStatus();
    },
    setTriggerStatus() {
      this.trigger = true;
      // 首先排除特殊情况，条件全为非统计指标，则无法使用实时
      let special = this.form.conditionlist.filter(
        v => this.specialIndicator.indexOf(v.key) == -1
      );
      if (special.length == 0) {
        this.trigger = false;
      } else {
        special.forEach(v => {
          if (!v.trigger) {
            this.trigger = false;
          }
        });
      }
      this.form.schedule = "";
    },
    returnCondition(condition) {
      console.log(condition);
      this.form.conditionlist.push(condition);
      // 判断是否支持实时
      this.setTriggerStatus();
    },
    selectSchedule() {
      let schedule = this.form.schedule.split("|");
      this.form.schedulegrade = schedule[0];
      this.form.schedulekey = schedule[1];
    },
    resetCtrlSelect() {
      this.ctrlway1["ctrlnum"] = "";
      this.ctrlway1["ruleunit"] = "PERCENTAGE";
      this.ctrlway1["daybudget"] = "";

      this.ctrlway2["target"] = "";
      this.ctrlway2["targetworth"] = "";
      this.ctrlway2["firstdist"] = "";
      this.ctrlway2["seconddist"] = "";

      this.frequency = "720";
    },
    selectCtrl() {
      if (this.form.ctrlmethod[1]) {
        let key = this.form.ctrlmethod[1].split("_");
        this.form.ctrlmethodkey = key[0];
        this.form.ctrlmethodwant = key[1];
        switch (key[0]) {
          case "daybudget":
            this.form.ctrlmethodname = "单日预算";
            break;
          case "totalbudget":
            this.form.ctrlmethodname = "总预算";
            break;
          case "bid":
            this.form.ctrlmethodname = "竞价";
            break;
        }
      } else {
        this.form.ctrlmethodkey = this.form.ctrlmethod[0];
        this.form.ctrlmethodname = "";
        this.form.ctrlmethodwant = "";
      }

      this.resetCtrlSelect();
    },
    selectObject() {
      switch (this.form.ruleobject.split("|")[0]) {
        case "CAMPAIGN":
          this.form.ruleobjectname = "广告系列";
          this.ctrlList = this.ctrlOption.slice(0, 3);
          break;
        case "ADSET":
          this.form.ruleobjectname = "广告组";
          this.ctrlList = this.ctrlOption.slice(0);
          break;
        case "AD":
          this.form.ruleobjectname = "广告";
          this.ctrlList = this.ctrlOption.slice(0, 2);
          break;
      }
      // 置空操作
      this.form.ctrlmethod = [];
      this.form.ctrlmethodkey = "";
      this.form.ctrlmethodname = "";
      this.form.ctrlmethodwant = "";

      this.resetCtrlSelect();
    },
    hideBox() {
      this.$emit("update:status", false);
      this.reset();
    },
    dataCheck() {
      if (this.form.account.length == 0) return [false, "请选择广告账户"];
      if (!this.form.ruleobject) return [false, "请选择规则应用对象"];
      if (this.form.ctrlmethod.length == 0) return [false, "请选择操作"];
      // 操作情况分类
      if (this.form.ctrlmethodwant && this.form.ctrlmethodwant != "other") {
        if (!this.ctrlway1.ctrlnum) return [false, "请输入操作信息"];
        if (!this.ctrlway1.daybudget) return [false, "请输入预算"];
      } else if (this.form.ctrlmethodwant) {
        if (!this.ctrlway2.target) return [false, "请选择调整目标"];
        if (!this.ctrlway2.targetworth) return [false, "请输入目标价值"];
        if (!this.ctrlway2.firstdist || !this.ctrlway2.seconddist)
          return [false, "请输入预算范围"];
      }

      if (this.form.conditionlist.length == 0) return [false, "请选择条件"];
      if (!this.form.schedule) return [false, "请选择排期"];
      if (this.form.schedulekey == "CUSTOM" && this.form.week.length == 0)
        return [false, "请选择排期自定义星期"];
      if (!this.form.rulename) return [false, "请输入规则名称"];

      return [true];
    },
    async saveRule() {
      let check = this.dataCheck();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }

      let accountid = this.form.account;
      let accountname = this.form.account.map(
        v => this.adaccountlist.find(g => g.fbId == v).name
      );
      // 统计时间窗逻辑
      let windowcond = "ACCOUNT_DEFAULT";
      if (this.form.timewindow != 1) {
        switch (true) {
          case this.form.timecustom1 == "1" && this.form.timecustom2 == "28":
            windowcond = "DEFAULT";
            break;
          case this.form.timecustom1 == "0" && this.form.timecustom2 == "0":
            windowcond = "INLINE";
            break;
          default:
            let view =
              this.form.timecustom1 == "0"
                ? ""
                : this.form.timecustom1 + "D_VIEW";
            let click =
              this.form.timecustom2 == "0"
                ? ""
                : this.form.timecustom2 + "D_CLICK";
            windowcond = `${view}${view && click ? "_" : ""}${click}`;
            break;
        }
      }
      // 规则数据组合
      let option = {
        fbAccountId: accountid.join(","),
        fbAccountName: accountname.join(","),
        evaluationSpec: {
          evaluation_type: this.form.schedulegrade,
          filters: [
            {
              field: "entity_type",
              value: this.form.ruleobject.split("|")[0],
              operator: "EQUAL"
            },
            {
              field: "time_preset",
              value:
                this.timerange.length > 1
                  ? this.timerange[1]
                  : this.timerange[0],
              operator: "EQUAL"
            },
            {
              field: "attribution_window",
              value: windowcond,
              operator: "EQUAL"
            }
          ]
        },
        executionSpec: {
          execution_type: this.form.ctrlmethod[0],
          execution_options: [
            {
              field: "action_frequency",
              value: parseInt(this.frequency), // 频率分钟数
              operator: "EQUAL"
            }
          ]
        },

        name: this.form.rulename
      };
      // 单日预算或者总预算
      if (
        this.form.ctrlmethodkey == "daybudget" ||
        this.form.ctrlmethodkey == "totalbudget"
      ) {
        option["evaluationSpec"]["filters"].push({
          field: "budget_reset_period",
          value: [this.form.ctrlmethodkey == "daybudget" ? "DAY" : "LIFETIME"],
          operator: "IN"
        });
      }
      let obj = {
        field: "change_spec",
        value: {
          amount: 0,
          unit: "",
          limit: 0,
          target_field: ""
        },
        operator: "EQUAL"
      };
      // 操作数据
      switch (this.form.ctrlmethodwant) {
        case "increase":
        case "decrease":
          obj.value = {
            amount:
              this.ctrlway1.ruleunit == "ACCOUNT_CURRENCY"
                ? this.ctrlway1.ctrlnum * 100
                : this.ctrlway1.ctrlnum,
            limit: this.ctrlway1.daybudget * 100,
            unit: this.ctrlway1.ruleunit
          };
        case "decrease":
          obj.value.amount = obj.value.amount * -1;
          break;
        case "other":
          obj.value = {
            amount: this.ctrlway2.targetworth * 100,
            limit: [
              this.ctrlway2.firstdist * 100,
              this.ctrlway2.seconddist * 100
            ],
            target_field: this.ctrlway2.target
          };
          break;
      }
      // 从广告管理页面创建，选择了特殊选项
      if (this.form.ruleobject.split("|")[1] && this.form.ruleobject.split("|")[1] == "ad") {
        console.log(this.adselect);
        console.log(this.idkey);
        let adobj = {
          field:
            this.adtype == this.form.ruleobject.split("|")[0]
              ? "id"
              : `${this.adtype.toLocaleLowerCase()}.id`,
          value: this.adselect.map(v => v[this.idkey]),
          operator: "IN"
        };
        option["evaluationSpec"]["filters"].push(adobj);
      }
      // 关闭或者开启操作无需传该条件
      if (this.form.ctrlmethodwant)
        option["executionSpec"]["execution_options"].push(obj);
      /**
       * 条件传参逻辑
       * 如果是选择了统计条件，并且选择了实时排期，则需要传trigger字段，参数为第一个统计条件
       */
      let conditionall = this.form.conditionlist;
      if (this.form.schedulegrade == "TRIGGER") {
        let specialcondition = this.form.conditionlist.find(
          v => this.specialIndicator.indexOf(v.key) == -1
        );
        option["evaluationSpec"]["trigger"] = {
          type: "STATS_CHANGE",
          ...specialcondition["option"]
        };
        conditionall = this.form.conditionlist.filter(
          v => v.key != specialcondition.key
        );
      }
      option["evaluationSpec"]["filters"] = option["evaluationSpec"][
        "filters"
      ].concat(conditionall.map(v => v.option));
      // 排期
      if (this.form.schedulegrade == "SCHEDULE") {
        option["scheduleSpec"] = {
          schedule_type: this.form.schedulekey
        };
        if (this.form.schedulekey == "CUSTOM") {
          option["scheduleSpec"]["schedule"] = [
            {
              days: this.form.week,
              start_minute: 720
            }
          ];
        }
      }

      option["executionSpec"] = JSON.stringify(option["executionSpec"]);
      option["evaluationSpec"] = JSON.stringify(option["evaluationSpec"]);
      if (option["scheduleSpec"])
        option["scheduleSpec"] = JSON.stringify(option["scheduleSpec"]);

      console.log(option);
      let res = null;
      if (!this.editid)
        res = await this.$store.dispatch("addRule", {
          option,
          from: this.from
        });
      else {
        option['id'] = this.editid;
        option['fbId'] = this.editfbid;
        res = await this.$store.dispatch("editRule", { option });
      }
      if (res && res.data) {
        this.hideBox();
      }
    },
    reset() {
      this.form.account = [];
      this.form.ruleobject = "";
      this.form.ruleobjectname = "";
      this.form.ctrlmethod = [];
      this.form.ctrlmethodkey = "";
      this.form.ctrlmethodname = "";
      this.form.ctrlmethodwant = "";
      this.form.conditionlist = [];
      this.form.timewindow = 1;

      this.form.timecustom1 = "1";
      this.form.timecustom2 = "28";
      this.form.schedule = "";
      this.form.schedulegrade = "";
      this.form.schedulekey = "";
      this.form.week = [];
      this.form.rulename = "";

      this.ctrlname = ""; // 操作类型名称， 单日预算 or 总预算 or 竞价 or ''
      this.ctrlsort = ""; // 操作类型方式， 增加 or 减少

      this.ctrlway1.ctrlnum = "";
      this.ctrlway1.ruleunit = "PERCENTAGE";
      this.ctrlway1.daybudget = ""; // 单日预算上限

      // 第二种操作方式
      this.ctrlway2.target = ""; // 调整目标
      this.ctrlway2.targetworth = ""; // 目标价值
      this.ctrlway2.firstdist = ""; // 范围
      this.ctrlway2.seconddist = ""; // 范围

      this.frequency = "720"; // 操作频率
      this.timerange = ["LIFETIME"];
      this.editrule = null;
      this.adselect = [];
      this.adtype = "";
      this.adObjectOption = [];
      this.idkey = "";
      this.from = "";
      this.trigger = true;
      this.editid = '';
      this.editfbid = '';
    }
  }
};
</script>

<style>
.dialogrule .el-dialog {
  width: 65%;
}
</style>

<style lang="less" scoped>
.tagline {
  margin-right: 10px;
}
.select {
  width: 340px;
}
.ctrlselect {
  width: 280px;
}
.dialog-footer {
  text-align: center;
  margin-bottom: 30px;
}
.ctrlnum {
  width: 100px;
  margin-left: 20px;
}
.unitselect {
  width: 70px;
}
.maxdaybudget {
  position: relative;
}
.conditiontip {
  position: absolute;
  left: -78px;
  top: 14px;
}
.item {
  position: absolute;
  left: -24px;
  top: 14px;
}
.item2 {
  position: absolute;
  left: -50px;
  top: 14px;
}
.item3 {
  position: absolute;
  left: -22px;
  top: 14px;
}
.item4 {
  position: absolute;
  left: -36px;
  top: 14px;
}
.wid100 {
  width: 100px;
  margin-bottom: 10px;
}

.wid200 {
  width: 200px;
  margin-bottom: 10px;
}

.wid300 {
  width: 300px;
  margin-bottom: 10px;
}
</style>
