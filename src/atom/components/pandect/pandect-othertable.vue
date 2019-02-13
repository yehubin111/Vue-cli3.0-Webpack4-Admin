<template>
  <div class="tablelist">
    <p class="download">
      <span @click="outListOption">
        <i class="el-icon-tickets"></i>
        自定义列
      </span>
      <span @click="outTable">导出全部
        <svg-icon svgclass="save" svgname="save"></svg-icon>
      </span>
    </p>
    <el-table
      id="outOther"
      :data="onlyapplist"
      style="width: 100%"
      @sort-change="toSort"
      @filter-change="toFilter"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column
        :prop="item.key"
        v-for="(item,index) in customOption"
        :key="index"
        :fixed="!item.checked"
        :label="item.name"
        :filter-method="item.name == '国家'?filterTag: (item.name == '平台'?filterTag2:null)"
        filter-placement="bottom-end"
        :filters="item.name == '国家'?countryfilter: (item.name == '平台'?platFilters:null)"
        :sortable="item.name != '日期' && item.name != '国家' && item.name != '平台' && !item.isevent? 'custom' : false"
        width="100"
      >
        <template slot-scope="scope">
          <p>{{scope.row[item.key] || scope.row[item.key] === 0 || scope.row[item.key] === "0"?scope.row[item.key]:'--' }}</p>
        </template>
      </el-table-column>
    </el-table>
    <list-option
      :status="status"
      @outOption="outOption"
      @hideOptionbox="hideOptionbox"
      :customEvent="customevent"
      :customUnit="customunit"
      :opDefault="opDefault"
      :setDefaultOption="setDefaultOption"
      ref="pandectOption"
    ></list-option>
  </div>
</template>

