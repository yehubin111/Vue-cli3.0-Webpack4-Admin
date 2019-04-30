<template>
  <div class="tablelist">
    <div class="download">
      <!-- <span @click="outListOption">
        <i class="el-icon-tickets"></i>
        自定义列
      </span>-->
      <div class="autooption" @mouseenter="optionmenu = true" @mouseleave="optionmenu = false">
        <span class="el-dropdown-link">
          自定义列
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <transition name="fade">
          <div class="optionlist" v-show="optionmenu">
            <p :class="{on: pandectselect == 'default'}" @click="optionSelect('default')">
              <span class="name">常用</span>
            </p>
            <p
              :class="{on: pandectselect == item.name}"
              v-for="(item, index) in pandectsave"
              :key="index"
              @click="optionSelect(item.name)"
            >
              <span class="name" :title="item.name">{{item.name}}</span>
              <i class="el-icon-close other" @click.stop="deleteOption(item.id, item.name)"></i>
            </p>
            <p :class="{on: pandectselect == 'auto'}">
              <span class="name" @click="outListOption">自定义</span>
              <span class="other" v-show="pandectselect == 'auto'" @click.stop="saveOption">保存</span>
            </p>
          </div>
        </transition>
      </div>
      <span @click="outTable">
        导出全部
        <svg-icon svgclass="save" svgname="save"></svg-icon>
      </span>
    </div>
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
    <save-condition :status="savestatus" @save="saveCondition"></save-condition>
  </div>
</template>

