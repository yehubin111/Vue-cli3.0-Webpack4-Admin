<template>
  <div class="ad">
    <el-breadcrumb class="title" separator=">">
      <el-breadcrumb-item>项目{{projectname}}</el-breadcrumb-item>
      <el-breadcrumb-item>创意报表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ctrlbutton">
      <el-select
        class="select"
        v-model="form.value1"
        filterable
        remote
        multiple
        collapse-tags
        placeholder="广告账户"
        no-data-text="无数据，请输入或者改变关键字"
        :remote-method="searchAccount"
        @blur="clearArr('adaccount')"
        @change="toSort"
      >
        <el-option
          v-for="(item, index) in adaccount"
          :key="index"
          :label="item.accountName + (item.fbAccountId?'('+item.fbAccountId+')':'')"
          :value="item.fbAccountId"
        ></el-option>
      </el-select>
      <el-button type="text" class="advanceSelect" @click="advanceFilter">高级筛选</el-button>
      <p class="download">
        <span @click="outTable">导出全部
          <svg-icon svgname="save" svgclass="save"></svg-icon>
        </span>
      </p>
      <el-input
        class="search"
        v-model="state"
        placeholder="搜索创意ID/名称"
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
        :disabled="!filter1"
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
    <el-tabs v-model="activeName" class="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="创意" name="first">
        <div class="list">
          <createform-list ref="dataTable" @tableSort="tableSort"></createform-list>
        </div>
        <div class="pageswitch">
          <el-pagination
            background
            @size-change="pageSizeChange"
            :page-sizes="[20, 200, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="pageindex"
            :total="createformtotal"
            :page-size="pagesize"
            @current-change="pageSwitch"
          ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="轮播卡片" name="second">
        <div class="list">
          <createform-card ref="dataTableCard" @tableSort="tableSort"></createform-card>
        </div>
        <div class="pageswitch">
          <el-pagination
            background
            @size-change="pageSizeChange"
            :page-sizes="[20, 200, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="pageindex"
            :total="createcardtotal"
            :page-size="pagesize"
            @current-change="pageSwitch"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CreateformList from "./createform-list";
