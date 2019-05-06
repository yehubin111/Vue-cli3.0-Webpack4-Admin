<template>
  <div class="rule">
    <bread-crumb pageName="创意管理"></bread-crumb>
    <div class="ctrlbutton">
      <!-- <el-button class="add" type="primary" @click="status4 = true">新增创意</el-button> -->
      <el-dropdown class="add" split-button type="primary" @command="addCreateType">
        新增创意
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">单图片/视频</el-dropdown-item>
          <el-dropdown-item command="b">轮播</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="add" @click="syncAll">同步全部</el-button>
      <el-input class="search" v-model="state4" placeholder="搜索创意名称/ID" suffix-icon="el-icon-search" @input="createSearch"></el-input>
    </div>
    <div class="sort">
      <!-- <span class="label">规则：</span> -->
      <el-dropdown class="select" split-button type="primary" @command="handleCommand">
        批量操作
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">批量新增</el-dropdown-item>
          <el-dropdown-item command="e">批量同步</el-dropdown-item>
          <el-dropdown-item command="b">批量开启</el-dropdown-item>
          <el-dropdown-item command="c">批量关闭</el-dropdown-item>
          <el-dropdown-item command="d">批量新增国家</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="text" class="fontbtn" @click="toSelectAll">{{createcheckstatus?'取消全选': '全选'}}</el-button>
      <el-select class="selectr" v-model="value2" placeholder="状态" @change="toSort">
        <el-option v-for="item in statuslist" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select class="selectr" v-model="value3" placeholder="性别" @change="toSort">
        <el-option v-for="item in sexlist" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select class="selectr" v-model="value4" placeholder="国家" @change="toSort">
        <el-option v-for="item in countries" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-select class="selectr" v-model="value5" placeholder="分类" @change="toSort">
        <el-option v-for="(item, index) in classify" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
    </div>
    <create-list @changeName="changeName" @changeCountry="changeCountry"></create-list>
    <div class="pageswitch">
      <el-pagination background @size-change="pageSizeChange" :page-sizes="[20, 200, 500]" layout="total, sizes, prev, pager, next, jumper" :total="crtotal" :page-size="21" @current-change="pageSwitch">
      </el-pagination>
    </div>
    <add-country :status="status3" @cancelAddbm="cancelAddbm" @toAddCountries="toAddCountries"></add-country>
    <create-add :status="status4" @cancelAddbm="cancelAddbm"></create-add>
    <create-addwith :status="status5" @cancelAddbm="cancelAddbm" @prevAddcreate="prevAddcreate"></create-addwith>
    <edit-name :status="status6" @cancelAddbm="cancelAddbm" :oldid="oldid" :oldname="oldname"></edit-name>
    <edit-country :status="status7" @cancelAddbm="cancelAddbm" :oldid="oldid" :oldcountry="oldcountry"></edit-country>
    <create-sync :status="status8" @cancelAddbm="cancelAddbm" @toSync="toSync" :ifsyncall="ifsyncall"></create-sync>
    <create-carousel :status="status9" @cancelAddbm="cancelAddbm"></create-carousel>
    <select-img @hideSelect="hideSelect" :status="selectstatus"></select-img>
  </div>
</template>

