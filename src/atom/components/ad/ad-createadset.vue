<template>
  <div class="create-adset">
    <el-form class="form" :model="form" label-width="100px" label-position="left">
      <el-form-item label="当前广告系列">
        <el-select
          class="formselect"
          v-model="form.campaign"
          remote
          :remote-method="remoteMethod"
          :disabled="editId.length > 0"
          filterable
          placeholder="请选择广告系列"
          v-show="!mutil.campaign"
          @change="accountToAudience"
        >
          <el-option
            v-for="item in createcampaignlist"
            :key="item.campaignId"
            :label="item.campaiggName+'('+item.campaignId+')'"
            :value="item.campaignId + '|' + item.fbAccount"
            class="selectOption"
          ></el-option>
        </el-select>
        <p v-if="mutil.campaign">多项内容</p>
      </el-form-item>
      <el-form-item label="广告组编号" v-if="editId.length > 0">
        <span class="adnum" id="copyAdset">{{editId.length > 1? '多项内容': editId[0]}}</span>
        <el-button
          id="copyButtonAdset"
          data-clipboard-action="copy"
          data-clipboard-target="#copyAdset"
          type="primary"
          size="mini"
          v-show="editId.length == 1"
        >复制</el-button>
      </el-form-item>
      <el-form-item label="广告组名称">
        <p v-if="mutil.name">
          <span v-show="mutilstatus.name">多项内容，
            <el-button type="text" @click="mutilstatus.name = !mutilstatus.name">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.name">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.name = !mutilstatus.name">撤销编辑</el-button>
          </span>
        </p>
        <el-input v-model="form.name" placeholder="请输入广告组名称" v-show="!mutilstatus.name"></el-input>
      </el-form-item>
      <el-form-item label="动态创意" class="activecreate">
        <p v-if="mutil.activecreate">
          <span v-show="mutilstatus.activecreate">多项内容</span>
        </p>
        <el-switch
          v-model="form.activecreate"
          active-color="#13ce66"
          inactive-color="#d7dae2"
          v-show="!mutilstatus.activecreate"
          :disabled="editId.length > 0"
        ></el-switch>
        <span class="tipfont" v-show="!mutilstatus.activecreate">提供图片和标题等素材，并自动为受众生成创意组合</span>
      </el-form-item>
      <el-form-item label="国家">
        <p v-if="mutil.country">
          <span v-show="mutilstatus.country">多项内容，
            <el-button type="text" @click="mutilstatus.country = !mutilstatus.country">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.country">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.country = !mutilstatus.country">撤销编辑</el-button>
          </span>
        </p>
        <el-select
          class="formselect"
          v-model="form.country"
          multiple
          filterable
          placeholder="请选择国家，可搜索"
          @change="showBidChart"
          v-show="!mutilstatus.country"
        >
          <el-option
            v-for="item in othercountries"
            :key="item.code"
            :label="item.name + '(' + item.code + ')'"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用">
        <p v-if="mutil.action">多项内容</p>
        <el-select
          class="formselect"
          v-model="form.action"
          disabled
          placeholder="请选择应用"
          v-show="!mutilstatus.action"
        >
          <el-option
            v-for="(l, index) in adapplist"
            :key="index"
            :label="l.name"
            :value="l.applicationId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="平台">
        <p v-if="mutil.platform">多项内容</p>
        <el-radio-group v-model="form.platform" @change="toGetsystem" v-show="!mutil.platform">
          <el-radio
            :label="l.marketType"
            v-for="l in createplatform"
            :key="l.marketType"
            :disabled="editId.length > 0"
          ></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="系统版本" class="cline versionline" v-show="form.platform != ''">
        <p v-if="mutil.version">
          <span v-show="mutilstatus.version">多项内容，
            <el-button type="text" @click="mutilstatus.version = !mutilstatus.version">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.version">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.version = !mutilstatus.version">撤销编辑</el-button>
          </span>
        </p>
        <el-select
          class="versionselect"
          v-show="!mutilstatus.version"
          v-model="form.lowversion"
          placeholder="最低版本"
        >
          <el-option
            v-for="l in system"
            :key="l.version"
            :label="l.os + ' ' + l.version"
            :value="l.version"
          ></el-option>
        </el-select>
        <span v-show="!mutilstatus.version">-</span>
        <el-select
          class="versionselect"
          v-show="!mutilstatus.version"
          v-model="form.highversion"
          placeholder="最高版本"
        >
          <el-option
            v-for="l in system"
            :key="l.version"
            :label="l.os + ' ' + l.version"
            :value="l.version"
          ></el-option>
        </el-select>
        <p style="font-size: 12px;color: #999;">最高版本为空则无上限</p>
      </el-form-item>
      <el-form-item label="受众" class="cline">
        <p v-if="mutil.target">
          <span v-show="mutilstatus.target">多项内容，
            <el-button type="text" @click="mutilstatus.target = !mutilstatus.target">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.target">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.target = !mutilstatus.target">撤销编辑</el-button>
          </span>
        </p>
        <div class="targettip" v-show="!mutilstatus.target">定位至少符合以下一项条件的用户</div>
        <el-select
          class="select accountselect"
          no-data-text="暂无受众，请修改账户或新增受众"
          v-model="form.target"
          v-show="!mutilstatus.target"
          multiple
          filterable
          placeholder="请选择受众，可搜索"
        >
          <el-option-group v-for="group in genertarget" :key="group.label" :label="group.label.split('_')[1]">
            <el-option
              v-for="item in group.options"
              :key="item.code"
              :label="`${item.name}（${item.audienceId}）`"
              :value="`${item.audienceId}`"
              v-show="form.notarget.indexOf(`${item.audienceId}`) == -1"
            ></el-option>
          </el-option-group>
        </el-select>
        <el-checkbox-group v-model="form.iftarget" v-show="!mutilstatus.target">
          <el-checkbox label="1" name="type">不排除任何受众</el-checkbox>
        </el-checkbox-group>
        <div
          class="targettip"
          v-if="form.iftarget[0] != 1"
          v-show="!mutilstatus.target"
        >排除至少符合以下一项条件的用户</div>
        <el-select
          class="select accountselect"
          no-data-text="暂无受众，请修改账户或新增受众"
          v-show="!mutilstatus.target && form.iftarget[0] != 1"
          v-model="form.notarget"
          multiple
          filterable
          placeholder="请选择受众，可搜索"
        >
          <el-option-group v-for="group in genertarget" :key="group.label" :label="group.label.split('_')[1]">
            <el-option
              v-for="item in group.options"
              :key="item.code"
              :label="`${item.name}（${item.audienceId}）`"
              :value="`${item.audienceId}`"
              v-show="form.target.indexOf(`${item.audienceId}`) == -1"
            ></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="预算">
        <p v-if="mutil.moneytype">
          <span v-show="mutilstatus.moneytype">多项内容，
            <el-button type="text" @click="mutilstatus.moneytype = !mutilstatus.moneytype">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.moneytype">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.moneytype = !mutilstatus.moneytype">撤销编辑</el-button>
          </span>
        </p>
        <el-radio-group v-model="form.moneytype" v-show="!mutilstatus.moneytype">
          <el-radio label="day_budget">单日预算</el-radio>
          <el-radio label="total_budget">总预算</el-radio>
        </el-radio-group>
        <div class="moneyinput" v-show="!mutilstatus.moneytype">
          <span class="moneyus">$</span>
          <el-input class="minput" v-model="form.money" placeholder="请输入预算金额（单位：美元）"></el-input>
        </div>
      </el-form-item>
      <el-form-item
        label="投放日期"
        v-show="form.moneytype == 'total_budget' && !mutilstatus.moneytype"
      >
        <el-date-picker
          v-model="form.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item
        label="投放时段"
        class="cline timerange"
        v-show="form.moneytype == 'total_budget' && !mutilstatus.moneytype"
      >
        <el-radio-group v-model="form.timerange">
          <el-radio label="allday">全天投放广告</el-radio>
          <el-radio label="schedule">分时间段投放</el-radio>
        </el-radio-group>
        <div class="moneyinput" v-show="form.timerange == 'schedule'">
          <el-select class="selectsmall" v-model="form.rdate" multiple placeholder="按广告受众所在时区">
            <el-option v-for="(l, index) in week" :key="index" :label="l.name" :value="l.key"></el-option>
          </el-select>
          <el-time-picker
            class="timeselect"
            is-range
            v-model="form.rtime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </div>
      </el-form-item>
      <el-form-item label="设备" v-show="form.platform != ''">
        <p v-if="mutil.equip">
          <span v-show="mutilstatus.equip">多项内容，
            <el-button type="text" @click="mutilstatus.equip = !mutilstatus.equip">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.equip">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.equip = !mutilstatus.equip">撤销编辑</el-button>
          </span>
        </p>
        <el-checkbox-group v-model="form.equip" v-show="!mutilstatus.equip">
          <el-checkbox
            label="Android_Smartphone"
            name="type"
            v-if="form.platform == 'google_play'"
          >安卓智能手机</el-checkbox>
          <el-checkbox label="iPhone" name="type" v-if="form.platform == 'itunes'">iPhone</el-checkbox>
          <el-checkbox label="iPad" name="type" v-if="form.platform == 'itunes'">iPad</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="性别">
        <p v-if="mutil.sex">
          <span v-show="mutilstatus.sex">多项内容，
            <el-button type="text" @click="mutilstatus.sex = !mutilstatus.sex">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.sex">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.sex = !mutilstatus.sex">撤销编辑</el-button>
          </span>
        </p>
        <el-radio-group v-model="form.sex" v-show="!mutilstatus.sex">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" class="cline">
        <p v-if="mutil.age">
          <span v-show="mutilstatus.age">多项内容，
            <el-button type="text" @click="mutilstatus.age = !mutilstatus.age">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.age">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.age = !mutilstatus.age">撤销编辑</el-button>
          </span>
        </p>
        <el-slider
          v-show="!mutilstatus.age"
          v-model="form.age"
          range
          :min="13"
          :max="65"
          :format-tooltip="formatTooltip"
        ></el-slider>
      </el-form-item>
      <el-form-item label="语言">
        <p v-if="mutil.language">
          <span v-show="mutilstatus.language">多项内容，
            <el-button type="text" @click="mutilstatus.language = !mutilstatus.language">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.language">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.language = !mutilstatus.language">撤销编辑</el-button>
          </span>
        </p>
        <el-select
          class="formselect"
          v-model="form.language"
          v-show="!mutilstatus.language"
          multiple
          filterable
          placeholder="请选择语言，可搜索"
        >
          <el-option
            v-for="item in language"
            :key="item.localeId"
            :label="item.name"
            :value="item.localeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="兴趣">
        <p v-if="mutil.interest">
          <span v-show="mutilstatus.interest">多项内容，
            <el-button type="text" @click="mutilstatus.interest = !mutilstatus.interest">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.interest">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.interest = !mutilstatus.interest">撤销编辑</el-button>
          </span>
        </p>
        <el-select
          class="formselect"
          v-model="form.interest"
          v-show="!mutilstatus.interest"
          multiple
          filterable
          placeholder="请选择兴趣，可搜索"
        >
          <el-option
            v-for="item in interests"
            :key="item.featureId"
            :label="item.name"
            :value="item.featureId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自动版位">
        <p v-if="mutil.auto">
          <span v-show="mutilstatus.auto">多项内容，
            <el-button type="text" @click="mutilstatus.auto = !mutilstatus.auto">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.auto">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.auto = !mutilstatus.auto">撤销编辑</el-button>
          </span>
        </p>
        <el-checkbox-group v-model="form.auto" v-show="!mutilstatus.auto">
          <el-checkbox label="1" name="type">是（Facebook自动选择最好的版位）</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="版位" class="verpla" v-show="form.auto[0] != 1 && !mutilstatus.auto">
        <el-checkbox-group v-model="form.verpla" style="width: 500px">
          <el-checkbox
            label="facebook"
            name="type"
            :disabled="form.verpla.indexOf('audience_network') != -1 || form.verpla.indexOf('messenger') != -1"
          >Facebook</el-checkbox>
          <el-checkbox label="instagram" name="type">Instagram</el-checkbox>
          <el-checkbox
            label="audience_network"
            name="type"
            :disabled="form.verpla.indexOf('facebook') == -1"
          >Audience Network</el-checkbox>
          <el-checkbox
            label="messenger"
            name="type"
            :disabled="form.verpla.indexOf('facebook') == -1"
          >Messenger</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="出价" class="cline">
        <p v-if="mutil.bid">
          <span v-show="mutilstatus.bid">多项内容，
            <el-button type="text" @click="mutilstatus.bid = !mutilstatus.bid">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.bid">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.bid = !mutilstatus.bid">撤销编辑</el-button>
          </span>
        </p>
        <el-radio-group v-model="form.bid" @change="maxbidDefault" v-show="!mutilstatus.bid">
          <el-radio label="cpi">CPI</el-radio>
          <el-radio label="cpm">CPM</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="竞价上限" v-show="!mutilstatus.bid">
        <div class="moneyinput">
          <span class="moneyus">$</span>
          <el-input class="minput" v-model="form.maxbid" :placeholder="maxbidplace"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="用户过滤" class="cline">
        <p v-if="mutil.filtra">
          <span v-show="mutilstatus.filtra">多项内容，
            <el-button type="text" @click="mutilstatus.filtra = !mutilstatus.filtra">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.filtra">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.filtra = !mutilstatus.filtra">撤销编辑</el-button>
          </span>
        </p>
        <el-checkbox-group v-model="form.filtra" v-show="!mutilstatus.filtra">
          <el-checkbox label="1" name="filtra">过滤已安装用户</el-checkbox>
          <el-checkbox label="2" name="filtra">过滤已关注用户</el-checkbox>
        </el-checkbox-group>
        <div class="moneyinput" v-show="form.filtra.indexOf('2') != -1 && !mutilstatus.filtra">
          <el-select
            class="formselect"
            v-model="form.filtrapage"
            multiple
            placeholder="请选择要过滤的主页，必选"
          >
            <el-option
              v-for="(l, index) in createallpagelist"
              :key="index"
              :label="l.name"
              :value="l.pageId"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
    </el-form>
    <div class="bidguide">
      <gener-guide
        :bid="form.bid"
        :maxbid="form.maxbid"
        :moneytype="form.moneytype"
        :money="form.money"
      ></gener-guide>
    </div>
  </div>
