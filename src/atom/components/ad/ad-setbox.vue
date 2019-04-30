<template>
  <div class="outbox">
    <div class="ctrlbutton">
      <div class="createbutton">
        <el-button type="primary" @click="createAd">创建</el-button>
      </div>
      <el-dropdown
        class="select"
        split-button
        type="primary"
        @click="toCtrlAll('Edit')"
        @command="handleCommand"
      >
        编辑
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="tocreate" command="a" :disabled="archivedbutton">开启</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="b" :disabled="archivedbutton">关闭</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="c" :disabled="archivedbutton">重命名</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="d" :disabled="archivedbutton">查找替换</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="createbutton">
        <el-button
          type="text"
          icon="el-icon-news"
          @click="toCtrlAll('Copy')"
          :disabled="archivedbutton"
        >复制</el-button>
      </div>
      <div class="createbutton">
        <el-button
          type="text"
          icon="el-icon-menu"
          @click="toCtrlAll('ARCHIVED')"
          :disabled="archivedbutton"
        >归档</el-button>
      </div>
      <div class="createbutton">
        <el-button type="text" icon="el-icon-delete" @click="toCtrlAll('DELETED')">删除</el-button>
      </div>
      <div class="createbutton">
        <el-dropdown @command="ruleCtrl">
          <span class="el-dropdown-link">
            规则
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a" :disabled="mutilselect.length == 0">创建规则</el-dropdown-item>
            <el-dropdown-item command="b" :disabled="mutilselect.length == 0">应用现有规则</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <p class="download">
        <span @click="outTable" :style="{color: exportstatus?'': '#999'}">
          导出全部
          <svg-icon svgname="save" svgclass="save" :style="{color: exportstatus?'': '#999'}"></svg-icon>
        </span>
      </p>
      <div class="at-dropdown" @mouseenter="sortDown = !sortDown" @mouseleave="searchStatus">
        <p class="theme">
          <span>
            细分数据
            <i class="el-icon-arrow-down"></i>
          </span>
        </p>
        <div class="droplist" v-show="sortDown" :style="{width: firstSearch? '280px':'160px'}">
          <div class="listarr" id="firstList">
            <div
              class="list"
              @mouseenter="sweepCare"
              @click="clearCare"
              v-show="this.careData.length > 0"
            >清空所有细分</div>
            <div
              class="list"
              v-for="(lst, lsindex) in searchList"
              :key="lsindex"
              @mouseenter="searchClick(lst.name, lst.key, lst.importkey)"
              @click="selectCare('', lst.importkey)"
            >
              {{lst.name}}
              <i class="el-icon-caret-right" v-if="!lst.importkey"></i>
            </div>
          </div>
          <div class="listarr rightarr" id="secondList">
            <div
              :class="{list: true, selected: scd.checked}"
              v-for="(scd, sindex) in secondSearchList"
              :key="sindex"
              @click="selectCare(scd.key, scd.key)"
            >{{scd.cname}}</div>
          </div>
        </div>
      </div>
      <div class="autolist">
        <span @click="importRemain">
          <i class="el-icon-download"></i>
          导入留存
        </span>
        <div class="autooption" @mouseenter="optionmenu = true" @mouseleave="optionmenu = false">
          <span class="el-dropdown-link">
            自定义列
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <transition name="fade">
            <div class="optionlist" v-show="optionmenu">
              <p :class="{on: optionselect == 'default'}" @click="optionSelect('default')">
                <span class="name">常用</span>
              </p>
              <p
                :class="{on: optionselect == item.name}"
                v-for="(item, index) in saveoption"
                :key="index"
                @click="optionSelect(item.name)"
              >
                <span class="name" :title="item.name">{{item.name}}</span>
                <i class="el-icon-close other" @click.stop="deleteOption(item.id, item.name)"></i>
              </p>
              <p :class="{on: optionselect == 'auto'}">
                <span class="name" @click="outListOption">自定义</span>
                <span class="other" v-show="optionselect == 'auto'" @click.stop="saveOption">保存</span>
              </p>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="timeout" v-show="adlisttimeout">
      加载失败请
      <el-button type="text" @click="toGetdata(false)">重试</el-button>
    </div>
    <div class="list" id="AdList" v-show="!adlisttimeout">
      <ad-setlist
        :customOption="customOptionDefault"
        @toCopy="toCopy"
        @toEdit="toEdit"
        @reName="reName"
        @mutilSelect="mutilSelect"
        :type="type"
        @tableSort="tableSort"
        @tabJump="tabJump"
        @setRule="setRule"
      ></ad-setlist>
    </div>
    <div class="pageswitch" v-show="!adlisttimeout">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageSwitch"
        :current-page="pageindex"
        :page-sizes="[20, 50, 80]"
        :page-size="adpagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="adtotal"
      ></el-pagination>
    </div>
    <ad-rename ref="reName" :type="type"></ad-rename>
  </div>
