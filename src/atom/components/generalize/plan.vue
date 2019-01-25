<template>
  <div class="plan">
    <p class="title">项目{{projectname}}&nbsp;&nbsp;>&nbsp;&nbsp;推广计划管理</p>
    <div class="ctrlbutton">
      <el-dropdown class="select" split-button type="primary">
        创建
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="tocreate">
            <router-link :to="'/project/' + $route.params.id + '/gener/2'">智能推广计划</router-link>
          </el-dropdown-item>
          <el-dropdown-item class="tocreate">
            <router-link :to="'/project/' + $route.params.id + '/gener/1'">通用推广计划</router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input class="search" v-model="state" placeholder="搜索计划ID/名称" suffix-icon="el-icon-search" @input="createSearch"></el-input>
      <el-select class="selectr" v-model="value" placeholder="平台" @change="toSort">
        <el-option v-for="item in platform" :key="item.id" :label="item.marketType" :value="item.marketType">
        </el-option>
      </el-select>
      <el-select class="selectr" v-model="value2" placeholder="国家" @change="toSort">
        <el-option v-for="item in plancountry" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
    </div>
    <div class="list" id="PlanList">
      <plan-list @showCreatelogBox="showCreatelogBox" @showLogdetailbox="showLogdetailbox" @showChangebox="showChangebox" @showCreatebox="showCreatebox" @showAccountbox="showAccountbox"></plan-list>
    </div>
    <div class="pageswitch">
      <el-pagination background @size-change="pageSizeChange" :page-sizes="[20, 200, 500]" layout="total, sizes, prev, pager, next, jumper" :total="pltotal" :page-size="plpagesize" @current-change="pageSwitch">
      </el-pagination>
    </div>
    <change-price :status="status" :manageid="manageid" :goalBid="goalBid" @cancelAddbm="cancelAddbm"></change-price>
    <select-create :status="status1" :id="createid" @cancelAddbm="cancelAddbm" @showCreatebox="showCreatebox"></select-create>
    <auto-select :status="status2" :id="createid" @cancelAddbm="cancelAddbm"></auto-select>
    <select-account :status="status3" :id="accoundid" @cancelAddbm="cancelAddbm"></select-account>
    <log-detail :status="status4" @cancelAddbm="cancelAddbm"></log-detail>
    <log-create :status="status5" :id="createlogid" :name="createlogname" @cancelAddbm="cancelAddbm" @showLogdetailbox="showLogdetailbox"></log-create>
  </div>
</template>

