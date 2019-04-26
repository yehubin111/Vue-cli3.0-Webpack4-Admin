<template>
  <div class="ad" :style="{height: documentHeight + 'px'}">
    <el-breadcrumb class="title" separator=">">
      <el-breadcrumb-item>项目{{projectname}}</el-breadcrumb-item>
      <el-breadcrumb-item>广告管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ctrlbutton">
      <el-select
        class="selectAccount"
        v-model="value3"
        filterable
        multiple
        collapse-tags
        placeholder="广告账户"
        @change="toSortAccount"
      >
        <el-option
          v-for="item in commonaccount"
          :key="item.fbId"
          :label="item.name + (item.fbId != -1?'('+item.fbId+')':'')"
          :value="item.fbId"
          :disabled="item.accountStatus != 1"
        ></el-option>
      </el-select>
      <!-- <el-select class="select" v-model="value4" placeholder="推广计划" @change="toSortPlan">
        <el-option v-for="item in adplanlist" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>-->
      <el-date-picker
        class="datebox"
        v-model="date"
        type="daterange"
        range-separator="至"
        :clearable="false"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateSort"
      ></el-date-picker>
    </div>
    <div class="ctrlbutton">
      <el-dropdown
        class="select"
        split-button
        type="primary"
        v-if="disCondition.length < 5"
        @command="handleCommand"
      >
        搜索
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="tocreate" command="fbCampaignId_广告系列编号">广告系列编号</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="campaignName_广告系列名称">广告系列名称</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="fbAdSetId_广告组编号">广告组编号</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="adSetName_广告组名称">广告组名称</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="fbAdId_广告编号">广告编号</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="adName_广告名称">广告名称</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="planId_推广计划编号">推广计划编号</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="planName_推广计划名称">推广计划名称</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="at-dropdown" v-if="disCondition.length < 5" @mouseleave="searchStatus">
        <p class="theme">
          <span>
            筛选
            <i class="el-icon-arrow-down"></i>
          </span>
        </p>
        <div class="droplist" :style="{width: firstSearch != ''? '360px':'160px'}">
          <div class="listarr" id="firstList">
            <div class="list" @mouseenter="getSaveSearch" v-show="conditionlist.length > 0">
              已保存条件
              <i class="el-icon-caret-right"></i>
            </div>
            <div
              class="list"
              v-for="(lst, lsindex) in searchList"
              :key="lsindex"
              @mouseenter="searchClick(lst.name, lst.key)"
            >
              {{lst.name}}
              <i class="el-icon-caret-right"></i>
            </div>
          </div>
          <div class="listarr otherarr" id="secondList" v-if="firstKey != 'savecondition'">
            <div
              :class="{list: true, selected: scd.checked}"
              v-for="(scd, sindex) in secondSearchList"
              :key="sindex"
              @click="selectSearch(scd.cname, scd.checked, scd.key)"
            >{{scd.cname}}</div>
          </div>
          <div class="listarr otherarr" id="secondList" v-if="firstKey == 'savecondition'">
            <div
              class="list"
              v-for="(scd, sindex) in conditionlist"
              :key="sindex"
              @click="selectSaveSearch(scd.id)"
            >
              {{scd.tagName}}
              <i class="el-icon-close" @click.stop="deleteSaveSearch(scd.id)"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="conditionLine" v-show="searchType == 1">
        <p class="firstName">{{prevFirstSearch}}</p>
        <div class="dealType">
          <el-radio-group v-model="conditiondeal">
            <el-radio :label="1" class="radio">是</el-radio>
            <el-radio :label="2" class="radio">不是</el-radio>
          </el-radio-group>
        </div>
        <p class="firstName">
          <el-select
            v-model="conditionSelArr"
            multiple
            class="elselect"
            @change="downselectChange"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="(sitem, index) in secondDownList"
              :key="index"
              :label="sitem.cname"
              :value="sitem.cname"
            ></el-option>
          </el-select>
        </p>
        <p class="ctrl">
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            @click="determineSearch"
          ></el-button>
          <el-button type="danger" icon="el-icon-close" circle size="mini" @click="cancelSearch"></el-button>
        </p>
      </div>
      <div class="conditionLine" v-show="searchType == 2">
        <p class="firstName">{{conditionSel}}</p>
        <div class="dealType">
          <el-select v-model="conditiondeal" class="elselect" placeholder="请选择" size="mini">
            <el-option :key="1" label="大于" :value="1"></el-option>
            <el-option :key="2" label="小于" :value="2"></el-option>
            <el-option :key="3" label="介于" :value="3"></el-option>
            <el-option :key="4" label="不介于" :value="4"></el-option>
          </el-select>
        </div>
        <el-input-number
          class="numberinput"
          v-model="conditionState"
          size="mini"
          :precision="2"
          :min="0"
          :step="0.1"
        ></el-input-number>
        <span class="unit" v-if="specilkey100.indexOf(conditionSelkey) != -1">%</span>
        <el-input-number
          class="numberinput"
          v-model="conditionState2"
          v-show="conditiondeal == 3 || conditiondeal == 4"
          size="mini"
          :precision="2"
          :min="0"
          :step="0.1"
        ></el-input-number>
        <span
          class="unit"
          v-if="specilkey100.indexOf(conditionSelkey) != -1 && (conditiondeal == 3 || conditiondeal == 4)"
        >%</span>
        <p class="ctrl">
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            @click="determineSearch"
          ></el-button>
          <el-button type="danger" icon="el-icon-close" circle size="mini" @click="cancelSearch"></el-button>
        </p>
      </div>
      <div class="conditionLine" v-show="searchType == 3">
        <p class="firstName">{{conditionSel}}</p>
        <div class="dealType">
          <el-radio-group v-model="conditiondeal">
            <el-radio :label="1" class="radio">包含</el-radio>
            <el-radio :label="2" class="radio">不包含</el-radio>
          </el-radio-group>
        </div>
        <el-input v-model="conditionInput" placeholder="多个关键词空格隔开" size="mini" class="ptinput"></el-input>
        <p class="ctrl">
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            @click="determineSearch"
          ></el-button>
          <el-button type="danger" icon="el-icon-close" circle size="mini" @click="cancelSearch"></el-button>
        </p>
      </div>
      <div class="tagall">
        <span
          class="tagline"
          v-for="(cond, index) in disCondition"
          :key="index"
          @click="editCondition(cond)"
        >
          <el-tag class="tag" closable type @close="deleteCondtion(cond.regkey)">{{cond.name}}</el-tag>
        </span>
        <div class="saveClear" v-if="disCondition.length > 0">
          <el-button type="primary" @click="setCondition">保存</el-button>
          <el-button @click="clearLocalCondition">清空</el-button>
        </div>
      </div>
    </div>
    <div class="tablist">
      <el-tabs class="eltabs" v-model="tabname" type="card" @tab-click="resetPageData">
        <el-tab-pane
          :label="mutilselect.length > 0 ? `广告系列（已选${mutilselect.length}个）` : '广告系列'"
          name="first"
        >
          <ad-setbox
            ref="campaignName"
            @wantEdit="toCreateAd"
            @wantCopy="wantCopy"
            @changeReplace="changeReplace"
            @toCreateAd="toCreateAd"
            @selectSort="selectSort"
            @showOptionbox="showOptionbox"
            @showRemainBox="showRemainBox"
            @tabJump="tabJump"
            @ruleCreate="ruleCreate"
            @ruleAdd="ruleAdd"
            @ruleRemove="ruleRemove"
            :opDefault="[{ name: '广告系列名称', key: 'campaignName', tool: true, link: true }]"
            :defaultOption="defaultOption"
            type="campaignName"
          ></ad-setbox>
        </el-tab-pane>
        <el-tab-pane
          :label="mutilsetselect.length > 0 ? `广告组（已选${mutilsetselect.length}个）` : '广告组'"
          name="second"
        >
          <ad-setbox
            ref="adSetName"
            @wantEdit="toCreateAd"
            @wantCopy="wantCopy"
            @changeReplace="changeReplace"
            @toCreateAd="toCreateAd"
            @selectSort="selectSetSort"
            @showOptionbox="showOptionbox"
            @showRemainBox="showRemainBox"
            @tabJump="tabJump"
            @ruleCreate="ruleCreate"
            @ruleAdd="ruleAdd"
            @ruleRemove="ruleRemove"
            :opDefault="[{ name: '广告组名称', key: 'adSetName', tool: true, link: true }]"
            :defaultOption="defaultOption"
            type="adSetName"
          ></ad-setbox>
        </el-tab-pane>
        <el-tab-pane
          :label="mutiladselect.length > 0 ? `广告（已选${mutiladselect.length}个）` : '广告'"
          name="third"
        >
          <ad-setbox
            ref="adName"
            @wantEdit="toCreateAd"
            @wantCopy="wantCopy"
            @changeReplace="changeReplace"
            @toCreateAd="toCreateAd"
            @selectSort="selectAdSort"
            @showOptionbox="showOptionbox"
            @showRemainBox="showRemainBox"
            @tabJump="tabJump"
            @ruleCreate="ruleCreate"
            @ruleAdd="ruleAdd"
            @ruleRemove="ruleRemove"
            :opDefault="[{ name: '广告名称', key: 'adName', tool: true }]"
            :defaultOption="defaultOption"
            type="adName"
          ></ad-setbox>
        </el-tab-pane>
      </el-tabs>
      <div class="updatetime">
        <el-popover
          placement="top"
          width="320"
          trigger="hover"
          content="123"
          :disabled="copyjoblistdetail.length > 1?false:true"
        >
          <div class="progressDetail" v-for="(task, index) in copyjoblistdetail" :key="index">
            <div class="prgs">
              <el-progress
                :show-text="false"
                :stroke-width="10"
                :percentage="task.percent"
                status="success"
              ></el-progress>
            </div>
            <span class="prgsfont">{{task.name}} {{task.completed}}/{{task.total}}</span>
          </div>
          <div class="prgsline" slot="reference" v-show="jobtotal > 0">
            <div class="prgs">
              <el-progress
                :show-text="false"
                :stroke-width="10"
                :percentage="jobtotal?jobcomplete * 100/jobtotal:0"
                status="success"
              ></el-progress>
            </div>
            <span class="prgsfont">正在发布{{jobcomplete}}/{{jobtotal}}</span>
          </div>
        </el-popover>
        <i class="el-icon-refresh" style="cursor: pointer;" @click="resetPageData"></i>
        更新时间：{{datestatus}}
        <el-tooltip class="item" effect="dark" content="Appsflyer相关字段每天更新一次" placement="top-start">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </div>
    </div>
    <save-condition ref="saveCondtion" @save="saveCondtion"></save-condition>
    <ad-create ref="adCreate"></ad-create>
    <seek-replace ref="seekReplace" :type="tabtype" @resetPageData="resetPageData"></seek-replace>
    <ad-copy ref="adCopy"></ad-copy>
    <list-option
      :status="optionstatus"
      :type="tabtype"
      @outOption="outOption"
      @hideOptionbox="hideOptionbox"
      :customEvent="adcustomevent"
      :customUnit="customunit"
      :opDefault="opDefault"
      :setDefaultOption="defaultListOption"
      ref="listOption"
    ></list-option>
    <import-remain :status.sync="remainstatus" :type="tabtype" @hideRemainBox="hideRemainBox"></import-remain>
    <rule-select ref="ruleSelect" :status.sync="ruleselectstatus"></rule-select>
    <rule-remove ref="ruleRemove" :status.sync="ruleremovestatus"></rule-remove>
    <rule-add ref="ruleAdd" :status.sync="ruleaddstatus"></rule-add>
  </div>