</template>

<script>
import AdSetlist from "./ad-setlist";
import AdRename from "./ad-rename";
import { mapState, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
let search;
export default {
  props: ["opDefault", "type", "defaultOption"],
  data() {
    return {
      optionmenu: false,
      sortDown: false,
      firstSearch: "",
      firstKey: "",
      secondSearchList: [],
      state: "",
      value2: "",
      customOption: this.defaultOption.concat(this.opDefault), // 自定义列配置, 默认+常用
      pageindex: 1,
      mutilselect: [],
      archivedbutton: false,
      sort: "",
      order: true,
      statuslist: [
        {
          name: "不限",
          code: "-1"
        },
        {
          name: "投放中",
          code: "ACTIVE"
        },
        {
          name: "已暂停",
          code: "PAUSED"
        },
        {
          name: "已归档",
          code: "ARCHIVED"
        },
        {
          name: "已删除",
          code: "DELETED"
        }
      ]
    };
  },
  components: {
    AdSetlist,
    AdRename
  },
  mounted() {},
  watch: {},
  methods: {
    ...mapMutations(["SETSTATE"]),
    optionSelect(key) {
      this.$emit("optionSelect", key);
    },
    deleteOption(id, name) {
      this.$emit("deleteSaveSearch", id, '2', name);
    },
    saveOption() {
      this.$emit("setCondition", "2");
    },
    ruleCtrl(key) {
      if ([...new Set(this.mutilselect.map(v => v.accountId))].length > 1) {
        Msgwarning("暂不支持跨广告账户设置规则，请选择同一个广告账户下的对象");
        return;
      }
      switch (key) {
        case "a":
          this.$emit("ruleAdd", this.mutilselect, this.type);
          break;
        case "b":
          this.$emit("ruleCreate", this.mutilselect, this.type);
          break;
      }
    },
    setRule(id) {
      this.$emit("ruleRemove", id, this.type);
    },
    tabJump(tabname, row, type) {
      this.$emit("tabJump", tabname, row, type);
    },
    toEdit(id, name) {
      this.$emit("wantEdit", this.type, id, name);
    },
    toCopy(option, accountId) {
      this.$emit("wantCopy", this.type, option, accountId);
    },
    // 初始化细分，用于切换页面时初始化细分选项
    resetCare() {
      this.searchList.forEach(v => {
        v.list.forEach(g => {
          g.checked = false;
        });
      });

      this.SETSTATE({ k: "careData", v: [] });
    },
    // 清空细分数据
    clearCare() {
      this.resetCare();

      this.toGetdata();
    },
    sweepCare() {
      this.secondSearchList = [];
      this.firstSearch = "";
    },
    selectCare(key, importkey) {
      // 排除轮播以外的第一级选项，点击无需请求接口
      if (!key && importkey === undefined) return;

      this.searchList.forEach(v => {
        if (v.key == this.firstKey) {
          v.list.forEach(g => {
            g.checked = false;
          });
        }
      });
      // 如果选择的是无，则清空选项
      if (key) {
        this.secondSearchList.forEach(v => {
          if (v.key == key) {
            v.checked = true;
          }
        });
      }

      let obj = {
        key: this.firstKey,
        vl: importkey ? importkey : key
      };
      let careData = this.careData;

      careData = careData.filter(v => v.key != this.firstKey);
      careData.push(obj);
      this.SETSTATE({ k: "careData", v: careData });

      this.toGetdata();
    },
    createAd() {
      this.$emit("toCreateAd", this.type);
    },
    // 重命名
    reName(key, name) {
      this.$refs.reName.showBox(key, name);
    },
    searchStatus() {
      this.sortDown = !this.sortDown;
      this.secondSearchList = [];
      this.firstSearch = "";
    },
    searchClick(name, key, importkey) {
      /**
       * 20190212新增特殊细分数据逻辑，选择第一级之后可以直接细分，无第二级菜单
       */
      this.firstSearch = importkey ? "" : name;
      this.firstKey = key;
      this.secondSearchList = importkey
        ? []
        : this.searchList.find(v => this.firstSearch == v.name).list;
    },
    tableSort(sort) {
      this.sort = sort;
      // this.order = sort ? true : false;
      this.toGetdata(true);
    },
    adSearch() {
      let self = this;
      if (this.value == "") return;

      clearTimeout(search);
      search = setTimeout(function() {
        self.toSort();
      }, 300);
    },
    outListOption() {
      this.$emit("showOptionbox", this.type);
      // this.status = true;
    },
    importRemain() {
      this.$emit("showRemainBox", this.type);
    },
    outTable() {
      if (!this.exportstatus) return;
      // 数据超过5万条，无法导出
      if (this.adtotal > 50000) {
        Msgwarning("数据请少于5万条");
        return;
      }

      let name = `${this.projectname}${this.opDefault[0].name.replace(
        "名称",
        ""
      )}${this.$timeFormat(new Date(), "yyyyMMddHHmmss")}`;

      let outNotify = this.$notify({
        title: "正在导出...",
        message: "广告管理数据量较大，请稍等",
        duration: 0,
        showClose: false
      });
      // 改变导出按钮状态
      this.SETSTATE({ k: "exportstatus", v: false });

      let option = "";
      let k = this.typeData.optionName;
      option = this[k];
      option.pageSize = this.adtotal;
      this.$store.dispatch("getAdlist", {
        option,
        name,
        fullScreen: false,
        customOption: this.customOptionDefault,
        type: this.type,
        // order: this.order,
        // applicationid: this.applicationId,
        editType: "export",
        outNotify // notification实例
      });
    },
    toSort() {
      this.toGetdata(true);
    },
    pageSwitch(page) {
      this.pageindex = page;

      this.toGetdata();
    },
    pageSizeChange(size) {
      // this.pagesize = size;
      this.SETSTATE({ k: "adpagesize", v: size });

      this.toGetdata(true);
    },
    // changeFilterSwitch(status) {
    //   this.defaultSwitch = status ? status : false;
    // },
    sortConditionLogic(option) {
      /**
       * 20180104新增需求，筛选条件默认情况
       * @父级 已归档/已删除 @子级 已归档/已删除
       * @父级 没选/已暂停/投放中 @子级 已暂停+投放中
       * @父级 已暂停/投放中+已归档/已删除 @子级 已暂停+投放中+已归档/已删除
       */
      let kdefault = "ACTIVE,PAUSED";
      let defaultkey = option["adSetStatusStr"]
        ? "adSetStatusStr"
        : "adCampaignStatusStr";
      if (option[defaultkey]) {
        kdefault = "";
        if (
          option[defaultkey].indexOf("ACTIVE") != -1 ||
          option[defaultkey].indexOf("PAUSED") != -1
        ) {
          kdefault = "ACTIVE,PAUSED";
        }
        if (option[defaultkey].indexOf("ARCHIVED") != -1) {
          kdefault += ",ARCHIVED";
        }
        if (option[defaultkey].indexOf("DELETED") != -1) {
          kdefault += ",DELETED";
        }
      }
      this.SETSTATE({ k: "sortdefault", v: kdefault.replace(/^,/, "") });
    },
    toGetdata(pageReset) {
      // console.log('pageReset');
      let batchId = this.$route.params.bid;
      // 从本地缓存获取筛选条件
      let allCondition = localStorage.getItem(adFilterLS.new)
        ? JSON.parse(localStorage.getItem(adFilterLS.new))
        : {};
      let disCondition = allCondition[this.$route.params.id]
        ? allCondition[this.$route.params.id]
        : [];

      if (pageReset) this.pageindex = 1;

      let option = {
        pageNo: this.pageindex,
        pageSize: this.adpagesize,
        projectId: this.$route.params.id,
        batchId
      };
      if (this.sort) option.orderByCause = this.sort;
      if (this.value2) option[this.typeData.effect] = this.value2;
      if (this.state) option[this.typeData.searchKeyword] = this.state;

      // 添加细分数据
      this.careData.forEach(v => {
        if (v.vl) {
          option[v.key] = v.vl;
        }
      });
      /**
       * 20181227新增默认条件
       * 各tab分别默认各投放状态投放中and已暂停
       * 如果有操作过相关条件，则取消默认
       */
      disCondition.forEach(v => {
        if (option[v.key] && v.key != this.typeData.defaultFilter)
          option[v.key] += " and " + v.option;
        else option[v.key] = v.option;
      });
      // 设置默认条件，详情见方法注释
      this.sortConditionLogic(option);

      option[this.typeData.defaultFilter] = option[this.typeData.defaultFilter]
        ? option[this.typeData.defaultFilter]
        : this.sortdefault;

      let v = {
        ...option
      };
      // v.pageNo = 1;

      var k = this.typeData.optionName;
      this.SETSTATE({ k, v });

      this.$store.dispatch("getAdlist", {
        option,
        type: this.type,
        order: this.order,
        // applicationid: this.applicationId
      });
    },
    mutilSelect(arr) {
      this.mutilselect = arr;

      this.archivedbutton = this.mutilselect.find(
        v => v.effectiveStatus == "ARCHIVED"
      )
        ? true
        : false;
      /**
       * 只有广告系列才有的方法，筛选广告组和广告账户的列表
       * 广告系列选择了几个，广告组和广告分别对应显示几个
       * 没选则的情况下，显示全部
       *  */

      this.$emit("selectSort", arr);
    },
    async toCtrlAll(k) {
      if (this.mutilselect.length == 0) {
        Msgwarning("请先选择要处理的广告系列/广告组/广告");
        return;
      }
      if (this.mutilselect.length > 200) {
        Msgwarning("批量操作最大条数为200");
        return;
      }
      if (
        k == "Edit" &&
        this.mutilselect.find(v => v.effectiveStatus == "ARCHIVED")
      ) {
        Msgwarning("已选项中包含已归档项，已归档无法编辑");
        return;
      }
      let effectiveStatus = k,
        adIds = [];
      let option = [];
      this.mutilselect.forEach(v => {
        // 批量复制用
        let obj = {
          id: v[this.typeData.effectIdsPush],
          orgid: v[this.typeData.originalId],
          orgname: v[this.typeData.originalName]
        };
        option.push(obj);

        adIds.push(v[this.typeData.effectIdsPush]);
      });
      adIds = adIds.join(",");
      // 归档
      if (k == "ARCHIVED") {
        /**
         * 20190220 v2.2.1 新增
         * 广告在归档之前，需要先去请求其创意详情，判断是不是动态创意广告
         */
        let activead = []; // 动态创意广告
        let activeidsarr = []; // 动态创意广告id集合
        let activeids = ""; // 动态创意广告id（String）
        let activecreative = []; // 动态创意集合
        let activecreativeids = []; // 动态创意id集合
        let activenotice = ""; // confirm提示内容
        if (this.type == "adName") {
          let res = await this.$store.dispatch("creativeDetail", {
            creativeId: this.mutilselect.map(v => v.creativeId).join(","),
            fullScreen: true
          });
          let activecreative = res.data.filter(
            v => v.assetFeedSpec && v.assetFeedSpec != "null"
          );
          let activecreativeids = activecreative.map(v => v["fbCreativeId"]);
          let activead = this.mutilselect.filter(
            v => activecreativeids.indexOf(v["creativeId"]) != -1
          );
          activeidsarr = activead.map(v => v["adId"]);
          if (activeidsarr.length > 0) {
            activenotice =
              "选中了至少一条使用动态创意的广告。归档此类型广告后，广告组也会自动归档";
            // 如果有动态创意广告，则普通广告id中排除掉动态创意广告id
            adIds = adIds
              .split(",")
              .filter(v => activeidsarr.indexOf(v) == -1)
              .join(",");
            activeids = activeidsarr.join(",");
          }
        }
        this.$confirm(
          activenotice
            ? activenotice
            : `确认对${this.mutilselect.length}个${
                this.typeData.name
              }执行归档操作？归档后无法恢复`,
          "提示",
          {
            confirmButtonText: "归档",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            // 归档动态创意广告等于归档其广告组
            this.commandExecute(adIds, effectiveStatus, activeids);
          })
          .catch(() => {});
      } else if (k == "DELETED") {
        /**
         * 20190220 v2.2.1 新增
         * 广告在归档之前，需要先去请求其创意详情，判断是不是动态创意广告
         */
        let activead = []; // 动态创意广告
        let activeidsarr = []; // 动态创意广告id集合
        let activeids = ""; // 动态创意广告id（String）
        let activecreative = []; // 动态创意集合
        let activecreativeids = []; // 动态创意id集合
        let activenotice = ""; // confirm提示内容
        if (this.type == "adName") {
          let res = await this.$store.dispatch("creativeDetail", {
            creativeId: this.mutilselect.map(v => v.creativeId).join(","),
            fullScreen: true
          });
          let activecreative = res.data.filter(
            v => v.assetFeedSpec && v.assetFeedSpec != "null"
          );
          let activecreativeids = activecreative.map(v => v["fbCreativeId"]);
          let activead = this.mutilselect.filter(
            v => activecreativeids.indexOf(v["creativeId"]) != -1
          );
          activeidsarr = activead.map(v => v["adId"]);
          if (activeidsarr.length > 0) {
            activenotice =
              "选中了至少一条使用动态创意的广告。删除此类型广告后，广告组也会自动删除";
            // 如果有动态创意广告，则普通广告id中排除掉动态创意广告id
            adIds = adIds
              .split(",")
              .filter(v => activeidsarr.indexOf(v) == -1)
              .join(",");
            activeids = activeidsarr.join(",");
          }
        }
        this.$confirm(
          activenotice
            ? activenotice
            : `确认对${this.mutilselect.length}个${
                this.typeData.name
              }执行删除操作？删除后无法恢复`,
          "提示",
          {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            // 删除动态创意广告等于删除其广告组
            this.commandExecute(adIds, effectiveStatus, activeids);
          })
          .catch(() => {});
      } else if (k == "Copy") {
        if ([...new Set(this.mutilselect.map(v => v.accountId))].length > 1) {
          Msgwarning("暂不支持跨广告账户复制，请选择同一个广告账户下的对象");
          return;
        }
        let accountId = this.mutilselect[0].accountId;
        this.$emit("wantCopy", this.type, option, accountId);
      } else if (k == "Edit") {
        this.$emit(
          "wantEdit",
          this.type,
          this.mutilselect.map(v => v[this.typeData.effectIdsPush]),
          [
            [...new Set(this.mutilselect.map(v => v.campaignName))].join(","),
            [...new Set(this.mutilselect.map(v => v.adSetName))].join(","),
            [...new Set(this.mutilselect.map(v => v.adName))].join(",")
          ]
        );
      }
    },
    handleCommand(k) {
      if (this.mutilselect.length == 0) {
        Msgwarning("请先选择广告");
        return;
      }
      if (this.mutilselect.length > 200) {
        Msgwarning("批量操作最大条数为200");
        return;
      }

      let effectiveStatus,
        adIds = [];
      this.mutilselect.forEach(v => {
        // seekid 用来查找替换
        v.seekid = v[this.typeData.effectIdsPush];

        adIds.push(v[this.typeData.effectIdsPush]);
      });
      adIds = adIds.join(",");
      // 开启
      if (k == "a") {
        effectiveStatus = "ACTIVE";
        this.commandExecute(adIds, effectiveStatus);
      }
      // 关闭
      if (k == "b") {
        effectiveStatus = "PAUSED";
        this.commandExecute(adIds, effectiveStatus);
      }
      if (k == "c") {
        this.reName(adIds);
      }
      if (k == "d") {
        this.$emit("changeReplace", this.type, this.mutilselect);
      }
    },
    commandExecute(adIds, effectiveStatus, activeIds) {
      let option = {
        effectiveStatus
      };
      // console.log(this.typeData);
      option[this.typeData.effectIds] = adIds;
      option["isActiveAdIds"] = activeIds;
      this.$store.dispatch("changeAdstatus", {
        option,
        type: this.type,
        fullScreen: true
      });
    }
  },
  computed: {
    ...mapState([
      "itemlist",
      "adcampaigntotal",
      "adsettotal",
      "adadtotal",
      "ad_option",
      "campain_option",
      "set_option",
      "searchList",
      "careData",
      "adpagesize",
      "adlisttimeout",
      "exportstatus",
      "sortdefault",
      "optionselect",
      "saveoption"
    ]),
    customOptionDefault() {
      /**
       * 去除不显示的项
       * 广告系列 => 相关度、广告编号、广告组编号、广告组名称、广告系列名称、广告名称
       * 广告组 => 相关度、广告编号、广告组名称、广告名称
       * 广告 => 广告名称
       * 非Tiktok => AF_次日留存率
       */
      let optionArr = this.defaultOption;
      if (this.applicationId != "597615686992125") {
        optionArr = this.defaultOption.filter(v => v.name != "AF_次日留存率");
      }
      if (this.type == "adName") {
        return this.opDefault.concat(
          optionArr.filter(v => v.name != "广告名称")
        );
      } else if (this.type == "campaignName") {
        return this.opDefault.concat(
          optionArr.filter(
            v =>
              v.name != "相关度" &&
              v.name != "广告编号" &&
              v.name != "广告组编号" &&
              v.name != "广告组名称" &&
              v.name != "广告系列名称" &&
              v.name != "广告名称"
          )
        );
      } else {
        return this.opDefault.concat(
          optionArr.filter(
            v =>
              v.name != "相关度" &&
              v.name != "广告编号" &&
              v.name != "广告名称" &&
              v.name != "广告组名称"
          )
        );
      }
    },
    typeData() {
      let k = { name: "", effect: "", effectIds: "" };
      switch (this.type) {
        case "campaignName":
          k.name = "广告系列";
          k.effect = "adCampaignStatus";
          k.effectIds = "adCampaignIds";
          k.effectIdsPush = "campaignId";
          k.effectName = "campaignName";
          k.optionName = "campain_option";
          k.searchKeyword = "campaignName";
          k.listTotal = "adcampaigntotal";
          k.originalId = "campaignId"; // 复制所需特殊id, 复制campaign无需id
          k.originalName = "campaignName"; // 复制所需特殊name, 复制campaign无需name
          k.defaultFilter = "adCampaignStatusStr"; // 默认筛选投放状态
          break;
        case "adSetName":
          k.name = "广告组";
          k.effect = "adSetStatus";
          k.effectIds = "adSetIds";
          k.effectIdsPush = "adsetId";
          k.effectName = "adSetName";
          k.optionName = "set_option";
          k.searchKeyword = "adSetName";
          k.listTotal = "adsettotal";
          k.originalId = "campaignId";
          k.originalName = "campaignName";
          k.defaultFilter = "adSetStatusStr"; // 默认筛选投放状态
          break;
        case "adName":
          k.name = "广告";
          k.effect = "effectiveStatus";
          k.effectIds = "adIds";
          k.effectIdsPush = "adId";
          k.effectName = "adName";
          k.optionName = "ad_option";
          k.searchKeyword = "adName";
          k.listTotal = "adadtotal";
          k.originalId = "adsetId";
          k.originalName = "adSetName";
          k.defaultFilter = "adStatusStr"; // 默认筛选投放状态
          break;
      }
      return k;
    },
    adtotal() {
      let k = this[this.typeData.listTotal];
      return k;
    },
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    },
    applicationId() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id)
        .applicationId;
    }
  }
};
</script>

