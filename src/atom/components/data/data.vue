<template>
  <div class="ad">
    <bread-crumb pageName="账户报表"></bread-crumb>
    <div class="ctrlbutton">
      <el-select
        class="select"
        v-model="form.value2"
        filterable
        multiple
        remote
        collapse-tags
        no-data-text="无数据，请输入或者改变关键字"
        placeholder="创意"
        :remote-method="searchCreate"
        @blur="clearArr('adcreate')"
        @change="toSort"
      >
        <el-option
          v-for="(item, index) in adcreate"
          :key="index"
          :label="item.creativityName + '('+item.fbAdcreativeId+')'"
          :value="item.fbAdcreativeId"
        ></el-option>
        <p class="maxcount">最多显示20条</p>
      </el-select>
      <el-button type="text" class="advanceSelect" @click="advanceFilter">高级筛选</el-button>
      <p class="download">
        <span @click="outTable">
          导出全部
          <svg-icon svgname="save" svgclass="save"></svg-icon>
        </span>
      </p>
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
      <el-input
        class="search"
        v-model="state"
        placeholder="搜索广告账户ID/名称"
        suffix-icon="el-icon-search"
        @input="dataSearch"
      ></el-input>
      <el-date-picker
        class="datar"
        v-model="form.value8"
        type="daterange"
        range-separator="至"
        :clearable="false"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="toSort"
      ></el-date-picker>
    </div>
    <div class="advanceCtr">
      <el-select
        v-if="ifadvance"
        class="select"
        v-model="form.value3"
        filterable
        multiple
        collapse-tags
        placeholder="国家"
        @change="toSort"
        :disabled="!filter3"
      >
        <el-option v-for="item in datacountry" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-select
        v-if="ifadvance"
        class="select"
        v-model="form.value4"
        filterable
        multiple
        collapse-tags
        placeholder="年龄"
        @change="toSort"
        :disabled="!filter1"
      >
        <el-option v-for="item in dataage" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-select
        v-if="ifadvance"
        class="select"
        v-model="form.value5"
        filterable
        multiple
        collapse-tags
        placeholder="性别"
        @change="toSort"
        :disabled="!filter1"
      >
        <el-option v-for="item in datasex" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </div>
    <div class="advanceCtr" v-if="ifadvance">
      <el-select
        class="selectmul"
        v-model="form.value6"
        filterable
        collapse-tags
        multiple
        placeholder="请选择版位"
        @change="toSort"
        :disabled="!filter2"
      >
        <el-option
          v-for="item in dataplatform"
          :key="item"
          :label="item"
          :value="item == 'Audience Network'?'Audience_Network':item"
        ></el-option>
      </el-select>
      <el-select
        class="selectmul"
        v-model="form.value7"
        filterable
        collapse-tags
        multiple
        placeholder="请选择设备"
        @change="toSort"
        :disabled="!filter2"
      >
        <el-option v-for="item in dataimpression" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <div class="list">
      <data-list @tableSort="tableSort"></data-list>
    </div>
    <div class="pageswitch">
      <el-pagination
        background
        @size-change="pageSizeChange"
        :page-sizes="[20, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageindex"
        :total="datatotal"
        :page-size="20"
        @current-change="pageSwitch"
      ></el-pagination>
    </div>
    <list-option
      :status.sync="optionstatus"
      :type="tabtype"
      @outOption="outOption"
      :customEvent="adcustomevent"
      :customUnit="customunit"
      :opDefault="opDefault"
      :setDefaultOption="defaultListOption"
      ref="listOption"
    ></list-option>
  </div>
</template>