</template>

<script>
import GenerGuide from "../generalize/gener-guide";
import { Msgwarning } from "../../js/message";
import { mapState, mapMutations } from "vuex";
export default {
  props: ["editId"],
  data() {
    return {
      maxbidplace: "请输入竞价上限（单位：美元）",
      // loading: false,
      editArray: [],
      week: [
        {
          name: "周一",
          key: 1
        },
        {
          name: "周二",
          key: 2
        },
        {
          name: "周三",
          key: 3
        },
        {
          name: "周四",
          key: 4
        },
        {
          name: "周五",
          key: 5
        },
        {
          name: "周六",
          key: 6
        },
        {
          name: "周七",
          key: 7
        }
      ],
      form: {
        campaign: "",
        name: "",
        activecreate: false,
        country: [],
        action: "", // applicationid
        platform: "",
        lowversion: "",
        highversion: "",
        target: [],
        notarget: [],
        iftarget: ["1"],
        moneytype: "day_budget",
        money: "",
        date: [],
        timerange: "allday",
        rdate: [],
        rtime: [
          new Date(2016, 9, 10, 0, 0, 0),
          new Date(2016, 9, 10, 23, 0, 0)
        ],
        equip: [],
        sex: 0,
        age: [13, 65],
        language: [],
        interest: [],
        auto: ["1"],
        verpla: ["facebook", "instagram"],
        bid: "cpi",
        maxbid: "0.02",
        filtra: ["1", "2"],
        filtrapage: []
      },
      mutilstatus: {},
      mutil: {
        campaign: false,
        name: false,
        activecreate: false,
        country: false,
        action: false,
        target: false,
        platform: false,
        version: false,
        moneytype: false,
        equip: false,
        sex: false,
        age: false,
        language: false,
        interest: false,
        auto: false,
        bid: false,
        filtra: false
      },
      msg: {
        campaign: "请选择广告系列",
        name: "请输入广告组名称",
        country: "请选择国家",
        platform: "请选择平台",
        version: "请选择系统版本",
        moneytype: "请选择预算",
        money: "请输入预算金额",
        date: "请选择投放日期",
        rdate: "请选择星期",
        equip: "请选择设备",
        sex: "请选择性别",
        language: "请选择语言",
        // interest: "请选择兴趣",
        verpla: "请选择版位",
        maxbid: "请输入竞价上限",
        maxbidmax: "竞价上限必须大于0.02美元",
        filtra: "请选择用户过滤",
        filtrapage: "请选择需要过滤的主页"
      }
    };
  },
  components: {
    GenerGuide
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    accountToAudience() {
      this.form.target = [];
      this.form.notarget = [];

      let fb_account_ids = this.form.campaign.split("|")[1];
      this.$store.dispatch("generTargetList", { fb_account_ids });
    },
    showBidChart() {
      if (!this.form.country) {
        return;
      }
      // 20181105新增出价指南数据
      let country = this.form.country;
      let billingEvent =
        this.form.bid == "cpi" ? "APP_INSTALLS" : "IMPRESSIONS";
      this.$store.dispatch("bidGuide", {
        country,
        fbApplicationId: this.actions,
        billingEvent
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        // this.loading = true;
        this.$store.dispatch("getCreateCampaignlist", {
          keyword: query,
          projectId: this.$route.params.id
        });
      } else {
        this.SETSTATE({ k: "createcampaignlist", v: [] });
      }
    },
    formatTooltip(val) {
      if (val == 65) return "65+";
    },
    maxbidDefault() {
      if (this.form.bid == "cpi") {
        this.form.maxbid = "0.02";
        this.maxbidplace = "请输入竞价上限（单位：美元）";
      } else {
        this.form.maxbid = "";
        this.maxbidplace = "选填";
      }

      this.showBidChart();
    },
    // 数据监测，区分创建和编辑情况
    dataChecked() {
      if (this.form.campaign == "" && !this.mutilstatus.campaign)
        return [false, this.msg.campaign];
      if (this.form.name == "" && !this.mutilstatus.name)
        return [false, this.msg.name];
      if (this.form.country.length == 0 && !this.mutilstatus.country)
        return [false, this.msg.country];
      if (this.form.platform == "" && !this.mutilstatus.platform)
        return [false, this.msg.platform];

      if (
        !this.form.platform &&
        this.form.lowversion == "" &&
        !this.mutilstatus.version
      )
        return [false, this.msg.version];

      if (this.form.moneytype == "" && !this.mutilstatus.moneytype)
        return [false, this.msg.moneytype];
      if (this.form.money == "" && !this.mutilstatus.moneytype)
        return [false, this.msg.money];
      if (this.form.moneytype == "total_budget") {
        if (!this.form.date || this.form.date.length == 0)
          return [false, this.msg.date];
        if (this.form.timerange == "schedule" && this.form.rdate.length == 0)
          return [false, this.msg.rdate];
      }
      if (
        !this.form.platform &&
        this.form.equip.length == 0 &&
        !this.mutilstatus.equip
      )
        return [false, this.msg.equip];
      if (this.form.sex === null && !this.mutilstatus.sex)
        return [false, this.msg.sex];
      if (this.form.language.length == 0 && !this.mutilstatus.language)
        return [false, this.msg.language];
      //   if (this.form.interest.length == 0) return [false, this.msg.interest];
      if (
        this.form.auto.length == 0 &&
        this.form.verpla.length == 0 &&
        !this.mutilstatus.auto
      )
        return [false, this.msg.verpla];
      if (
        this.form.bid == "cpi" &&
        this.form.maxbid == "" &&
        !this.mutilstatus.bid
      )
        return [false, this.msg.maxbid];
      if (
        this.form.maxbid !== "" &&
        (isNaN(parseInt(this.form.maxbid)) || this.form.maxbid < 0.02) &&
        !this.mutilstatus.bid
      )
        return [false, this.msg.maxbidmax];
      if (this.form.filtra.length == 0 && !this.mutilstatus.filtra)
        return [false, this.msg.filtra];
      if (this.form.filtra.indexOf("2") != -1) {
        if (this.form.filtrapage.length == 0)
          return [false, this.msg.filtrapage];
      }

      return [true];
    },
    extractInfo() {
      let self = this;
      // console.log(this.form);
      let check = this.dataChecked();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }

      this.form.applicationid = this.actions;

      /**
       * 组合数据
       * 如果是多项已编辑状态，或者单项情况，则获取form中已编辑数据
       * 如果是多项未编辑状态，则获取各自原始数据
       */
      let option = [];
      if (this.editArray.length > 0) {
        this.editArray.forEach(v => {
          let obj = {};
          obj.adAccount = this.mutilstatus.campaign
            ? "act_" + v.accountId
            : this.form.campaign.split("|")[1];
          obj.adSet = v.adsetId;
          obj.adSetName = this.mutilstatus.name ? v.name : this.form.name;
          obj.applicationId = this.form.applicationid;
          obj.dynamicCreative = v.isDynamicCreative;
          /**
           * 受众
           * 20190214新增
           */
          if (this.mutilstatus.target) {
            obj.includeAudience = v.included;
            obj.excludeAudience = v.excluded;
          } else {
            obj.includeAudience = this.form.target;
            obj.excludeAudience =
              this.form.iftarget[0] == "1" ? [] : this.form.notarget;
          }
          /**
           * 竞价 竞价上限
           */
          if (this.mutilstatus.bid) {
            obj.bidAmount =
              v.bidAmount === "" ? null : parseInt(v.bidAmount * 100);
            obj.billingType = v.bid;
          } else {
            obj.bidAmount =
              this.form.maxbid === "" ? null : parseInt(this.form.maxbid * 100);
            obj.billingType = this.form.bid;
          }
          /**
           * 预算连锁，包括预算金额，投放日期，投放时段，星期，时间
           */
          if (this.mutilstatus.moneytype) {
            obj.budgetType = v.moneytype;
            if (obj.budgetType == "day_budget")
              obj.dayBudget = parseInt(v.dailyBudget * 100);
            else obj.totalBudget = parseInt(v.lifetimeBudget * 100);
            obj.startTime = obj.budgetType == "day_budget" ? null : v.startTime;
            obj.endTime = obj.budgetType == "day_budget" ? null : v.endTime;
            obj.scheduleType =
              obj.budgetType == "day_budget" ? null : v.timerange;
            obj.days =
              obj.budgetType == "total_budget" && obj.scheduleType == "schedule"
                ? v.weekday.map(v => parseInt(v) + 1)
                : null;
            obj.startMinute =
              obj.budgetType == "total_budget" && obj.scheduleType == "schedule"
                ? `${parseInt(v.startMinute / 60)}:${v.startMinute % 60}`
                : null;
            obj.endMinute =
              obj.budgetType == "total_budget" && obj.scheduleType == "schedule"
                ? `${parseInt(v.endMinute / 60)}:${v.endMinute % 60}`
                : null;
          } else {
            obj.budgetType = this.form.moneytype;
            if (obj.budgetType == "day_budget")
              obj.dayBudget = parseInt(this.form.money * 100);
            else obj.totalBudget = parseInt(this.form.money * 100);
            obj.startTime =
              obj.budgetType == "day_budget"
                ? null
                : new Date(this.form.date[0]).getTime();
            obj.endTime =
              obj.budgetType == "day_budget"
                ? null
                : new Date(this.form.date[1]).getTime();
            obj.scheduleType =
              obj.budgetType == "day_budget" ? null : this.form.timerange;
            obj.days =
              obj.budgetType == "total_budget" && obj.scheduleType == "schedule"
                ? this.form.rdate
                : null;
            obj.startMinute =
              obj.budgetType == "total_budget" && obj.scheduleType == "schedule"
                ? this.$timeFormat(this.form.rtime[0], "HH") + ":00"
                : null;
            obj.endMinute =
              obj.budgetType == "total_budget" && obj.scheduleType == "schedule"
                ? this.$timeFormat(this.form.rtime[1], "HH") + ":00"
                : null;
          }
          obj.campaignList = [v.campaignId];
          obj.country = this.mutilstatus.country
            ? v.country
            : this.form.country;

          /**
           * 平台特殊情况，包括系统版本以及设备
           * 如果平台为多种情况
           * 则系统版本以及设备都无法修改
           */
          obj.platform = v.platform;
          if (this.mutilstatus.platform) {
            obj.device =
              v.platform == "itunes"
                ? v.equip.filter(v => v == "iPhone" || v == "iPad")
                : v.equip.filter(v => v == "Android_Smartphone");
            obj.minVersion = v.lowversion;
            obj.maxVersion = v.highversion;
          } else {
            if (this.mutilstatus.equip) {
              obj.device =
                v.platform == "itunes"
                  ? v.equip.filter(v => v == "iPhone" || v == "iPad")
                  : v.equip.filter(v => v == "Android_Smartphone");
            } else {
              obj.device =
                v.platform == "itunes"
                  ? this.form.equip.filter(v => v == "iPhone" || v == "iPad")
                  : this.form.equip.filter(v => v == "Android_Smartphone");
            }
            obj.minVersion = this.mutilstatus.version
              ? v.lowversion
              : this.form.lowversion;
            obj.maxVersion = this.mutilstatus.version
              ? v.highversion
              : this.form.highversion;
          }
          /**
           * 用户过滤，过滤主页
           */
          if (this.mutilstatus.filtra) {
            obj.filteAttentionUser = v.filtrapage;
            obj.filteInstalledUser = v.filtra.indexOf("1") != -1 ? "yes" : "";
          } else {
            obj.filteAttentionUser =
              this.form.filtra.indexOf("2") != -1 ? this.form.filtrapage : [];
            obj.filteInstalledUser =
              this.form.filtra.indexOf("1") != -1 ? "yes" : "";
          }
          obj.gender = this.mutilstatus.sex ? v.sex : this.form.sex;
          obj.interest = this.mutilstatus.interest
            ? v.interest
            : this.form.interest;
          obj.locales = this.mutilstatus.language
            ? v.language
            : this.form.language;
          obj.maxAge = this.mutilstatus.age ? v.maxage : this.form.age[1];
          obj.minAge = this.mutilstatus.age ? v.minage : this.form.age[0];
          /**
           * 版位
           */
          if (this.mutilstatus.auto) {
            obj.position = v.verpla;
          } else {
            obj.position = this.form.auto[0] == "1" ? [] : this.form.verpla;
          }

          option.push(obj);
        });

        // console.log(option);

        return option;
      }

      return this.form;
    },
    toGetsystem() {
      let os = this.form.platform == "itunes" ? "ios" : "android";
      this.form.version = "";
      this.$store.dispatch("getSystem", { os });
    },
    reset() {
      this.SETSTATE({ k: "createcampaignlist", v: [] });
      this.SETSTATE({ k: "adapplist", v: [] });
      this.SETSTATE({ k: "genertarget", v: [] });
      this.editArray = [];

      let action = this.form.action;
      this.form = {
        campaign: "",
        name: "",
        country: [],
        action: action,
        platform: "",
        target: [],
        notarget: [],
        iftarget: ["1"],
        lowversion: "",
        highversion: "",
        moneytype: "day_budget",
        money: "",
        date: [],
        timerange: "allday",
        rdate: [],
        rtime: [
          new Date(2016, 9, 10, 0, 0, 0),
          new Date(2016, 9, 10, 23, 0, 0)
        ],
        equip: [],
        sex: 0,
        age: [13, 65],
        language: [],
        interest: [],
        auto: ["1"],
        verpla: ["facebook", "instagram"],
        bid: "cpi",
        maxbid: "0.02",
        filtra: ["1", "2"],
        filtrapage: []
      };

      this.mutilstatus = {};
      this.mutil = {
        campaign: false,
        name: false,
        country: false,
        action: false,
        platform: false,
        version: false,
        moneytype: false,
        equip: false,
        sex: false,
        age: false,
        language: false,
        interest: false,
        auto: false,
        bid: false,
        filtra: false
      };
    },
    initData(status) {
      // 初始化置空受众列表
      this.SETSTATE({ k: "genertarget", v: [] });
      /**
       * 创建初始化获取已选广告账户
       * 如果已选多个，则显示为空，当前只能单选
       * 如果只选了一个，则默认当前选择广告账户
       */
      if (this.campainsortlist.length > 1) {
        this.form.campaign = "";
      } else {
        this.form.campaign =
          this.campainsortlist.length == 0
            ? ""
            : this.campainsortlist[0].campaignId +
              "|act_" +
              this.campainsortlist[0].accountId;
      }

      if (this.form.campaign) {
        // 初始化获取广告系列列表
        this.$store.dispatch("getCreateCampaignlist", {
          keyword: this.campainsortlist[0].campaignId,
          projectId: this.$route.params.id
        });
      }

      if (this.actions) {
        this.form.action = this.actions;
        this.$store.dispatch("getCreatePlatform", {
          applicationid: this.form.action
        });
      }
      // 初始化重置是否已改动状态
      setTimeout(() => {
        this.$emit("changeEdit", false);
      }, 100);
    }
  },
  computed: {
    ...mapState([
      "campainsortlist",
      "createcampaignlist",
      "othercountries",
      "language",
      "interests",
      "adapplist",
      "itemlist",
      "system",
      "createplatform",
      "createallpagelist",
      "editadsetlist",
      "genertarget"
    ]),
    equip() {
      return this.form.platform;
    },
    actions() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id)
        .applicationId;
    }
  },
  mounted() {
    // 新建编辑实例，绑定到操作按钮上
    this.$textCopy("#copyButtonAdset");
  },
  watch: {
    editadsetlist(n, o) {
      if (n.length > 0) {
        // 保存原始编辑数据
        this.editArray = n;

        // 特殊情况，应用
        this.form.action =
          [...new Set(n.map(v => v.applicationId))].length > 1
            ? ""
            : n[0].applicationId;

        this.form.campaign =
          [...new Set(n.map(v => v.campaignId))].length > 1
            ? ""
            : n[0].campaignId + "|act_" + n[0].accountId;
        this.form.name =
          [...new Set(n.map(v => v.name))].length > 1 ? "" : n[0].name;
        this.form.activecreate =
          [...new Set(n.map(v => v.isDynamicCreative))].length > 1
            ? ""
            : n[0].isDynamicCreative;
        // 20190214新增受众
        this.form.target = n.length > 1 ? [] : n[0].included;
        this.form.notarget = n.length > 1 ? [] : n[0].excluded;
        this.form.iftarget =
          n.length == 1 && n[0].excluded.length > 0 ? [] : ["1"];

        this.form.country = !this.$equalArray(n.map(v => v.country))
          ? []
          : n[0].country;
        this.form.platform =
          [...new Set(n.map(v => v.platform))].length > 1 ? "" : n[0].platform;
        // 可编辑情况下，获取系统版本列表
        if (this.form.platform) this.toGetsystem();
        this.form.lowversion =
          [...new Set(n.map(v => v.lowversion))].length > 1 ||
          [...new Set(n.map(v => v.highversion))].length > 1
            ? ""
            : n[0].lowversion;
        if (this.form.lowversion) this.form.highversion = n[0].highversion;

        // 如果有一项内容不相同，则预算模块为多项内容
        let mt = true;
        if (
          [...new Set(n.map(v => v.moneytype))].length > 1 ||
          (n[0].moneytype == "day_budget" &&
            [...new Set(n.map(v => v.dailyBudget))].length > 1) ||
          (n[0].moneytype == "total_budget" &&
            [...new Set(n.map(v => v.lifetimeBudget))].length > 1) ||
          [...new Set(n.map(v => v.startTime))].length > 1 ||
          [...new Set(n.map(v => v.endTime))].length > 1 ||
          [...new Set(n.map(v => v.startMinute))].length > 1 ||
          [...new Set(n.map(v => v.endMinute))].length > 1 ||
          !this.$equalArray(n.map(v => v.weekday))
        ) {
          mt = false;
        }
        this.form.moneytype = !mt ? "" : n[0].moneytype;
        if (this.form.moneytype) {
          if (this.form.moneytype == "day_budget") {
            this.form.money = parseFloat(n[0].dailyBudget / 100);
          } else {
            this.form.money = parseFloat(n[0].lifetimeBudget / 100);
            this.form.date = [new Date(n[0].startTime), new Date(n[0].endTime)];
            this.form.timerange = n[0].timerange;
            if (this.form.timerange == "schedule") {
              this.form.rdate = n[0].weekday.map(v => parseInt(v) + 1);
              this.form.rtime = [
                new Date(2016, 9, 10, parseInt(n[0].startMinute / 60), 0, 0),
                new Date(2016, 9, 10, parseInt(n[0].endMinute / 60), 0, 0)
              ];
            }
          }
        }
        this.form.equip = !this.$equalArray(n.map(v => v.equip))
          ? []
          : n[0].equip;
        this.form.sex =
          [...new Set(n.map(v => v.sex))].length > 1 ? null : n[0].sex;
        this.form.age =
          [...new Set(n.map(v => v.minage))].length > 1 ||
          [...new Set(n.map(v => v.maxage))].length > 1
            ? [13, 65]
            : [parseInt(n[0].minage), parseInt(n[0].maxage)];
        this.form.language = !this.$equalArray(n.map(v => v.language))
          ? []
          : n[0].language;
        this.form.interest = !this.$equalArray(n.map(v => v.interest))
          ? []
          : n[0].interest;
        let auto = this.$equalArray(n.map(v => v.verpla));
        this.form.verpla = !auto ? [] : n[0].verpla;
        this.form.auto = auto && n[0].verpla.length == 0 ? ["1"] : [];
        this.form.bid =
          [...new Set(n.map(v => v.bid))].length > 1 ||
          [...new Set(n.map(v => v.bidAmount))].length > 1
            ? ""
            : n[0].bid;
        if (this.form.bid) {
          this.form.maxbid = n[0].bidAmount ? n[0].bidAmount / 100 : "";
        }
        this.form.filtra =
          !this.$equalArray(n.map(v => v.filtra)) ||
          !this.$equalArray(n.map(v => v.filtrapage))
            ? []
            : n[0].filtra;
        if (this.form.filtra.indexOf("2") != -1) {
          this.form.filtrapage = n[0].filtrapage;
          // 不存在数据库的主页，添加进去
          let filarr = this.createallpagelist;
          filarr = filarr.filter(v => this.form.filtrapage.indexOf(v.id) == -1);
          filarr = filarr.concat(n[0].filtrapageObj);
          // console.log(filarr);
          this.SETSTATE({ k: "createallpagelist", v: filarr });
        }

        this.mutil = {
          campaign: !this.form.campaign ? true : false,
          name: !this.form.name ? true : false,
          activecreate: this.form.activecreate === "" ? true : false,
          country: this.form.country.length == 0 ? true : false,
          target: n.length > 1 ? true : false,
          action: !this.form.action ? true : false,
          platform: !this.form.platform ? true : false,
          version: !this.form.lowversion ? true : false,
          moneytype: !this.form.moneytype ? true : false,
          equip: this.form.equip.length == 0 ? true : false,
          sex: this.form.sex === null ? true : false,
          age:
            [...new Set(n.map(v => v.minage))].length > 1 ||
            [...new Set(n.map(v => v.maxage))].length > 1
              ? true
              : false,
          language: this.form.language.length == 0 ? true : false,
          interest:
            n.length > 1 && this.form.interest.length == 0 ? true : false,
          auto: !auto ? true : false,
          bid: !this.form.bid ? true : false,
          filtra: this.form.filtra.length == 0 ? true : false
        };

        this.mutilstatus = Object.assign({}, this.mutil);

        if (this.form.campaign) {
          // 初始化获取广告系列列表
          this.$store.dispatch("getCreateCampaignlist", {
            keyword: n[0].campaignId,
            projectId: this.$route.params.id
          });
        }
        // 初始化获取受众列表
        let fb_account_ids = [...new Set(n.map(v => v.accountId))]
          .map(v => `act_${v}`)
          .join(",");
        this.$store.dispatch("generTargetList", { fb_account_ids });
        // 先获取应用信息，再添加到列表中，已做显示
        if (this.form.action) {
          this.$store.dispatch("getAppInfo", this.form.action);
          this.$store.dispatch("getCreatePlatform", {
            applicationid: this.form.action
          });
        }

        // 初始化重置是否已改动状态
        setTimeout(() => {
          this.$emit("changeEdit", false);
        }, 100);
      }
    },
    actions(n, o) {
      if (n) {
        let applicationid = n;
        this.$store.dispatch("getCreatePlatform", { applicationid });
        this.form.action = n;
      }
    },
    equip(n, o) {
      this.form.equip =
        n == "google_play" ? ["Android_Smartphone"] : ["iPhone", "iPad"];
    },
    "form.campaign": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.name": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.country": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.platform": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.lowversion": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.highversion": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.moneytype": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.money": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.sex": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.language": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.interest": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.bid": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.maxbid": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.filtrapage": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.bidguide {
  position: absolute;
  top: 0;
  right: 20px;
}
.selectOption {
  height: auto;
  .lineList {
    display: block;
  }
  .lineListid {
    display: block;
    font-size: 12px;
    color: #999;
  }
}
.form {
  width: 420px;
  .tipfont {
    color: #999;
    font-size: 12px;
    margin-left: 10px;
  }
  .activecreate {
    width: 110%;
  }
  .select {
    width: 100%;
  }
  .formselect {
    width: 100%;
  }
  .versionline {
    width: 100%;
  }
  .lowversionselect {
    width: 38%;
  }
  .versionselect {
    width: 47%;
  }
  .timerange {
    width: 160%;
  }
  .moneyinput {
    position: relative;
    overflow: hidden;
    .moneyus {
      position: absolute;
      z-index: 9;
      left: 8px;
      font-size: 18px;
    }
    .minput {
      // width: 200px;
    }
  }
}
.adnum {
  margin-right: 10px;
}
</style>