<script>
import SaveCondition from "./pandect-savecondition";
import ListOption from "./pandect-listoption";
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgsuccess } from "../../js/message";
export default {
  props: ["name"],
  components: {
    ListOption,
    SaveCondition
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
      optionDefault: [
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
      ],
      optionmenu: false,
      savestatus: false
    };
  },
  async mounted() {
    console.log("mounted");
    await this.getSaveData();

    this.getTableData();
  },
  watch: {
    async appdataappid(n, o) {
      console.log("watch");
      if (n) {
        await this.getSaveData();

        this.getTableData();
      }
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    getTableData() {
      /**
       * 20190429新增逻辑
       * 初始化获取上一次操作的自定义列，可能为常用(default) or 保存的(optionname) or 自定义的(auto)
       * 保存在本地缓存 adOptionSelectLS.new 中
       * 如果为auto，则从本地缓存获取上次选的自定义列
       * 其他两种情况，从接口或者默认数据获取
       */
      console.log(this.appdataappid);
      let optionkey =
        localStorage.getItem(pandectSelectLS.new) &&
        JSON.parse(localStorage.getItem(pandectSelectLS.new))[this.appdataappid]
          ? JSON.parse(localStorage.getItem(pandectSelectLS.new))[
              this.appdataappid
            ]
          : "default";
      if (optionkey == "auto") {
        this.setDefaultOption =
          optionkey == "auto" &&
          JSON.parse(localStorage.getItem(pandectOptionLS.new))
            ? JSON.parse(localStorage.getItem(pandectOptionLS.new))[
                this.appdataappid
              ]
            : [];
        this.customOption = this.opDefault.concat(this.setDefaultOption);
      } else {
        this.optionSelect(optionkey, "init");
      }
      // 20190102新增字段af_次日留存率，非tiktok不显示
      if (this.appdataappid != "597615686992125") {
        this.customOption = this.customOption.filter(
          v => v.name != "AF_次日留存率"
        );
      }

      this.$store.dispatch("selectApp");
    },
    optionSelect(key, frm) {
      let event = [];
      if (key == "default") {
        this.setDefaultOption = this.optionDefault;
        // 保存当前事件
        this.saveLocalstorage(pandectEventLS.new, []);
      } else {
        let seek = this.pandectsave.find(v => v.name == key);
        this.setDefaultOption = seek.option;
        event = seek.event;
      }
      this.customOption = this.opDefault.concat(this.setDefaultOption);
      this.SETSTATE({ k: "pandectselect", v: key });
      // 保存选择类型
      this.saveLocalstorage(pandectSelectLS.new, key);
      // 保存当前事件
      this.saveLocalstorage(pandectEventLS.new, event);
      if (frm != "init") this.$store.dispatch("selectApp");
    },
    deleteOption(id, name) {
      this.$confirm("确定删除此已保存自定义列？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$store.dispatch("deleteSearchCondition", {
            id
          });
          if (res.data) {
            Msgsuccess("删除成功");
            this.getSaveData();
            // 如果删除了当前选择自定义列，则切换到常用
            if (type == "2" && name == this.pandectselect) {
              this.optionSelect("default");
            }
          } else {
            Msgsuccess("删除失败");
          }
        })
        .catch(() => {});
    },
    saveOption() {
      this.savestatus = true;
    },
    async saveCondition(name) {
      let option = {
        url: encodeURIComponent(
          JSON.stringify(this.setDefaultOption) +
            "@@" +
            JSON.stringify(this.localEvent)
        ),
        appId: this.appdataappid,
        userId: localStorage.getItem("atom_id"),
        tagName: name,
        tagType: "3" // 1 广告管理筛选标签 ；2 广告管理自定义列标签
      };

      let res = await this.$store.dispatch("saveTag", option);
      if (res.data) {
        Msgsuccess("保存成功");
        this.savestatus = false;
        let { appId, userId, tagName, tagType } = option;
        this.getSaveData();
      }
    },
    async getSaveData() {
      let option = {
        appId: this.appdataappid,
        userId: localStorage.getItem("atom_id"),
        tagType: "3"
      };
      return await this.$store.dispatch("getTag", option);
    },
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
            let d =
              this.appcpitotal[column.property] ||
              this.appcpitotal[column.property] === 0
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
    saveLocalstorage(name, val) {
      let appid = this.appdataappid;
      let savedata = localStorage.getItem(name);
      if (!savedata) {
        savedata = {};
      } else savedata = JSON.parse(savedata);
      savedata[appid] = val;
      localStorage.setItem(name, JSON.stringify(savedata));
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
      this.localEvent = localEvent;
      selectOption.forEach(v => {
        this.setDefaultOption.push(Object.assign({}, v));
      });
      this.SETSTATE({ k: "pandectselect", v: "auto" });
      /**
       * 20181116新增，根据appid存储自定义列配置
       * 解决不同app不同事件问题
       */
      this.saveLocalstorage(pandectOptionLS.new, selectOption);

      this.saveLocalstorage(pandectEventLS.new, localEvent);

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

      // this.SETSTATE({k: 'appdataindex', v: 1});

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

      this.SETSTATE({ k: "appdataindex", v: 1 });

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
      "appcpitotal",
      "pandectselect",
      "pandectsave"
    ]),
    ...mapGetters(["onlyapplist", "countryfilter"])
  }
};
</script>

<style lang="less" scoped>
.tablelist {
  .download {
    font-size: 14px;
    color: #3297ff;
    text-align: right;
    line-height: 20px;
    margin-bottom: 5px;
    & > span {
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
    .autooption {
      display: inline-block;
      position: relative;
      line-height: 40px;
      margin-right: 20px;
      .optionlist {
        position: absolute;
        color: #3297ff;
        top: 40px;
        left: 0px;
        border-radius: 5px;
        overflow: hidden;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        display: block;
        z-index: 999;
        background-color: #fff;
        p {
          width: 140px;
          text-align: left;
          line-height: 40px;
          height: 40px;
          padding: 0 10px;
          cursor: pointer;
          .other {
            float: right;
            line-height: 40px;
            color: #3297ff;
          }
          &:hover {
            background-color: #deedfd;
            color: #3297ff;
          }
          .name {
            color: #666;
            width: 100px;
            overflow: hidden;
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
            height: 40px;
          }
          &.on {
            .name {
              color: #000;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