<script>
import LogCreate from "./plan-logcreate.vue";
import LogDetail from "./plan-logdetail";
import SelectAccount from "./plan-selectaccount";
import AutoSelect from "./plan-autoselect";
import SelectCreate from "./plan-selectcreate";
import PlanList from "./plan-list";
import ChangePrice from "./plan-changeprice";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    PlanList,
    ChangePrice,
    SelectCreate,
    AutoSelect,
    SelectAccount,
    LogDetail,
    LogCreate
  },
  beforeRouteLeave(to, from, next) {
    // console.log(to, from, next);
    this.SETSTATE({ k: "ifadcreate", v: false });
    clearInterval(rundetail);
    next();
  },
  data() {
    return {
      state: "",
      value: "",
      value2: "",
      manageid: "",
      goalBid: 0,
      createid: "",
      accoundid: "", // 当前编辑广告账户planid
      logdetailid: "", // 当前创建记录id
      logdetailname: "",
      createlogid: "", //创建广告id
      createlogname: "",
      pageindex: 1,
      status: false,
      status1: false,
      status2: false,
      status3: false,
      // status4: false,
      status5: false
    };
  },
  created() {
    let option = {
      project_id: "",
      country: "",
      platform: "",
      keyword: "",
      pageIndex: 1,
      pageSize: 20
    };

    for (let i in option) {
      var k = "pl_" + i;
      var v = option[i];

      this.SETSTATE({ k, v });
    }
  },
  mounted() {
    let k = "pl_project_id";
    let v = this.$route.params.id;

    this.SETSTATE({ k, v });

    this.$store.dispatch("getPlanlist");

    if (this.actions) {
      let applicationid = this.actions;
      this.$store.dispatch("getPlatform", { applicationid });
    }
    this.$store.dispatch("otherCountries");
    this.$store.dispatch("getPlanCountry", v);
    this.$store.dispatch("getClassify", this.$route.params.id);

    if (this.$route.params.planid) {
      this.accoundid = this.$route.params.planid;
      this.status3 = true;
    }
  },
  computed: {
    ...mapState([
      "itemlist",
      "platform",
      "othercountries",
      "pltotal",
      "plpagesize",
      "plancountry",
      "ifadcreate"
    ]),
    status4() {
      return this.ifadcreate;
    },
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    },
    projectid() {
      return this.$route.params.id;
    },
    actions() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id)
        .applicationId;
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    pageSizeChange(size) {
      let k = "pl_pageSize";
      let v = size;
      this.SETSTATE({ k, v });

      this.$store.dispatch("getPlanlist");
    },
    showCreatelogBox(k, id, name) {
      this[k] = true;
      this.createlogid = id;
      this.createlogname = name;
    },
    showLogdetailbox(k, id, name) {
      this[k] = true;
    },
    showAccountbox(k, id) {
      this[k] = true;
      this.accoundid = id;
    },
    showChangebox(k, id, goalBid) {
      this[k] = true;
      this.manageid = id;
      this.goalBid = goalBid;
    },
    showCreatebox(k, id) {
      this[k] = true;
      this.createid = id;
    },
    cancelAddbm(k) {
      this[k] = false;
    },
    pageSwitch(page) {
      this.pageindex = page;

      let k = "pl_pageIndex";
      let v = page;
      this.SETSTATE({ k, v });

      this.$store.dispatch("getPlanlist");
    },
    createSearch() {
      let self = this;
      let k = "pl_keyword";
      let v = this.state;
      this.SETSTATE({ k, v });
      k = "pl_pageIndex";
      v = 1;
      this.SETSTATE({ k, v });

      setTimeout(function() {
        self.$store.dispatch("getPlanlist");
      }, 300);
    },
    toSort() {
      let k = "pl_country";
      let v = this.value2 == "不限" ? "" : this.value2;
      this.SETSTATE({ k, v });

      k = "pl_platform";
      v = this.value == "不限" ? "" : this.value;
      this.SETSTATE({ k, v });

      k = "pl_pageIndex";
      v = 1;
      this.SETSTATE({ k, v });

      this.$store.dispatch("getPlanlist");
    }
  },
  watch: {
    actions(n, o) {
      if (n) {
        let applicationid = n;
        this.$store.dispatch("getPlatform", { applicationid });
      }
    },
    projectid(n, o) {
      if (n != "") {
        let k = "pl_project_id";
        let v = n;

        this.SETSTATE({ k, v });

        this.SETSTATE({ k: "planlist", v: [] });

        this.$store.dispatch("getPlanlist", { loading: "PlanList" });

        if (this.actions) {
          let applicationid = this.actions;
          this.$store.dispatch("getPlatform", { applicationid });
        }
        this.$store.dispatch("otherCountries");
        this.$store.dispatch("getPlanCountry", v);
        this.$store.dispatch("getClassify", v);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.tocreate {
  padding: 0;
  a {
    display: block;
    padding: 0 20px;
    color: #333;
  }
}
.plan {
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
  .ctrlbutton {
    margin-left: 40px;
    overflow: hidden;
    margin-bottom: 10px;
    .select {
      float: left;
    }
    .search {
      float: right;
      width: 250px;
      margin-left: 20px;
    }
    .selectr {
      width: 150px;
      margin-left: 20px;
      float: right;
    }
  }
  .list {
    margin-left: 40px;
    min-height: 400px;
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 50px;
  }
}
</style>