<script>
  import ListOption from "../ad/ad-listoption";
  import DataList from "./data-list";
  import BreadCrumb from "@/atom/components/project-breadcrumb";
  import { mapState, mapMutations } from "vuex";
  import { Msgwarning } from "../../js/message";
  let search;
  let moreoption;
  export default {
    data() {
      return {
        /**
         * v2.2.4
         * 20190529新增
         * 账户、素材、创意报表支持自定义列，项目内通用
         */
        optionmenu: false,
        optionstatus: true,
        tabtype: "forms",
        opDefault: {
          campaignName: [{ name: "广告系列名称", key: "campaignName" }],
          adSetName: [{ name: "广告组名称", key: "adSetName" }],
          adName: [{ name: "广告名称", key: "adName" }],
          forms: [
            { name: "广告账户ID", key: "fbAccountId" },
            { name: "广告账户名称", key: "adAccountName" }
          ]
        },
        defaultListOption: [], // 自定义列中的配置

        state: "",
        ifadvance: false,
        filter1: true,
        filter2: true,
        filter3: true,
        sort: "",
        form: {
          value1: [],
          value2: [],
          value3: [],
          value4: [],
          value5: [],
          value6: [],
          value7: [],
          value8: [
            new Date().setDate(new Date().getDate() - 1),
            new Date().setDate(new Date().getDate() - 1)
          ]
        },
        pageindex: 1,
        pagesize: 20,
        datasex: [
          {
            name: "全部",
            code: "0"
          },
          {
            name: "男",
            code: "1"
          },
          {
            name: "女",
            code: "2"
          }
        ]
      };
    },
    components: {
      DataList,
      BreadCrumb,
      ListOption
    },
    mounted() {
      let projectId = this.$route.params.id;
      this.$store.dispatch("getCondition", { projectId });

      let option = {
        pageNo: 1,
        pageSize: 20,
        projectId: this.$route.params.id,
        endDate: this.$timeFormat(this.form.value8[1], "yyyy-MM-dd"),
        startDate: this.$timeFormat(this.form.value8[0], "yyyy-MM-dd")
      };

      this.$store.dispatch("getDataList", { option });
    },
    methods: {
      ...mapMutations(["SETSTATE"]),
      outOption() {},
      saveOption() {},
      deleteOption() {},
      outListOption() {
        this.optionstatus = true;
      },

      clearArr(k) {
        let v = [];
        this.SETSTATE({ k, v });
      },
      searchCreate(kword) {
        let creativeKeyword = kword;
        clearTimeout(moreoption);

        moreoption = setTimeout(() => {
          this.$store.dispatch("getOptionMore", {
            projectId: this.$route.params.id,
            creativeKeyword
          });
        }, 300);
      },
      // searchCampaign(kword) {
      //   let campaignKeyword = kword;
      //   clearTimeout(moreoption);

      //   moreoption = setTimeout(() => {
      //     this.$store.dispatch("getOptionMore", {
      //       projectId: this.$route.params.id,
      //       campaignKeyword
      //     });
      //   }, 300);
      // },
      tableSort(sort) {
        this.sort = sort;
        this.toGetdata();
      },
      pageSizeChange(size) {
        this.pagesize = size;

        this.toGetdata();
      },
      advanceFilter() {
        this.ifadvance = !this.ifadvance;

        if (
          this.form.value3.length > 0 ||
          this.form.value4.length > 0 ||
          this.form.value5.length > 0 ||
          this.form.value6.length > 0 ||
          this.form.value7.length > 0
          // this.form.value8.length > 0
        ) {
          this.form.value3 = [];
          this.form.value4 = [];
          this.form.value5 = [];
          this.form.value6 = [];
          this.form.value7 = [];
          // this.form.value8 = [];

          this.filter1 = true;
          this.filter2 = true;

          this.pageindex = 1;
          this.toGetdata();
        }
      },
      outTable() {
        let name = `${this.projectname}账户报表${this.$timeFormat(
          new Date(),
          "yyyyMMddHHmmss"
        )}`;

        let option = {
          ageList: this.form.value4.join(","),
          countryList: this.form.value3.join(","),
          endDate: this.$timeFormat(this.form.value8[1], "yyyy-MM-dd"),
          fbAdAccountIdList: "",
          // fbAdCampaignIdList: this.form.value1.join(","),
          fbAdCreativeIdList: this.form.value2.join(","),
          fbAppId: "",
          flag: "",
          genderList: this.form.value5.join(","),
          impressionDeviceList: this.form.value7.join(","),
          insightDate: "",
          orderByClause: this.sort,
          pageNo: 1,
          pageSize: this.datatotal,
          platformPositionList: this.form.value6.join(","),
          startDate: this.$timeFormat(this.form.value8[0], "yyyy-MM-dd"),
          accountKeyword: this.state,
          campainKeyword: "",
          creativeKeyword: "",
          projectId: this.$route.params.id
        };
        // this.$exportHTML("dataTable", name);
        this.$store.dispatch("getDataListout", { option, name });
      },
      toSort() {
        this.pageindex = 1;
        // 条件互斥
        this.filter2 =
          this.form.value3.length > 0 ||
          this.form.value4.length > 0 ||
          this.form.value5.length > 0
            ? false
            : true;
        this.filter3 =
          this.form.value4.length > 0 ||
          this.form.value5.length > 0 ||
          this.form.value6.length > 0 ||
          this.form.value7.length > 0
            ? false
            : true;
        this.filter1 =
          this.form.value3.length > 0 ||
          this.form.value6.length > 0 ||
          this.form.value7.length > 0
            ? false
            : true;

        this.toGetdata();
      },
      toGetdata() {
        console.log(this);
        let option = {
          ageList: this.form.value4.join(","),
          countryList: this.form.value3.join(","),
          endDate: this.$timeFormat(this.form.value8[1], "yyyy-MM-dd"),
          fbAdAccountIdList: "",
          // fbAdCampaignIdList: this.form.value1.join(","),
          fbAdCreativeIdList: this.form.value2.join(","),
          fbAppId: "",
          flag: "",
          genderList: this.form.value5.join(","),
          impressionDeviceList: this.form.value7.join(","),
          insightDate: "",
          orderByClause: this.sort,
          pageNo: this.pageindex,
          pageSize: this.pagesize,
          platformPositionList: this.form.value6.join(","),
          startDate: this.$timeFormat(this.form.value8[0], "yyyy-MM-dd"),
          accountKeyword: this.state,
          campainKeyword: "",
          creativeKeyword: "",
          projectId: this.$route.params.id
        };

        this.$store.dispatch("getDataList", { option });
      },
      dataSearch() {
        let self = this;

        this.pageindex = 1;

        clearTimeout(search);
        search = setTimeout(() => {
          self.toGetdata();
        }, 300);
      },
      pageSwitch(page) {
        this.pageindex = page;

        this.toGetdata();
      }
    },
    computed: {
      ...mapState([
        "itemlist",
        // "adcampaign",
        "adcreate",
        "datacountry",
        "dataage",
        "dataplatform",
        "dataimpression",
        "datatotal",

        "adcustomevent",
        "customunit",
        "optionselect",
        "saveoption"
      ]),
      projectname() {
        if (this.itemlist.length == 0) return;
        return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
      }
    }
  };