<script>
import ListOption from "./pandect-listoption";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  props: ["name"],
  components: {
    ListOption
  },
  data() {
    return {
      sortObj: {
        reachNum: "reach_num",
        showNum: "show_num",
        clicksNum: "clicks_num",
        ctr: "ctr",
        cvr: "cvr",
        cpm: "cpm",
        cpc: "cpc",
        installsNum: "installs_num",
        spend: "spend",
        cpi: "cpi",
        afImpressionsNum: "af_impressions_num",
        afClicksNum: "af_clicks_num",
        afCtr: "af_ctr",
        afInstallsNum: "af_installs_num",
        afMinsRate: "af_minsRrate",
        afCvr: "af_cvr",
        afRetentionRate: "af_retentionRate",
        afSessionsNum: "af_sessions_num",
        loyalUsersNum: "af_loyal_users_num",
        afLui: "af_lui",
        totalRevenue: "af_total_revenue",
        totalCost: "af_total_cost",
        afRoi: "af_roi",
        afArpu: "af_arpu",
        afCpi: "af_cpi",
        afEcpi: "af_ecpi",
        retentionNum1: "retentionNum1",
        retentionNum2: "retentionNum2",
        retentionNum3: "retentionNum3",
        retentionNum4: "retentionNum4",
        retentionNum5: "retentionNum5",
        retentionNum6: "retentionNum6",
        retentionNum7: "retentionNum7",
        afReRate1: "afReRate1",
        afReRate2: "afReRate2",
        afReRate3: "afReRate3",
        afReRate4: "afReRate4",
        afReRate5: "afReRate5",
        afReRate6: "afReRate6",
        afReRate7: "afReRate7"
      },
      status: false,
      opDefault: [
        { name: "日期", key: "insightDateFormat" },
        { name: "国家", key: "country" },
        { name: "平台", key: "userOs" }
      ],
      setDefaultOption: [],
      // defaultListOption: [],
      customOption: [], // 自定义列配置, 默认+常用
      // customOption: , //
      filters: {
        country: [],
        imporession: []
      },
      platFilters: [
        { text: "Android", value: "imporession_Android" },
        { text: "iOS", value: "imporession_iOS" }
      ]
    };
  },
  created() {
    this.setDefaultOption =
      localStorage.getItem(pandectOptionLS.new) &&
      JSON.parse(localStorage.getItem(pandectOptionLS.new))[this.appdataappid]
        ? JSON.parse(localStorage.getItem(pandectOptionLS.new))[
            this.appdataappid
          ]
        : [
            // { name: '广告系列名称', key: '' },
            { name: "触达", key: "reachNum", checked: true },
            { name: "展示", key: "showNum", checked: true },
            { name: "点击", key: "clicksNum", checked: true },
            { name: "CTR", key: "ctr", checked: true },
            { name: "CVR", key: "cvr", checked: true },
            { name: "CPM", key: "cpm", checked: true },
            { name: "CPC", key: "cpc", checked: true },
            { name: "安装", key: "installsNum", checked: true },
            { name: "花费", key: "spend", checked: true },
            { name: "CPI", key: "cpi", checked: true }
          ];
    this.customOption = this.opDefault.concat(this.setDefaultOption);
    // 20190102新增字段af_次日留存率，非tiktok不显示
    if (this.appdataappid != "597615686992125") {
      this.customOption = this.customOption.filter(
        v => v.name != "AF_次日留存率"
      );
    }
  },
  watch: {
    appdataappid(n, o) {
      if (n) {
        this.setDefaultOption =
          localStorage.getItem(pandectOptionLS.new) &&
          JSON.parse(localStorage.getItem(pandectOptionLS.new))[n]
            ? JSON.parse(localStorage.getItem(pandectOptionLS.new))[n]
            : [
                // { name: '广告系列名称', key: '' },
                { name: "触达", key: "reachNum", checked: true },
                { name: "展示", key: "showNum", checked: true },
                { name: "点击", key: "clicksNum", checked: true },
                { name: "CTR", key: "ctr", checked: true },
                { name: "CVR", key: "cvr", checked: true },
                { name: "CPM", key: "cpm", checked: true },
                { name: "CPC", key: "cpc", checked: true },
                { name: "安装", key: "installsNum", checked: true },
                { name: "花费", key: "spend", checked: true },
                { name: "CPI", key: "cpi", checked: true }
              ];

        this.customOption = this.opDefault.concat(this.setDefaultOption);
        // 20190102新增字段af_次日留存率，非tiktok不显示
        if (n != "597615686992125") {
          this.customOption = this.customOption.filter(
            v => v.name != "AF_次日留存率"
          );
        }
      }
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    getSummaries(param) {
      let { columns, data } = param;
      let sums = [];
      columns.forEach((column, index) => {
        switch (index) {
          case 0:
            sums[index] = "合计";
            break;
          case 1:
          case 2:
            sums[index] = "";
            break;
          default:
            let d = this.appcpitotal[column.property] || this.appcpitotal[column.property] === 0
              ? this.appcpitotal[column.property]
              : "";
            sums[index] = d;
            break;
        }
      });

      return sums;
    },
    filterJudge(name) {
      if (name == "国家") {
        return this.countryfilter;
      }
      if (name == "平台") {
        return [
          { text: "Android", value: "imporession_Android" },
          { text: "iOS", value: "imporession_iOS" }
        ];
      }
    },
    outListOption() {
      // this.$emit('showOptionbox');
      this.status = true;

      this.$refs.pandectOption.showBox();
    },
    outOption(opt, selectOption, localEvent) {
      // console.log(opt);
      this.customOption = opt;
      // 20190102新增字段af_次日留存率，非tiktok不显示
      if (this.appdataappid != "597615686992125") {
        this.customOption = this.customOption.filter(
          v => v.name != "AF_次日留存率"
        );
      }
      this.setDefaultOption = [];
      selectOption.forEach(v => {
        this.setDefaultOption.push(Object.assign({}, v));
      });
      /**
       * 20181116新增，根据appid存储自定义列配置
       * 解决不同app不同事件问题
       */
      let pandectOption = localStorage.getItem(pandectOptionLS.new);
      if (!pandectOption) {
        pandectOption = {};
      } else pandectOption = JSON.parse(pandectOption);

      pandectOption[this.appdataappid] = selectOption;
      localStorage.setItem(pandectOptionLS.new, JSON.stringify(pandectOption));

      let pandectEvent = localStorage.getItem(pandectEventLS.new);
      if (!pandectEvent) {
        pandectEvent = {};
      } else pandectEvent = JSON.parse(pandectEvent);

      pandectEvent[this.appdataappid] = localEvent;
      localStorage.setItem(pandectEventLS.new, JSON.stringify(pandectEvent));

      this.$store.dispatch("selectApp");
      // this.status = false;
    },
    hideOptionbox() {
      this.status = false;
    },
    toSort({ column, prop, order }) {
      // console.log(column, prop, order);
      if (!prop) {
        this.SETSTATE({ k: "appdatasort", v: "" });
        return;
      }
      let k = "appdatasort";
      let v = this.sortObj[prop];

      if (order == "ascending") v += " asc";
      else v += " desc";

      this.SETSTATE({ k, v });

      this.$store.dispatch("selectApp");
    },
    toFilter(filters) {
      // console.log(filters);

      for (let i in filters) {
        this.filters[i] = filters[i];
      }

      let countryar = [];
      let imporessionar = [];

      for (let p in this.filters) {
        this.filters[p].forEach(v => {
          if (v.indexOf("country") != -1) {
            countryar.push(v.split("_")[1]);
          }
          if (v.indexOf("imporession") != -1) {
            imporessionar.push(v.split("_")[1]);
          }
        });
      }

      let k = "appdatacountry";
      let v = countryar.join(",");
      this.SETSTATE({ k, v });

      k = "appdataimporession";
      v = imporessionar.join(",");
      this.SETSTATE({ k, v });

      this.$store.dispatch("selectApp");
    },
    outTable() {
      let name = `${this.name}每日CPI${this.$timeFormat(
        new Date(),
        "yyyyMMddHHmmss"
      )}`;

      this.$store.dispatch("selectAppout", name);
    },
    filterTag(value, row) {
      // return row.gj === value;
      return true;
    },
    filterTag2(value, row, column) {
      // return row.pt === value;
      return true;
    }
  },
  computed: {
    ...mapState([
      "appdataall",
      "customevent",
      "customunit",
      "appdataappid",
      "appcpitotal"
    ]),
    ...mapGetters(["onlyapplist", "countryfilter"])
  }
};
</script>

<style lang="less">
.tablelist {
  .download {
    font-size: 14px;
    color: #3297ff;
    text-align: right;
    line-height: 20px;
    margin-bottom: 5px;
    span {
      position: relative;
      padding-right: 24px;
      display: inline-block;
      cursor: pointer;
      .save {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 0;
        top: 2px;
        cursor: pointer;
      }
    }
  }
}
</style>