<style lang="less" scoped>
.pageswitch {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 50px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.ctrlbutton {
  // overflow: hidden;
  margin-bottom: 10px;
  height: 40px;
  .at-dropdown {
    float: right;
    position: relative;
    margin-right: 20px;
    margin-bottom: 10px;
    .theme {
      width: 100px;
      height: 40px;
      border-radius: 4px;
      background-color: #409eff;
      line-height: 40px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      cursor: pointer;
    }
    .droplist {
      position: absolute;
      top: 40px;
      left: -60px;
      border-radius: 5px;
      overflow: hidden;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      display: block;
      z-index: 999;
      background-color: #fff;
      .listarr {
        float: left;
        width: 160px;
        .list {
          list-style: none;
          line-height: 36px;
          padding: 0 20px;
          margin: 0;
          font-size: 14px;
          color: #606266;
          cursor: pointer;
          outline: 0;
          position: relative;
          &:hover {
            background-color: #deedfd;
            color: #3297ff;
          }
          i {
            position: absolute;
            right: 10px;
            line-height: 36px;
          }
          &.selected {
            color: #3297ff;
          }
        }
        &.rightarr {
          width: 120px;
        }
      }
    }
  }
  .createbutton {
    float: left;
    margin-right: 10px;
    line-height: 40px;
  }
  .select {
    float: left;
    margin-right: 20px;
  }
  .search {
    float: right;
    width: 200px;
    margin-left: 20px;
  }
  .selectr {
    width: 100px;
    margin-left: 20px;
    float: right;
  }
  .datebox {
    margin-left: 20px;
    float: right;
  }
  .autolist {
    font-size: 14px;
    color: #3297ff;
    text-align: right;
    float: right;
    line-height: 20px;
    margin-bottom: 5px;
    margin-right: 10px;
    & > span {
      position: relative;
      display: inline-block;
      cursor: pointer;
      line-height: 40px;
      margin-right: 20px;
    }
    .autooption {
      display: inline-block;
      position: relative;
      line-height: 40px;
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
  .download {
    font-size: 14px;
    color: #3297ff;
    text-align: right;
    float: right;
    line-height: 20px;
    margin-bottom: 5px;
    // margin-right: 25px;
    span {
      position: relative;
      padding-right: 24px;
      display: inline-block;
      cursor: pointer;
      line-height: 40px;
      .save {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 0;
        top: 12px;
        cursor: pointer;
      }
    }
  }
}
.timeout {
  text-align: center;
  font-size: 14px;
  margin: 175px 0;
}
</style>