</script>

<style lang="less">
.maxcount {
  line-height: 36px;
  text-align: center;
  color: #999;
  font-size: 12px;
}
.ctrlbutton {
  .select {
    .el-tag {
      position: relative;
      padding-right: 20px;
      span {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
      }
      i {
        background-color: #c0c4cc;
        right: 3px;
        top: 5px;
        color: #fff;
        position: absolute;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.ad {
  .advanceCtr {
    margin-bottom: 10px;
    display: flex;
    .select {
      float: left;
      flex: 1;
      margin-right: 20px;
    }
    .selectmul {
      float: left;
      flex-basis: 280px;
      margin-right: 20px;
    }
  }
  .ctrlbutton {
    margin-bottom: 10px;
    .datar {
      float: right;
      width: 280px;
      flex-grow: 1;
      margin-right: 20px;
    }
    .select {
      float: left;
      width: 240px;
      margin-right: 20px;
    }
    .advanceSelect {
      float: left;
      margin-right: 20px;
    }
    .search {
      float: right;
      width: 200px;
      //   margin-left: 20px;
    }
    .selectr {
      width: 100px;
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
    .autooption {
      display: inline-block;
      position: relative;
      line-height: 40px;
      margin-left: 20px;
      .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
        font-size: 14px;
      }
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
            font-size: 14px;
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
  .list {
    // width: 960px;
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 50px;
  }
}
</style>