</template>

<script>
import RuleAdd from "../rules/rule-add";
import RuleRemove from "./ad-ruleremove";
import RuleSelect from "./ad-ruleselect";
import AdSetbox from "./ad-setbox";
import AdCreate from "./ad-create";
import AdCopy from "./ad-copy";
import SeekReplace from "./ad-seekreplace";
import SaveCondition from "./ad-savecondition";
import ListOption from "./ad-listoption";
import ImportRemain from "./ad-importremain";
import { mapState, mapMutations, mapGetters } from "vuex";
import { Msgwarning } from "../../js/message";
let tab = 0;
export default {
  components: {
    AdSetbox,
    SaveCondition,
    AdCreate,
    SeekReplace,
    AdCopy,
    ListOption,
    ImportRemain,
    RuleSelect,
    RuleRemove,
    RuleAdd
  },
  beforeRouteLeave(to, from, next) {
    switch (this.tabname) {
      case "first":
        this.$refs["campaignName"].resetCare();
        break;
      case "second":
        this.$refs["adSetName"].resetCare();
        break;
      case "third":
        this.$refs["adName"].resetCare();
        break;
    }

    clearInterval(jobProcess);
    next();
  },
  data() {
    return {
      optionstatus: false,
      remainstatus: false,
      ruleselectstatus: false, // 选择现有规则
      ruleremovestatus: false, // 移除规则
      ruleaddstatus: false, // 创建规则
      defaultOption: [], // 自定义列配置, 常用，不包含各模块固定列
      defaultListOption: [], // 自定义列中的配置
      sortDown: false,
      tabtype: "campaignName",
      prevEdit: null, // 当前编辑的条件，需要先从显示条件中去除
      applicationid: "",
      opDefault: {
        campaignName: [{ name: "广告系列名称", key: "campaignName" }],
        adSetName: [{ name: "广告组名称", key: "adSetName" }],
        adName: [{ name: "广告名称", key: "adName" }]
      },
      opListDefault: [],
      searchList: [
        // { name: "已保存条件", list: [] },
        {
          name: "广告系列投放",
          key: "adCampaignStatusStr",
          list: [
            { checked: false, cname: "投放中", key: "ACTIVE" },
            { checked: false, cname: "已暂停", key: "PAUSED" },
            { checked: false, cname: "已归档", key: "ARCHIVED" },
            { checked: false, cname: "已删除", key: "DELETED" }
          ]
        },
        {
          name: "广告组投放",
          key: "adSetStatusStr",
          list: [
            { checked: false, cname: "投放中", key: "ACTIVE" },
            { checked: false, cname: "已暂停", key: "PAUSED" },
            { checked: false, cname: "已归档", key: "ARCHIVED" },
            { checked: false, cname: "已删除", key: "DELETED" }
          ]
        },
        {
          name: "广告投放",
          key: "adStatusStr",
          list: [
            { checked: false, cname: "投放中", key: "ACTIVE" },
            { checked: false, cname: "已暂停", key: "PAUSED" },
            { checked: false, cname: "已归档", key: "ARCHIVED" },
            { checked: false, cname: "已删除", key: "DELETED" }
          ]
        },
        {
          name: "版位",
          key: "publisherPlatformStrs",
          list: [
            { checked: false, cname: "Facebook", key: "facebook" },
            { checked: false, cname: "Instagram", key: "instagram" },
            {
              checked: false,
              cname: "Audience Network",
              key: "audience_network"
            },
            { checked: false, cname: "Messenger", key: "messenger" }
          ]
        },
        {
          name: "广告系列指标",
          key: "adCampaignTargetVo",
          list: [
            { cname: "触达", checked: false, key: "reachNum" },
            { cname: "展示", checked: false, key: "showNum" },
            { cname: "点击", checked: false, key: "clicksNum" },
            { cname: "CTR", checked: false, key: "ctr" },
            { cname: "CVR", checked: false, key: "cvr" },
            { cname: "CPM", checked: false, key: "cpm" },
            { cname: "CPC", checked: false, key: "cpc" },
            // { cname: "相关度", checked: false },
            { cname: "安装", checked: false, key: "installNum" },
            { cname: "花费", checked: false, key: "spend" },
            { cname: "CPI", checked: false, key: "cpi" },
            { cname: "AF_展示数", checked: false, key: "afShowsNum" },
            { cname: "AF_点击数", checked: false, key: "afClicksNum" },
            { cname: "AF_点击率", checked: false, key: "afCtr" },
            { cname: "AF_安装数", checked: false, key: "afInstallsNum" },
            { cname: "AF_安装数差异率", checked: false, key: "afMinsRate" },
            { cname: "AF_CPI", checked: false, key: "afCpi" },
            { cname: "AF_转化率", checked: false, key: "afCvr" },
            { cname: "AF_次日留存率", checked: false, key: "afRetentionRate" },
            { cname: "AF_会话次数", checked: false, key: "afSessionsNum" },
            { cname: "AF_忠实用户", checked: false, key: "afLoyalUsersNum" },
            {
              cname: "AF_忠实用户比率",
              checked: false,
              key: "afLoyalUsersRate"
            },
            { cname: "AF_收益", checked: false, key: "afTotalReveue" },
            { cname: "AF_花费", checked: false, key: "afTotalCost" },
            { cname: "AF_投资回报率", checked: false, key: "afROI" },
            { cname: "AF_单用户平均收益", checked: false, key: "afUserReveue" },
            { cname: "AF_平均eCPI", checked: false, key: "ecpi" },
            { cname: "Day 1留存量", checked: false, key: "retentionNum1" },
            { cname: "Day 1留存率", checked: false, key: "afReRate1" },
            { cname: "Day 2留存量", checked: false, key: "retentionNum2" },
            { cname: "Day 2留存率", checked: false, key: "afReRate2" },
            { cname: "Day 3留存量", checked: false, key: "retentionNum3" },
            { cname: "Day 3留存率", checked: false, key: "afReRate3" },
            { cname: "Day 4留存量", checked: false, key: "retentionNum4" },
            { cname: "Day 4留存率", checked: false, key: "afReRate4" },
            { cname: "Day 5留存量", checked: false, key: "retentionNum5" },
            { cname: "Day 5留存率", checked: false, key: "afReRate5" },
            { cname: "Day 6留存量", checked: false, key: "retentionNum6" },
            { cname: "Day 6留存率", checked: false, key: "afReRate6" },
            { cname: "Day 7留存量", checked: false, key: "retentionNum7" },
            { cname: "Day 7留存率", checked: false, key: "afReRate7" }
          ]
        },
        {
          name: "广告组指标",
          key: "adSetTargetVo",
          list: [
            { cname: "触达", checked: false, key: "reachNum" },
            { cname: "展示", checked: false, key: "showNum" },
            { cname: "点击", checked: false, key: "clicksNum" },
            { cname: "CTR", checked: false, key: "ctr" },
            { cname: "CVR", checked: false, key: "cvr" },
            { cname: "CPM", checked: false, key: "cpm" },
            { cname: "CPC", checked: false, key: "cpc" },
            // { cname: "相关度", checked: false },
            { cname: "安装", checked: false, key: "installNum" },
            { cname: "花费", checked: false, key: "spend" },
            { cname: "CPI", checked: false, key: "cpi" },
            { cname: "AF_展示数", checked: false, key: "afShowsNum" },
            { cname: "AF_点击数", checked: false, key: "afClicksNum" },
            { cname: "AF_点击率", checked: false, key: "afCtr" },
            { cname: "AF_安装数", checked: false, key: "afInstallsNum" },
            { cname: "AF_安装数差异率", checked: false, key: "afMinsRate" },
            { cname: "AF_CPI", checked: false, key: "afCpi" },
            { cname: "AF_转化率", checked: false, key: "afCvr" },
            { cname: "AF_次日留存率", checked: false, key: "afRetentionRate" },
            { cname: "AF_会话次数", checked: false, key: "afSessionsNum" },
            { cname: "AF_忠实用户", checked: false, key: "afLoyalUsersNum" },
            {
              cname: "AF_忠实用户比率",
              checked: false,
              key: "afLoyalUsersRate"
            },
            { cname: "AF_收益", checked: false, key: "afTotalReveue" },
            { cname: "AF_花费", checked: false, key: "afTotalCost" },
            { cname: "AF_投资回报率", checked: false, key: "afROI" },
            { cname: "AF_单用户平均收益", checked: false, key: "afUserReveue" },
            { cname: "AF_平均eCPI", checked: false, key: "ecpi" },
            { cname: "Day 1留存量", checked: false, key: "retentionNum1" },
            { cname: "Day 1留存率", checked: false, key: "afReRate1" },
            { cname: "Day 2留存量", checked: false, key: "retentionNum2" },
            { cname: "Day 2留存率", checked: false, key: "afReRate2" },
            { cname: "Day 3留存量", checked: false, key: "retentionNum3" },
            { cname: "Day 3留存率", checked: false, key: "afReRate3" },
            { cname: "Day 4留存量", checked: false, key: "retentionNum4" },
            { cname: "Day 4留存率", checked: false, key: "afReRate4" },
            { cname: "Day 5留存量", checked: false, key: "retentionNum5" },
            { cname: "Day 5留存率", checked: false, key: "afReRate5" },
            { cname: "Day 6留存量", checked: false, key: "retentionNum6" },
            { cname: "Day 6留存率", checked: false, key: "afReRate6" },
            { cname: "Day 7留存量", checked: false, key: "retentionNum7" },
            { cname: "Day 7留存率", checked: false, key: "afReRate7" }
          ]
        },
        {
          name: "广告指标",
          key: "adTargetVo",
          list: [
            { cname: "触达", checked: false, key: "reachNum" },
            { cname: "展示", checked: false, key: "showNum" },
            { cname: "点击", checked: false, key: "clicksNum" },
            { cname: "CTR", checked: false, key: "ctr" },
            { cname: "CVR", checked: false, key: "cvr" },
            { cname: "CPM", checked: false, key: "cpm" },
            { cname: "CPC", checked: false, key: "cpc" },
            { cname: "相关度", checked: false, key: "relevanceScore" },
            { cname: "安装", checked: false, key: "installNum" },
            { cname: "花费", checked: false, key: "spend" },
            { cname: "CPI", checked: false, key: "cpi" },
            { cname: "AF_展示数", checked: false, key: "afShowsNum" },
            { cname: "AF_点击数", checked: false, key: "afClicksNum" },
            { cname: "AF_点击率", checked: false, key: "afCtr" },
            { cname: "AF_安装数", checked: false, key: "afInstallsNum" },
            { cname: "AF_安装数差异率", checked: false, key: "afMinsRate" },
            { cname: "AF_CPI", checked: false, key: "afCpi" },
            { cname: "AF_转化率", checked: false, key: "afCvr" },
            { cname: "AF_次日留存率", checked: false, key: "afRetentionRate" },
            { cname: "AF_会话次数", checked: false, key: "afSessionsNum" },
            { cname: "AF_忠实用户", checked: false, key: "afLoyalUsersNum" },
            {
              cname: "AF_忠实用户比率",
              checked: false,
              key: "afLoyalUsersRate"
            },
            { cname: "AF_收益", checked: false, key: "afTotalReveue" },
            { cname: "AF_花费", checked: false, key: "afTotalCost" },
            { cname: "AF_投资回报率", checked: false, key: "afROI" },
            { cname: "AF_单用户平均收益", checked: false, key: "afUserReveue" },
            { cname: "AF_平均eCPI", checked: false, key: "ecpi" },
            { cname: "Day 1留存量", checked: false, key: "retentionNum1" },
            { cname: "Day 1留存率", checked: false, key: "afReRate1" },
            { cname: "Day 2留存量", checked: false, key: "retentionNum2" },
            { cname: "Day 2留存率", checked: false, key: "afReRate2" },
            { cname: "Day 3留存量", checked: false, key: "retentionNum3" },
            { cname: "Day 3留存率", checked: false, key: "afReRate3" },
            { cname: "Day 4留存量", checked: false, key: "retentionNum4" },
            { cname: "Day 4留存率", checked: false, key: "afReRate4" },
            { cname: "Day 5留存量", checked: false, key: "retentionNum5" },
            { cname: "Day 5留存率", checked: false, key: "afReRate5" },
            { cname: "Day 6留存量", checked: false, key: "retentionNum6" },
            { cname: "Day 6留存率", checked: false, key: "afReRate6" },
            { cname: "Day 7留存量", checked: false, key: "retentionNum7" },
            { cname: "Day 7留存率", checked: false, key: "afReRate7" }
          ]
        },
        {
          name: "受众年龄",
          key: "ageStrs",
          list: [
            { checked: false, cname: "13-17", key: "13-17" },
            { checked: false, cname: "18-24", key: "18-24" },
            { checked: false, cname: "25-34", key: "25-34" },
            { checked: false, cname: "35-44", key: "35-44" },
            { checked: false, cname: "45-54", key: "45-54" },
            { checked: false, cname: "55-64", key: "55-64" },
            { checked: false, cname: ">64", key: "65+" }
          ]
        },
        {
          name: "受众性别",
          key: "genderStrs",
          list: [
            { checked: false, cname: "未分类", key: "unknown" },
            { checked: false, cname: "女性", key: "female" },
            { checked: false, cname: "男性", key: "male" }
          ]
        }
      ],
      prevFirstSearch: "",
      prevFirstKey: "",
      firstSearch: "",
      firstKey: "",
      secondSearchList: [],
      secondDownList: [], // 可枚举下拉列表
      conditionSel: "",
      conditionSelArr: [],
      conditionSelkey: "",
      conditiondeal: 1, // 枚举和数字情况对比关键字
      conditionState: 0,
      conditionState2: 0,
      specilkey100: [
        "ctr",
        "cvr",
        "afCtr",
        "afConversionRate",
        "afLoyalUsersRate",
        "afROI",
        "afMinsRate",
        "afRetentionRate",
        "afReRate1",
        "afReRate2",
        "afReRate3",
        "afReRate4",
        "afReRate5",
        "afReRate6",
        "afReRate7"
      ], // 带百分数的值
      conditionInput: "", // 字符类型才会用到
      allCondition: {},
      disCondition: [], // 当前筛选的所有条件, 最大数量为5
      // dialogFormVisible: false, // 条件保存框
      conditionName: "", // 保存筛选条件名称
      state: "",
      value: "",
      value2: "",
      value3: [],
      value4: [],
      accountStorage: [],
      status: false,
      mutilselect: [],
      mutilsetselect: [],
      mutiladselect: [],
      date: [new Date().setDate(new Date().getDate() - 6), new Date()],
      sort: "",
      tabname: "first",
      projectId: this.$route.params.id,
      userId: localStorage.getItem("atom_id")
    };
  },
  created() {},
  mounted() {
    // 清除老的缓存
    if (adFilterLS.old && localStorage.getItem(adFilterLS.old)) {
      localStorage.removeItem(adFilterLS.old);
    }
    if (adOptionLS.old && localStorage.getItem(adOptionLS.old)) {
      localStorage.removeItem(adOptionLS.old);
    }
    if (adEventLS.old && localStorage.getItem(adEventLS.old)) {
      localStorage.removeItem(adEventLS.old);
    }

    let dt = this.date;

    // 初始化从本地缓存获取筛选条件
    this.allCondition = localStorage.getItem(adFilterLS.new)
      ? JSON.parse(localStorage.getItem(adFilterLS.new))
      : {};
    this.disCondition = this.allCondition[this.$route.params.id]
      ? this.allCondition[this.$route.params.id]
      : [];
    /**
     * 2019-04-08新增筛选条件相关逻辑
     * 从优化记录点击跳转，需要筛选出当前选择条件对应数据
     */
    let kid = this.$route.params.kid;
    let tab = "first";
    let tabname = "campaignName";
    if (kid) {
      let k = kid.split("_");
      let id = k[0];
      let type = k[1];
      switch (type) {
        case "CAMPAIGN":
          this.prevFirstKey = "fbCampaignId";
          this.conditionSel = "广告系列编号";
          tab = "first";
          tabname = "campaignName";
          break;
        case "ADSET":
          this.prevFirstKey = "fbAdSetId";
          this.conditionSel = "广告组编号";
          tab = "second";
          tabname = "adSetName";
          break;
        case "AD":
          this.prevFirstKey = "fbAdId";
          this.conditionSel = "广告编号";
          tab = "third";
          tabname = "adName";
          break;
      }
      this.conditionInput = id;
      this.prevFirstSearch = "allsearch";
      this.determineSearch("init");
    }
    this.tabname = tab;
    this.SETSTATE({ k: "adtab", v: tabname });

    // 初始化从本地缓存获取广告账户
    this.accountStorage = localStorage.getItem("ad-account")
      ? JSON.parse(localStorage.getItem("ad-account"))
      : {};
    this.value3 = this.accountStorage[this.$route.params.id]
      ? this.accountStorage[this.$route.params.id].split("|")
      : [];

    // 初始化从本地缓存获取已选广告账户，存到state中
    this.SETSTATE({ k: "adaccountid", v: this.value3 });

    // 初始化数据
    this.SETSTATE({
      k: "adstarttime",
      v: this.$timeFormat(dt[0], "yyyy-MM-dd")
    });
    this.SETSTATE({ k: "adendtime", v: this.$timeFormat(dt[1], "yyyy-MM-dd") });
    this.SETSTATE({ k: "adplanid", v: "" });
    // this.SETSTATE({ k: "adaccountid", v: "" });

    let projectId = this.$route.params.id;

    this.SETSTATE({ k: "adlist", v: [] });
    // 获取广告账户列表
    this.$store.dispatch("commonAccount", { project_id: projectId });

    if (this.itemlist.length > 0) {
      this.applicationid = this.itemlist.find(
        v => v.id == projectId
      ).applicationId;

      this.SETSTATE({ k: "adapplicationid", v: this.applicationid });
      this.initData(this.applicationid);
    }
    // 初始化获取已保存筛选条件
    this.$store.dispatch("getSearchCondition", {
      projectId: this.projectId,
      userId: this.userId
    });
    // 初始化获取更新时间情况
    this.$store.dispatch("getUpdateTime");
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    ruleAdd(select, type) {
      this.ruleaddstatus = true;
      this.$refs.ruleAdd.adInit(select, type);
    },
    ruleCreate(select, type) {
      this.ruleselectstatus = true;
      this.$refs.ruleSelect.adInit(select, type);
    },
    ruleRemove(id, type) {
      this.ruleremovestatus = true;
      this.$refs.ruleRemove.initData(id, type);
    },
    tabJump(tabname, row, type) {
      this.tabname = tabname;

      if (type == "campaignName") this.selectSort([row]);
      else this.selectSetSort([row]);

      this.resetPageData();
    },
    showOptionbox(type) {
      this.optionstatus = true;
      this.tabtype = type;

      this.$refs.listOption.showBox();
    },
    hideOptionbox() {
      this.optionstatus = false;
    },
    showRemainBox(type) {
      this.remainstatus = true;
      this.tabtype = type;
    },
    hideRemainBox() {
      this.remainstatus = false;
    },
    outOption(opt, selectOption, localEvent) {
      this.defaultOption = selectOption;
      this.defaultListOption = [];
      selectOption.forEach(v => {
        this.defaultListOption.push(Object.assign({}, v));
      });
      /**
       * 20181127新增
       * 配置项改变的同时，筛选栏指标同时改变
       */
      // this.$emit('sortOption', this.customOption, this.type);

      /**
       * 20181116新增，根据appid存储自定义列配置
       * 解决不同app不同事件问题
       */
      let applicationid = this.itemlist.find(v => v.id == this.$route.params.id)
        .applicationId;
      let pandectOption = localStorage.getItem(adOptionLS.new);
      if (!pandectOption) {
        pandectOption = {};
      } else pandectOption = JSON.parse(pandectOption);

      pandectOption[applicationid] = selectOption;
      localStorage.setItem(adOptionLS.new, JSON.stringify(pandectOption));

      let pandectEvent = localStorage.getItem(adEventLS.new);
      if (!pandectEvent) {
        pandectEvent = {};
      } else pandectEvent = JSON.parse(pandectEvent);

      pandectEvent[applicationid] = localEvent;
      localStorage.setItem(adEventLS.new, JSON.stringify(pandectEvent));

      this.resetPageData();
    },
    wantCopy(type, option, accountId) {
      // this.tabtype = type;
      this.$refs.adCopy.showBox(type, option, accountId);
    },
    changeReplace(type, target) {
      // this.tabtype = type;
      this.$refs.seekReplace.showBox(type, target);
    },
    toCreateAd(type, id, name) {
      // this.tabtype = type;
      this.$refs.adCreate.showBox({
        type,
        id: id ? id : [],
        name: name ? name : []
      });
    },
    // 清空当前条件，也就是当前项目下本地缓存条件
    clearLocalCondition() {
      // 清空缓存下当前项目id对应的筛选条件
      let allCondition = JSON.parse(localStorage.getItem(adFilterLS.new));
      allCondition[this.$route.params.id] = [];
      localStorage.setItem(adFilterLS.new, JSON.stringify(allCondition));
      // 清空当前筛选条件
      this.disCondition = [];
      this.prevEdit = null;
      // 重置列表数据
      this.resetPageData();
    },
    // 保存条件到数据库
    saveCondtion(name) {
      let option = {
        url: encodeURIComponent(JSON.stringify(this.disCondition)),
        projectId: this.$route.params.id,
        userId: localStorage.getItem("atom_id"),
        tagName: name
      };

      this.$store.dispatch("saveSearchCondition", option);
    },
    setCondition() {
      this.$refs.saveCondtion.showBox();
    },
    // 筛选条件删除
    deleteCondtion(regkey) {
      this.disCondition = this.disCondition.filter(v => v.regkey != regkey);
      // 保存到本地缓存
      this.searchLocalstorage();
      // 重置列表数据
      this.resetPageData();
    },
    // 编辑筛选条件
    editCondition(cond) {
      if (this.prevEdit) this.disCondition.push(this.prevEdit);

      this.prevEdit = cond;
      this.disCondition = this.disCondition.filter(
        v => v.regkey != cond.regkey
      );

      this.prevFirstSearch = cond.prevFirstSearch;
      this.prevFirstKey = cond.prevFirstKey;
      this.conditiondeal = cond.conditionDeal;
      this.conditionState = cond.conditionState;
      this.conditionState2 = cond.conditionState2;
      this.conditionSel = cond.conditionSel;
      this.conditionSelArr = cond.conditionSel.split("、");
      this.conditionSelkey = cond.conditionSelkey;
      this.conditionInput = cond.conditionInput;

      this.changeConditionArr();
    },
    // 返回对比关键字
    seachDeal() {
      let deal = "";
      if (this.searchType == 1) {
        switch (this.conditiondeal) {
          case 1:
            deal = "是";
            break;
          case 2:
            deal = "不是";
            break;
        }
      }
      if (this.searchType == 2) {
        switch (this.conditiondeal) {
          case 1:
            deal = "大于";
            break;
          case 2:
            deal = "小于";
            break;
          case 3:
            deal = "介于";
            break;
          case 4:
            deal = "不介于";
            break;
        }
      }
      if (this.searchType == 3) {
        switch (this.conditiondeal) {
          case 1:
            deal = "包含";
            break;
          case 2:
            deal = "不包含";
            break;
        }
      }
      return deal;
    },
    searchLocalstorage() {
      // 条件保存到本地缓存
      this.allCondition[this.$route.params.id] = this.disCondition;
      localStorage.setItem(adFilterLS.new, JSON.stringify(this.allCondition));
    },
    // 确定条件，同时保存到本地缓存
    determineSearch(frm) {
      let cond = {};
      let dealkey = this.seachDeal();
      // 所有字段的值需要乘以100
      // let specilkey100 = this.specilkey100;
      // 所有字段的值需要乘以1000
      let specilkey1000 = ["cpm"];
      let type1arr = ["ACTIVE", "PAUSED", "ARCHIVED", "DELETED"];
      switch (this.searchType) {
        case 1:
          cond = {
            name: `${this.prevFirstSearch}：${dealkey} ${this.conditionSel}`,
            option: `${
              this.conditiondeal == "1"
                ? this.conditionSelkey
                : type1arr
                    .filter(v => this.conditionSelkey.indexOf(v) == -1)
                    .join(",")
            }`,
            key: this.prevFirstKey,
            regkey: this.prevFirstKey
          };
          break;
        case 2:
          if (this.conditionState == undefined) {
            Msgwarning("请输入内容");
            return;
          }
          if (
            (this.conditiondeal == 3 || this.conditiondeal == 4) &&
            this.conditionState2 == undefined
          ) {
            Msgwarning("请输入内容");
            return;
          }
          cond = {
            name: `${this.conditionSel}：${dealkey} ${this.conditionState}${
              this.specilkey100.indexOf(this.conditionSelkey) != -1 ? "%" : ""
            } ${
              this.conditiondeal == 3 || this.conditiondeal == 4
                ? `和${this.conditionState2}${
                    this.specilkey100.indexOf(this.conditionSelkey) != -1
                      ? "%"
                      : ""
                  }`
                : ""
            }`,
            option: "",
            key: "",
            regkey: `${this.prevFirstKey}.${this.conditionSelkey}` // 单个条件类只能选择一个
          };
          if (this.prevFirstKey == "adCampaignTargetVo") {
            cond.key = "campaignOptions";
          } else if (this.prevFirstKey == "adSetTargetVo") {
            cond.key = "adSetOptions";
          } else {
            cond.key = "adOptions";
          }
          if (specilkey1000.indexOf(this.conditionSelkey) != -1) {
            this.conditionState *= 1000;
            this.conditionState2 *= 1000;
          }
          // 3和4需要对比两个值大小
          if (this.conditiondeal == 3) {
            cond.option = `${this.prevFirstKey}.${this.conditionSelkey}>=${
              this.conditionState > this.conditionState2
                ? this.conditionState2
                : this.conditionState
            } and ${this.prevFirstKey}.${this.conditionSelkey}<=${
              this.conditionState > this.conditionState2
                ? this.conditionState
                : this.conditionState2
            }`;
          } else if (this.conditiondeal == 4) {
            cond.option = `(${this.prevFirstKey}.${this.conditionSelkey}>${
              this.conditionState > this.conditionState2
                ? this.conditionState
                : this.conditionState2
            } or ${this.prevFirstKey}.${this.conditionSelkey}<${
              this.conditionState > this.conditionState2
                ? this.conditionState2
                : this.conditionState
            })`;
          } else if (this.conditiondeal == 1) {
            cond.option = `${this.prevFirstKey}.${this.conditionSelkey}>${
              this.conditionState
            }`;
          } else {
            cond.option = `${this.prevFirstKey}.${this.conditionSelkey}<${
              this.conditionState
            }`;
          }
          break;
        case 3:
          if (this.conditionInput.trim() === "") {
            Msgwarning("请输入内容");
            return;
          }
          let conditionArr = this.conditionInput.trim().split(" ");
          conditionArr = conditionArr.filter(v => v);
          conditionArr = conditionArr.map(v => v.replace(/&/g, ""));
          cond = {
            name: `${this.conditionSel}：${dealkey} ${conditionArr.join(" ")}`,
            option: `${conditionArr.join("&")}`,
            key: `${this.prevFirstKey}${this.conditiondeal == 1 ? "" : "No"}`,
            regkey: this.prevFirstKey
          };
          break;
      }
      /**
       * 20181228新增
       * 以下字段 编辑时用
       */

      cond.prevFirstSearch = this.prevFirstSearch;
      cond.prevFirstKey = this.prevFirstKey;
      cond.conditionDeal = this.conditiondeal;
      cond.conditionSel = this.conditionSel;
      cond.conditionSelkey = this.conditionSelkey;
      cond.conditionInput = this.conditionInput;
      cond.conditionState =
        specilkey1000.indexOf(this.conditionSelkey) != -1
          ? this.conditionState / 1000
          : this.conditionState;
      cond.conditionState2 =
        specilkey1000.indexOf(this.conditionSelkey) != -1
          ? this.conditionState2 / 1000
          : this.conditionState2;
      // 本地筛选条件保存，单类条件唯一
      this.disCondition = this.disCondition.filter(
        v => v.regkey != cond.regkey
      );
      this.disCondition.push(cond);
      // 保存到本地缓存
      this.searchLocalstorage();

      // 确定完之后初始化状态
      this.cancelSearch("select");
      // 重置列表数据
      if (frm != "init") this.resetPageData();
    },
    // 取消条件，重置状态
    cancelSearch(frm) {
      switch (this.searchType) {
        case 1:
          break;
        case 2:
          this.conditionState = 0;
          this.conditionState2 = 0;
          break;
      }
      this.prevFirstSearch = "";
      this.prevFirstKey = "";
      this.firstSearch = "";
      this.firstKey = "";
      this.conditionSel = "";
      this.conditionSelArr = [];
      this.conditionSelkey = "";
      this.conditiondeal = 1;
      this.conditionState = 0;
      this.conditionState2 = 0;
      this.conditionInput = "";
      this.secondSearchList = [];
      // 兼容编辑情况, 排除确定之后
      if (this.prevEdit && frm != "select")
        this.disCondition.push(this.prevEdit);
      this.prevEdit = null;
      // 初始化筛选栏条件状态
      this.searchList.forEach(v => {
        v.list.forEach(g => {
          g.checked = false;
        });
      });
    },
    // 条件中复选
    downselectChange() {
      this.changeConditionArr();

      let sel = this.secondDownList.filter(v => v.checked);
      this.conditionSel = sel.map(v => v.cname).join("、");
      this.conditionSelArr = this.conditionSel.split("、");
      this.conditionSelkey = sel.map(v => v.key).join(",");
    },
    changeConditionArr(type) {
      switch (this.searchType) {
        case 1:
          // case 2:
          // 与筛选栏同步勾选情况
          this.searchList.forEach(v => {
            v.list.forEach(g => {
              g.checked = false;
            });
          });
          // 初始化下拉列表
          this.secondDownList = this.searchList.find(
            v => v.name == this.prevFirstSearch
          ).list;

          this.searchList.forEach(v => {
            if (v.name == this.prevFirstSearch) {
              v.list.forEach(g => {
                if (this.conditionSelArr.indexOf(g.cname) != -1) {
                  g.checked = true;
                }
              });
            }
          });
          break;
        case 3:
          break;
      }
    },
    selectSearch(name, checked, key) {
      if (this.prevEdit) this.disCondition.push(this.prevEdit);

      // 非枚举情况，只能单选
      if (this.prevFirstSearch != this.firstSearch) {
        this.prevFirstSearch = this.firstSearch;
        this.prevFirstKey = this.firstKey;

        this.searchList.forEach(v => {
          if (v.name != this.firstSearch) {
            v.list.forEach(g => {
              g.checked = false;
            });
          }
        });
      }

      if (
        this.firstSearch == "广告系列指标" ||
        this.firstSearch == "广告组指标" ||
        this.firstSearch == "广告指标"
      ) {
        this.searchList.forEach(v => {
          v.list.forEach(g => {
            g.checked = false;
          });
        });
      }

      this.secondSearchList.forEach(v => {
        if (v.cname == name) {
          v.checked = !v.checked;
        }
      });

      let sel = this.secondSearchList.filter(v => v.checked);
      // 已选筛选条件状态字符串
      this.conditionSel = sel.map(v => v.cname).join("、");
      this.conditionSelArr = this.conditionSel.split("、");
      this.conditionSelkey = sel.map(v => v.key).join(",");
      // 获取下拉选择列表
      if (this.searchType == 1) {
        this.secondDownList = this.searchList.find(
          v => v.name == this.prevFirstSearch
        ).list;
      }
    },
    searchStatus() {
      // this.sortDown = !this.sortDown;
      this.secondSearchList = [];
      this.firstSearch = "";
      this.firstKey = "";
    },
    selectSaveSearch(id) {
      this.disCondition = JSON.parse(
        this.conditionlist.find(v => v.id == id).url
      );
      // 保存到本地缓存
      this.searchLocalstorage();
      // 重置列表数据
      this.resetPageData();
    },
    deleteSaveSearch(id) {
      this.$confirm("确定删除此已保存条件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("deleteSearchCondition", {
            id,
            userId: this.userId,
            projectId: this.projectId
          });
        })
        .catch(() => {});
    },
    getSaveSearch() {
      this.firstSearch = "已保存条件";
      this.firstKey = "savecondition";
    },
    searchClick(name, key) {
      this.firstSearch = name;
      this.firstKey = key;
      this.secondSearchList = this.searchList.find(
        v => this.firstSearch == v.name
      ).list;
    },
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
    initData(applicationid) {
      let batchId = this.$route.params.bid;
      let projectId = this.$route.params.id;
      let option = {
        pageNo: 1,
        pageSize: 20,
        batchId,
        projectId: projectId
      };
      /**
       * 20181227新增默认条件
       * 各tab分别默认各投放状态投放中and已暂停
       * 如果有操作过相关条件，则取消默认
       */
      option.adCampaignStatusStr = this.sortdefault;
      console.log(this.disCondition);
      this.disCondition.forEach(v => {
        if (option[v.key] && v.key != "adCampaignStatusStr")
          option[v.key] += " and " + v.option;
        else option[v.key] = v.option;
      });
      // 设置默认条件，详情见方法注释
      this.sortConditionLogic(option);

      var k = "";
      switch (this.tabname) {
        case "first":
          k = "campain_option";
          break;
        case "second":
          k = "set_option";
          break;
        case "third":
          k = "ad_option";
          break;
      }
      this.SETSTATE({ k, v: option });

      // 获取joblist
      this.$store.dispatch("jobList");

      this.defaultOption =
        localStorage.getItem(adOptionLS.new) &&
        JSON.parse(localStorage.getItem(adOptionLS.new))[applicationid]
          ? JSON.parse(localStorage.getItem(adOptionLS.new))[applicationid]
          : [
              // { name: '广告系列名称', key: '' },
              {
                name: "投放状态",
                key: "effectiveStatusName",
                checked: true,
                isevent: true
              },
              { name: "触达", key: "reachNum", checked: true },
              { name: "展示", key: "showNum", checked: true },
              { name: "点击", key: "clicksNum", checked: true },
              { name: "CTR", key: "ctr", checked: true },
              { name: "CVR", key: "cvr", checked: true },
              { name: "CPM", key: "cpm", checked: true },
              { name: "CPC", key: "cpc", checked: true },
              { name: "相关度", key: "relevanceScore", checked: true },
              { name: "安装", key: "installNum", checked: true },
              { name: "花费", key: "spend", checked: true },
              { name: "CPI", key: "cpi", checked: true }
            ];
      this.defaultListOption = [];
      this.defaultOption.forEach(v => {
        this.defaultListOption.push(Object.assign({}, v));
      });

      // 20181031新增自定义事件
      this.$store.dispatch("getCustomEventAd", applicationid);
    },
    /**
     * 广告系列独有的方法
     * * 只有广告系列才有的方法，筛选广告组和广告账户的列表
     * 广告系列选择了几个，广告组和广告分别对应显示几个
     * 没选则的情况下，显示全部
     */
    selectSort(arr) {
      this.mutilselect = arr;
      this.SETSTATE({ k: "campainsortlist", v: arr });
    },
    selectSetSort(arr) {
      this.mutilsetselect = arr;
      this.SETSTATE({ k: "setsortlist", v: arr });
    },
    selectAdSort(arr) {
      this.mutiladselect = arr;
      this.SETSTATE({ k: "adsortlist", v: arr });
    },
    tableSort(sort) {
      this.sort = sort;
      this.toGetdata();
    },

    dateSort() {
      let dt = this.date;
      this.SETSTATE({
        k: "adstarttime",
        v: this.$timeFormat(dt[0], "yyyy-MM-dd")
      });
      this.SETSTATE({
        k: "adendtime",
        v: this.$timeFormat(dt[1], "yyyy-MM-dd")
      });

      this.resetPageData();
    },
    // 同时重置页码
    resetPageData() {
      let v = "";
      switch (this.tabname) {
        case "first":
          v = "campaignName";
          this.$refs["campaignName"].toGetdata(true);
          break;
        case "second":
          v = "adSetName";
          this.$refs["adSetName"].toGetdata(true);
          break;
        case "third":
          v = "adName";
          this.$refs["adName"].toGetdata(true);
          break;
      }
      this.SETSTATE({ k: "adtab", v });
    },
    toSortAccount() {
      let accountid = this.value3;
      this.SETSTATE({ k: "adaccountid", v: accountid });
      this.accountStorage[this.$route.params.id] = accountid.join("|");
      localStorage.setItem("ad-account", JSON.stringify(this.accountStorage));

      this.resetPageData();
    },
    handleCommand(k) {
      if (this.prevEdit) this.disCondition.push(this.prevEdit);
      this.prevFirstSearch = "allsearch";

      this.prevFirstKey = k.split("_")[0];
      this.conditionSel = k.split("_")[1];
    }
  },
  watch: {
    itemlist(n, v) {
      if (n.length != 0) {
        let applicationid = n.find(v => v.id == this.$route.params.id)
          .applicationId;

        this.SETSTATE({ k: "adapplicationid", v: applicationid });

        this.initData(applicationid);
      }
    },
    projectid(n, o) {
      if (n != "") {
        let k = "pl_project_id";
        let v = n;

        this.projectId = this.$route.params.id;
        this.SETSTATE({ k, v });
        // 初始化筛选条件
        this.disCondition = this.allCondition[n] ? this.allCondition[n] : [];
        // 初始化广告账户列表
        this.$store.dispatch("commonAccount", { project_id: n });
        // 从本地缓存获取当前项目已选广告账户
        this.value3 = this.accountStorage[n]
          ? this.accountStorage[n].split("|")
          : [];
        // 初始化列表数据
        this.tabname = "first";
        this.SETSTATE({ k: "adtab", v: "campaignName" });
        let applicationid = this.itemlist.find(v => v.id == n).applicationId;
        this.SETSTATE({ k: "adapplicationid", v: applicationid });
        // 重置开关
        // this.$refs["campaignName"].changeFilterSwitch(true);
        // this.$refs["adSetName"].changeFilterSwitch(true);
        // this.$refs["adName"].changeFilterSwitch(true);

        this.initData(applicationid);
        // 初始化获取已保存筛选条件
        this.$store.dispatch("getSearchCondition", {
          projectId: n,
          userId: this.userId
        });
      }
    }
  },
  computed: {
    ...mapState([
      "itemlist",
      // "adaccountlist",
      "commonaccount",
      "adalllist",
      // "customeventcampain",
      // "customeventset",
      // "customeventad",
      "adcustomevent",
      "customunit",
      "adplanlist",
      "conditionlist",
      "datestatus",
      "jobtotal",
      "jobcomplete",
      "copyjoblistdetail",
      "sortdefault"
    ]),
    projectid() {
      return this.$route.params.id;
    },
    searchType() {
      let type = "";
      switch (this.prevFirstSearch) {
        case "广告系列投放":
        case "广告组投放":
        case "广告投放":
        case "版位":
        case "受众年龄":
        case "受众性别":
          type = 1;
          break;
        case "广告系列指标":
        case "广告组指标":
        case "广告指标":
          type = 2;
          break;
        case "allsearch":
          type = 3;
          break;
      }
      // 1为枚举 2为数字
      return type;
    },
    documentHeight() {
      return document.documentElement.clientHeight - 60;
    },
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    }
  }
};
</script>
<style>
.dealType .el-radio__label {
  font-size: 12px;
}
.updatetime .el-icon-loading {
  font-size: 14px;
}
.el-popover--plain {
  padding: 8px 20px;
}
</style>

