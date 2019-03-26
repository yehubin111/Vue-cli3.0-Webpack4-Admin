<template>
  <el-dialog class="dialogrule" title="创建规则" :visible="status" @close="hideBox">
    <el-form label-position="left">
      <el-form-item label="广告账户" label-width="110px">
        <el-select
          class="select"
          v-model="account"
          filterable
          multiple
          placeholder="请选择广告账户，可搜索"
          @change="toSort"
        >
          <el-option :label="111" :value="222"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则应用对象" label-width="110px">
        <el-select
          class="select"
          v-model="ruleobject"
          filterable
          placeholder="选择对象"
          @change="selectObject"
        >
          <el-option
            v-for="item in objectOption"
            :key="item.key"
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
            v-model="ctrlmethod"
            @change="selectCtrl"
          ></el-cascader>
          <el-input
            v-show="ctrlmethodwant && ctrlmethodwant != 'other'"
            class="ctrlnum"
            v-model="ctrlway1.ctrlnum"
            placeholder
          ></el-input>
          <el-select
            class="unitselect"
            v-model="ctrlway1.ruleunit"
            filterable
            placeholder
            v-show="ctrlmethodwant && ctrlmethodwant != 'other'"
            @change="changeUnit"
          >
            <el-option label="%" value="%"></el-option>
            <el-option label="$" value="$"></el-option>
          </el-select>
        </div>
        <p v-show="ctrlmethodwant">只有使用{{ctrlmethodname}}的{{ruleobjectname}}能受这个规则操作控制。</p>
        <el-form-item
          class="maxdaybudget"
          v-show="ctrlmethodwant && ctrlmethodwant != 'other'"
          :label="`${ctrlmethodname}${ctrlmethodwant == 'decrease'?'下限':'上限'}`"
          label-width="110px"
        >
          <el-input class="wid200" v-model="ctrlway1.daybudget" placeholder></el-input>
          <el-tooltip
            :class="{item3: ctrlmethodkey == 'daybudget',item2: ctrlmethodkey == 'bid',item4: ctrlmethodkey == 'totalbudget'}"
            effect="dark"
            :content="`这是在规则管理下每个${ruleobjectname}可获得的${ctrlmethodwant == 'decrease'?'最低':'最高'}${ctrlmethodname}`"
            placement="top-start"
          >
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="调整目标"
          v-show="ctrlmethodwant && ctrlmethodwant == 'other'"
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
            <div slot="content">竞价或预算将按此字段调整。
              <br>对于每个广告组，我们会在计算如何更改竞价或预算时计算这个字段的当前值。
              <br>根据容错范围字段，我们建议在下方添加“不介于”条件，否则，我们会继续尝试按实际值调整你的竞价或预算。
              <br>例如，如果你的目标是 0.5 且容错率是 10%，你可以把字段值指定为“不介于” 0.45 到 0.55 之间。这样，当前值在此范围内时，规则就不会执行。
            </div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="目标价值"
          v-show="ctrlmethodwant && ctrlmethodwant == 'other'"
          class="maxdaybudget"
          label-width="110px"
        >
          <el-input class="wid200" v-model="ctrlway2.targetworth" placeholder></el-input>
          <el-tooltip class="item2" effect="dark" placement="top-start">
            <div slot="content">这是你为上方目标字段选择的目标值，系统将据此调整竞价或预算。
              <br>我们会根据输入的目标值和目标字段的当前值按比例调整当前竞价或预算。通过判断目标值是否高于当前值，系统会相应提高或降低竞价或预算
            </div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item
          :label="`${ctrlmethodname}范围`"
          v-show="ctrlmethodwant && ctrlmethodwant == 'other'"
          class="maxdaybudget"
          label-width="110px"
        >
          <el-input class="wid100" v-model="ctrlway2.firstdist" placeholder></el-input>
          <span>-</span>
          <el-input class="wid100" v-model="ctrlway2.seconddist" placeholder></el-input>
          <el-tooltip
            :class="{item3: ctrlmethodkey == 'daybudget',item2: ctrlmethodkey == 'bid',item4: ctrlmethodkey == 'totalbudget'}"
            effect="dark"
            :content="`这是在规则管理下每个${ruleobjectname}可获得的${ctrlmethodwant == 'decrease'?'最低':'最高'}${ctrlmethodname}`"
            placement="top-start"
          >
            <div slot="content">
              这是规则所管理的广告组{{ctrlmethodname}}变化值限定范围。
              <br>
              定位规则的{{ctrlmethodname}}上限值和下限值。当广告组的{{ctrlmethodname}}达到范围界限并尝试调整到你的目标值时，{{ctrlmethodname}}可能会有所增加或减少。
            </div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="操作频率" v-show="ctrlmethodwant" label-width="110px">
          <el-select
            class="wid200"
            v-model="frequency"
            filterable
            placeholder="操作频率"
            @change="toSort"
          >
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
        <rule-condition :status.sync="conditionStatus"></rule-condition>
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
          <el-radio-group v-model="timewindow">
            <el-radio :label="1">账号默认设置</el-radio>
            <el-radio :label="2">自定义</el-radio>
          </el-radio-group>
          <div class="windowdeploy" v-show="timewindow == 2">浏览广告后
            <el-select
              class="wid100"
              v-model="timecustom1"
              filterable
              placeholder
              size="mini"
              @change="toSort"
            >
              <el-option
                v-for="item in timecustomlist"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>点击广告后
            <el-select
              class="wid100"
              v-model="timecustom2"
              filterable
              placeholder
              size="mini"
              @change="toSort"
            >
              <el-option
                v-for="item in timecustomlist"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form-item>
      <el-form-item label="排期" label-width="110px">
        <el-select class="select" v-model="schedule" filterable placeholder="选择排期" @change="toSort">
          <el-option :label="111" :value="222"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则名称" label-width="110px">
        <el-input class="select" v-model="rulename" placeholder="请输入名称"></el-input>
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