<script>
import SelectImg from './create-selectimg';
import BreadCrumb from '@/atom/components/project-breadcrumb';
import CreateSync from "./create-sync";
import EditCountry from "./create-editcountry";
import EditName from "./create-editname";
import CreateAddwith from "./create-addwith";
import CreateAdd from "./create-add";
import CreateList from "./create-list";
import AddCountry from "./create-addcountry";
import CreateCarousel from './create-carousel';
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning, Msgnotify } from "../../js/message";
let tosearch;
export default {
  components: {
    CreateList,
    AddCountry,
    CreateAdd,
    CreateAddwith,
    EditName,
    EditCountry,
    CreateSync,
    CreateCarousel,
    BreadCrumb,
    SelectImg
  },
  data() {
    return {
      status1: false,
      status2: false,
      status3: false,
      status4: false,
      status5: false,
      status6: false,
      status7: false,
      status8: false,
      status9: false,
      // status6: false,
      // option: '',
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      state4: "", // 搜索关键字
      pageindex: 1,
      pagesize: 20,
      oldid: "",
      ifsyncall: false,
      oldname: "",
      oldcountry: [],
      ifsyncall: false,
      statuslist: [
        {
          value: "-1",
          label: "不限"
        },
        {
          value: "0",
          label: "关闭"
        },
        {
          value: "1",
          label: "开启"
        }
      ],
      sexlist: [
        {
          value: "-1",
          label: "不限"
        },
        {
          value: "1,2",
          label: "全部"
        },
        {
          value: "1",
          label: "男"
        },
        {
          value: "2",
          label: "女"
        }
      ],
      ctrllist: [
        {
          value: "1",
          label: "批量新增"
        },
        {
          value: "2",
          label: "批量开启"
        },
        {
          value: "3",
          label: "批量关闭"
        },
        {
          value: "4",
          label: "批量添加国家"
        }
      ]
    };
  },
  created() {
    let option = {
      creativityName: "",
      classify: "",
      countryId: "",
      sex: "",
      status: "",
      pageIndex: 1,
      pageSize: 20
    };

    for (let i in option) {
      var k = "cr_" + i;
      var v = option[i];

      this.SETSTATE({ k, v });
    }
  },
  mounted() {
    this.$store.dispatch("getClassify", this.$route.params.id);
    this.$store.dispatch("getCountries", this.$route.params.id);
    this.$store.dispatch("otherCountries");

    let projectId = this.$route.params.id;
    this.SETSTATE({ k: 'cr_projectId', v: projectId });

    this.SETSTATE({ k: "createlist", v: [] });

    this.$store.dispatch("getCreateList", { loading: "createList" });
    // 新增创意用
    // 获取主页
    this.$store.dispatch('commonPage', {project_id: projectId});
    this.$store.dispatch("getAllactions");

    let application = this.itemlist.find(v => v.id == this.$route.params.id);
    // 获取广告账户
    this.$store.dispatch("commonAccount", {project_id:this.$route.params.id});
  },
  watch: {

  },
  computed: {
    ...mapState([
      "itemlist",
      "classify",
      "countries",
      "crtotal",
      "crpagesize",
      "createchecked",
      "imgselect"
      // "createcheckstatus"
    ]),
    ...mapGetters(["allcheckidstatus", "createcheckstatus"]),
    selectstatus() {
      return this.imgselect;
    }
  },
  methods: {
    ...mapMutations(["ALLSELECT", "SETSTATE"]),
    hideSelect() {
      this.SETSTATE({k: 'imgselect', v: false});
    },
    toSync(ar) {
      let accountIds = ar.join(",");
      let ids = this.allcheckidstatus.map(v => v.id).join(",");
      let projectId = this.$route.params.id;

      let dangerouslyUseHTMLString = true;

      Msgnotify(
        "创意同步",
        `创意同步中... <a class="synctodetail" href="#/project/${
          this.$route.params.id
        }/sync">查看详情</a>`,
        dangerouslyUseHTMLString
      );
      // Msgwarning(
      //   `创意同步中... <a class="synctodetail" href="#/project/${
      //     this.$route.params.id
      //   }/sync">查看详情</a>`,
      //   dangerouslyUseHTMLString
      // );

      // return;

      if (this.ifsyncall)
        this.$store.dispatch("syncAll", { accountIds, projectId });
      else this.$store.dispatch("syncGroup", { accountIds, ids, projectId });
    },
    changeCountry(id, country) {
      this.oldid = id;
      this.oldcountry = country.split(",").slice(0);
      console.log(country.split(","));

      this.status7 = true;
    },
    changeName(id, name) {
      console.log(id, name);
      this.oldid = id;
      this.oldname = name;
      this.status6 = true;
    },
    // toNext(option) {
    //   this.option = option;
    //   this.status6 = true;
    // },
    // toPrev() {
    //   this.status5 = true;
    // },
    toAddCountries(ar) {
      let arr = [];
      this.allcheckidstatus.forEach(v => {
        arr.push(v.id);
      });
      let creativityIds = arr.join(",");
      let countryId = ar;
      this.$store.dispatch("addCountries", { creativityIds, countryId });

      this.status3 = false;
    },
    cancelAddbm(k) {
      this[k] = false;
    },
    prevAddcreate(k) {
      this[k] = true;
    },
    syncAll() {
      // let id = this.$route.params.id;
      this.status8 = true;
      this.ifsyncall = true;
      // this.$store.dispatch("syncAll", { id });
    },
    addCreateType(command) {
      switch (command) {
        case "a":
          this.status4 = true;
          break;
        case "b":
          this.status9 = true;
          break;
      }
    },
    handleCommand(command) {
      // console.log(command);
      let option = this.allcheckidstatus;
      console.log(option);
      // 批量新增为特殊情况
      switch (command) {
        case "a":
          this.status5 = true;
          break;
        case "b":
          if (this.createchecked.filter(v => v).length == 0) {
            Msgwarning("请先选择需要批量处理的创意");
            return;
          }

          this.$store.dispatch("openCreate", { option });
          break;
        case "c":
          if (this.createchecked.filter(v => v).length == 0) {
            Msgwarning("请先选择需要批量处理的创意");
            return;
          }

          this.$store.dispatch("closeCreate", { option });
          break;
        case "d":
          if (this.createchecked.filter(v => v).length == 0) {
            Msgwarning("请先选择需要批量处理的创意");
            return;
          }

          this.status3 = true;
          break;
        case "e":
          if (this.createchecked.filter(v => v).length == 0) {
            Msgwarning("请先选择需要批量处理的创意");
            return;
          }

          this.status8 = true;
          this.ifsyncall = false;
          break;
      }
    },
    toSelectAll() {
      this.ALLSELECT();
    },
    createSearch() {
      let self = this;
      clearTimeout(tosearch);

      tosearch = setTimeout(function() {
        self.toSort();
      }, 300);
    },
    pageSwitch(page) {
      this.pageindex = page;

      this.toSort();
    },
    pageSizeChange(size) {
      this.pagesize = size;
      this.toSort();
    },
    toSort() {
      let option = {
        creativityName: this.state4,
        classify: this.value5 == "不限" ? "" : this.value5,
        countryId: this.value4 == "不限" ? "" : this.value4,
        sex: this.value3 == "-1" ? "" : this.value3,
        status: this.value2 == "-1" ? "" : this.value2,
        pageIndex: this.pageindex,
        pageSize: this.pagesize
      };

      for (let i in option) {
        var k = "cr_" + i;
        var v = option[i];

        this.SETSTATE({ k, v });
      }

      this.$store.dispatch("getCreateList");
    }
  }
};
</script>
<style>
.synctodetail {
  color: #409eff;
}
</style>

<style lang="less" scoped>
.rule {
  .ctrlbutton {
    overflow: hidden;
    margin-bottom: 10px;
    .add {
      float: left;
      margin-right: 10px;
    }
    .search {
      float: right;
      width: 250px;
    }
  }
  .sort {
    margin-bottom: 20px;
    overflow: hidden;
    .fontbtn {
      float: left;
    }
    .select {
      margin-right: 20px;
      float: left;
    }
    .selectr {
      width: 100px;
      margin-left: 20px;
      float: right;
    }
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 50px;
  }
}
</style>