import CreateformCard from "./createform-card";
import { mapState, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
let search;
let moreoption;
export default {
  data() {
    return {
      state: "",
      ifadvance: false,
      filter1: true,
      filter2: true,
      sort: "",
      // ifroll: true,
      cardname: "first",
      activeName: "first",
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
    CreateformList,
    CreateformCard
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

    this.$store.dispatch("getCreateformList", { option });
    // this.$store.dispatch("getCreatecardList", { option: {} });
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    handleClick(card) {
      console.log(card.name);
      this.cardname = card.name;

      // this.form.value1 = [];
      // this.form.value2 = [];
      // this.form.value3 = [];
      // this.form.value4 = [];
      // this.form.value5 = [];
      // this.form.value6 = [];
      // this.form.value7 = [];
      // this.state = "";
      // this.form.value8 = [
      //   new Date().setDate(new Date().getDate() - 1),
      //   new Date().setDate(new Date().getDate() - 1)
      // ];
      // this.pageindex = 1;
      // this.pagesize = 20;
      // this.sort = '';

      // let option = {
      //   pageNo: 1,
      //   pageSize: 20,
      //   projectId: this.$route.params.id,
      //   endDate: this.$timeFormat(this.form.value8[1], "yyyy-MM-dd"),
      //   startDate: this.$timeFormat(this.form.value8[0], "yyyy-MM-dd")
      // };

      /**
       * 切换的时候清空排序条件
       */
      this.sort = "";

      if (this.cardname == "first") {
        // this.$store.dispatch("getCreateformList", { option });
        this.SETSTATE({ k: "createcardlist", v: [] });
        // 删除排序
        this.$refs.dataTable.$refs.dataForm.clearSort();
      } else {
        // this.$store.dispatch("getCreatecardList", { option });
        this.SETSTATE({ k: "createformlist", v: [] });
        // 删除排序
        this.$refs.dataTableCard.$refs.dataCard.clearSort();
      }

      this.toGetdata();
    },
    clearArr(k) {
      let v = [];
      this.SETSTATE({ k, v });
    },
    searchAccount(kword) {
      let accountKeyword = kword;
      clearTimeout(moreoption);

      moreoption = setTimeout(() => {
        this.$store.dispatch("getOptionMore", {
          projectId: this.$route.params.id,
          accountKeyword
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
      let option = {
        ageList: this.form.value4.join(","),
        countryList: this.form.value3.join(","),
        endDate: this.$timeFormat(this.form.value8[1], "yyyy-MM-dd"),
        fbAdAccountIdList: this.form.value1.join(","),
        // fbAdCampaignIdList: this.form.value2.join(","),
        fbAdCreativeIdList: "",
        fbAppId: "",
        flag: "",
        genderList: this.form.value5.join(","),
        impressionDeviceList: this.form.value7.join(","),
        insightDate: "",
        orderByClause: this.sort,
        pageNo: 1,
        pageSize: this.createformtotal,
        platformPositionList: this.form.value6.join(","),
        startDate: this.$timeFormat(this.form.value8[0], "yyyy-MM-dd"),
        accountKeyword: "",
        campainKeyword: "",
        creativeKeyword: this.state,
        projectId: this.$route.params.id
      };

      let name = "";

      if (this.cardname == "first") {
        name = `${this.projectname}创意报表${this.$timeFormat(
          new Date(),
          "yyyyMMddHHmmss"
        )}`;
        this.$store.dispatch("getCreateformListout", { option, name });
      } else {
        name = `${this.projectname}轮播卡片${this.$timeFormat(
          new Date(),
          "yyyyMMddHHmmss"
        )}`;
        this.$store.dispatch("getCreatecardListout", { option, name });
      }
      // this.$exportHTML("dataTable", name);
    },
    toSort() {
      this.pageindex = 1;

      if (
        this.form.value3.length > 0 ||
        this.form.value4.length > 0 ||
        this.form.value5.length > 0
      )
        this.filter2 = false;
      else this.filter2 = true;

      if (this.form.value6.length > 0 || this.form.value7.length > 0)
        this.filter1 = false;
      else this.filter1 = true;

      this.toGetdata();
    },
    toGetdata() {
      console.log(this.form);
      let option = {
        ageList: this.form.value4.join(","),
        countryList: this.form.value3.join(","),
        endDate: this.$timeFormat(this.form.value8[1], "yyyy-MM-dd"),
        fbAdAccountIdList: this.form.value1.join(","),
        // fbAdCampaignIdList: this.form.value2.join(","),
        fbAdCreativeIdList: "",
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
        accountKeyword: "",
        campainKeyword: "",
        creativeKeyword: this.state,
        projectId: this.$route.params.id
      };

      if (this.cardname == "first")
        this.$store.dispatch("getCreateformList", { option });
      else this.$store.dispatch("getCreatecardList", { option });
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
      "adaccount",
      "adcampaign",
      "datacountry",
      "dataage",
      "dataplatform",
      "dataimpression",
      "createformtotal",
      "createcardtotal"
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
  flex-grow: 1;
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
    margin-left: 40px;
    .back {
      color: #333;
    }
  }
  .activeName {
    margin-left: 40px;
  }
  .advanceCtr {
    margin-left: 40px;
    overflow: hidden;
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
    .datar {
      float: right;
      width: 200px;
      flex-grow: 1;
    }
  }
  .ctrlbutton {
    margin-left: 40px;
    overflow: hidden;
    margin-bottom: 10px;
    .datar {
      float: right;
      width: 280px;
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
    .rollswitch {
      float: right;
      margin-top: 10px;
      margin-right: 10px;
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
  .list {
    // margin-left: 40px;
    // width: 960px;
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 50px;
  }
}
</style>