export default {
  props: ['status'],
  components: {
    RuleCondition
  },
  data() {
    return {
      objectOption: [
        { name: "投放中的全部广告系列", key: "campaign" },
        { name: "投放中的全部广告组", key: "adset" },
        { name: "投放中的全部广告", key: "ad" }
      ],
      ruleobject: "",
      ruleobjectname: "",
      ctrlList: [],
      ctrlOption: [
        {
          value: "close",
          label: "关闭",
          children: null
        },
        {
          value: "open",
          label: "开启",
          children: null
        },
        {
          value: "tzys",
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
          value: "tzsdjj",
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
      account: [],
      ctrlmethod: [],
      ctrlmethodkey: "",
      ctrlmethodname: "",
      ctrlmethodwant: "",

      ctrlname: "", // 操作类型名称， 单日预算 or 总预算 or 竞价 or ''
      ctrlsort: "", // 操作类型方式， 增加 or 减少
      ctrlway1: {
        // 第一种操作方式
        ctrlnum: "",
        ruleunit: "%",
        daybudget: "" // 单日预算上限
      },
      ctrlway2: {
        // 第二种操作方式
        target: "", // 调整目标
        targetworth: "", // 目标价值
        firstdist: "", // 范围
        seconddist: "" // 范围
      },
      frequency: "2", // 操作频率
      frequencyList: [
        { name: "每小时一次", key: "1" },
        { name: "每12小时一次", key: "2" },
        { name: "每周一次", key: "3" },
        { name: "两周一次", key: "4" }
      ],
      targetList: [
        // 调整目标list
        { name: "广告花费回报 (ROAS) - 移动应用购物", key: "1" },
        { name: "广告花费回报 (ROAS) - 网站购物", key: "2" },
        { name: "单次移动应用安装费用", key: "3" },
        { name: "单次移动应用购物费用", key: "4" },
        { name: "单次线下购物费用", key: "5" },
        { name: "单次成效费用", key: "6" },
        { name: "千次展示费用", key: "7" },
        { name: "CPA", key: "8" },
        { name: "CPC", key: "9" }
      ],
      schedule: "",
      rulename: "",
      timerange: [],
      timeOption: [
        { label: "广告发布期间", value: "1" },
        { label: "今天", value: "2" },
        { label: "昨天", value: "3" },
        { label: "过去2天", value: "4" },
        { label: "过去3天", value: "5" },
        { label: "过去7天", value: "6" },
        { label: "过去14天", value: "7" },
        { label: "过去28天", value: "8" },
        { label: "过去30天", value: "9" },
        {
          label: "包括今天",
          value: "10",
          children: [
            { label: "过去2天（包括今天）", value: "1" },
            { label: "过去3天（包括今天）", value: "2" },
            { label: "过去7天（包括今天）", value: "3" },
            { label: "过去14天（包括今天）", value: "4" },
            { label: "过去28天（包括今天）", value: "5" },
            { label: "过去30天（包括今天）", value: "6" }
          ]
        },
        {
          label: "过去7天",
          value: "11",
          children: [
            { label: "过去 14 天到过去 7 天", value: "1" },
            { label: "过去 30 天到过去 7 天", value: "2" },
            { label: "过去 60 天到过去 7 天", value: "3" },
            { label: "过去 120 天到过去 7 天", value: "4" },
            { label: "过去 180 天到过去 7 天", value: "5" },
            { label: "广告发布期间到过去 7 天", value: "6" }
          ]
        },
        {
          label: "过去28天",
          value: "12",
          children: [
            { label: "过去 60 天到过去 28 天", value: "1" },
            { label: "过去 120 天到过去 28 天", value: "2" },
            { label: "过去 180 天到过去 28 天", value: "3" },
            { label: "广告发布期间到过去 28 天", value: "4" }
          ]
        }
      ],
      conditionStatus: false,
      timewindow: 1,
      timecustomlist: [
        { name: "无（不计算浏览的转化）", key: "1" },
        { name: "1天", key: "2" },
        { name: "7天", key: "3" },
        { name: "28天", key: "4" }
      ],
      timecustom1: "2",
      timecustom2: "2"
    };
  },
  mounted() {
    this.ctrlList = this.ctrlOption.slice(0, 2);
  },
  computed: {},
  methods: {
    resetCtrlSelect() {
      this.ctrlway1["ctrlnum"] = "";
      this.ctrlway1["ruleunit"] = "%";
      this.ctrlway1["daybudget"] = "";

      this.ctrlway2["target"] = "";
      this.ctrlway2["targetworth"] = "";
      this.ctrlway2["firstdist"] = "";
      this.ctrlway2["seconddist"] = "";

      this.frequency = "2";
    },
    selectCtrl() {
      if (this.ctrlmethod[1]) {
        let key = this.ctrlmethod[1].split("_");
        this.ctrlmethodkey = key[0];
        this.ctrlmethodwant = key[1];
        switch (key[0]) {
          case "daybudget":
            this.ctrlmethodname = "单日预算";
            break;
          case "totalbudget":
            this.ctrlmethodname = "总预算";
            break;
          case "bid":
            this.ctrlmethodname = "竞价";
            break;
        }
      } else {
        this.ctrlmethodkey = this.ctrlmethod[0];
        this.ctrlmethodname = "";
        this.ctrlmethodwant = "";
      }

      this.resetCtrlSelect();
    },
    selectObject() {
      switch (this.ruleobject) {
        case "campaign":
          this.ruleobjectname = "广告系列";
          this.ctrlList = this.ctrlOption.slice(0, 3);
          break;
        case "adset":
          this.ruleobjectname = "广告组";
          this.ctrlList = this.ctrlOption.slice(0);
          break;
        case "ad":
          this.ruleobjectname = "广告";
          this.ctrlList = this.ctrlOption.slice(0, 2);
          break;
      }
      // 置空操作
      this.ctrlmethod = [];
      this.ctrlmethodkey = "";
      this.ctrlmethodname = "";
      this.ctrlmethodwant = "";

      this.resetCtrlSelect();
    },
    hideBox() {
      this.$emit('update:status', false);
    },
    toSort() {
      console.log(this.ctrlmethod);
    },
    saveRule() {},
    changeUnit() {}
  }
};
</script>

<style>
.dialogrule .el-dialog {
  width: 65%;
}
</style>

<style lang="less" scoped>
.select {
  width: 300px;
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