<style lang="less" scoped>
.progressDetail {
  display: flex;
  align-items: center;
  // justify-content: center;
  position: relative;
  margin: 8px 0;
  .prgs {
    display: inline-block;
    width: 200px;
    margin-right: 5px;
  }
  .prgsfont {
    font-size: 12px;
  }
}
.ad {
  flex-grow: 1;
  .tablist {
    margin: 30px 0 0 40px;
    width: 960px;
    overflow: hidden;
    position: relative;
    .updatetime {
      position: absolute;
      top: 0;
      right: 0;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      .prgsline {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .prgs {
          display: inline-block;
          width: 200px;
          margin-right: 5px;
        }
        .prgsfont {
          margin-right: 15px;
        }
      }
      .el-icon-refresh {
        margin-right: 2px;
      }
      .el-icon-warning {
        margin-left: 5px;
      }
    }
  }
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
    margin-left: 40px;
    .back {
      color: #333;
    }
  }
  .ctrlbutton {
    margin-left: 40px;
    // overflow: hidden;
    // height: 40px;
    margin-bottom: 10px;
    .tagall {
      // float: left;
      .tagline {
        margin-right: 10px;
        margin-bottom: 10px;
        display: inline-block;
        .tag {
          font-size: 14px;
          height: 40px;
          line-height: 40px;
        }
      }
      .saveClear {
        display: inline-block;
      }
    }
    .conditionLine {
      float: left;
      border: 1px solid #e5e5e5;
      padding: 0 20px 0 20px;
      border-radius: 4px;
      margin-right: 20px;
      margin-bottom: 10px;
      .firstName {
        float: left;
        font-size: 14px;
        line-height: 38px;
        margin-right: 20px;
      }
      .numberinput {
        float: left;
        margin-top: 5px;
        margin-right: 5px;
      }
      .unit {
        line-height: 38px;
        float: left;
        margin-right: 10px;
        // margin-left: 5px;
      }
      .ptinput {
        float: left;
        margin-top: 5px;
        margin-right: 10px;
        width: 140px;
      }
      .dealType {
        float: left;
        line-height: 38px;
        margin-right: 20px;
        .radio {
          margin-left: 10px;
        }
        .elselect {
          width: 100px;
        }
      }
      .ctrl {
        padding-top: 5px;
        float: left;
        margin-left: 5px;
      }
    }
    .at-dropdown {
      float: left;
      position: relative;
      margin-right: 20px;
      margin-bottom: 10px;
      .theme {
        width: 80px;
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
        border-radius: 5px;
        overflow: hidden;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        display: none;
        z-index: 999;
        background-color: #fff;
        .listarr {
          float: left;
          width: 160px;
          &.otherarr {
            width: 200px;
            max-height: 360px;
            overflow-y: auto;
          }
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
        }
      }
      &:hover {
        .droplist {
          display: block;
        }
      }
    }
    .selectAccount {
      width: 400px;
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
    .download {
      font-size: 14px;
      color: #3297ff;
      text-align: right;
      float: left;
      line-height: 20px;
      margin-bottom: 5px;
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
  // .list {
  //   margin-left: 40px;
  //   width: 960px;
  //   min-height: 400px;
  // }
}
</style>
