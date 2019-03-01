<template>
  <el-container class="contain">
    <div class="noapp" v-if="ifaccount && appcount == 0">
      <p class="title">暂无应用</p>
      <router-link class="el-button toadd" to="/app" @click="toAddapp">去添加</router-link>
    </div>
    <div class="hasapp" v-else>
      <el-main class="main1">
        <pandect></pandect>
      </el-main>
      <el-main class="main2">
        <sort @selectProject="selectProject"></sort>
      </el-main>
      <el-main class="main1">
        <table-list></table-list>
      </el-main>
      <el-main class="main2">
        <app-chart></app-chart>
      </el-main>
      <el-main class="main1" v-if="ifapp && countryfilter.length > 0">
        <other-table :name="appname"></other-table>
        <div class="pageswitch">
          <el-pagination
            background
            @size-change="pageSizeChange"
            layout="total, sizes, prev, pager, next, jumper"
            :total="appdatatotal"
            :current-page="appdataindex"
            :page-sizes="[20, 200, 500]"
            :page-size="20"
            @current-change="pageSwitch"
          ></el-pagination>
        </div>
      </el-main>
      <el-footer></el-footer>
    </div>
  </el-container>
</template>

<script>
import Pandect from "./pandect-pandect";
import Sort from "./pandect-sort";
import TableList from "./pandect-table";
import AppChart from "./pandect-appchart";
import OtherTable from "./pandect-othertable";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  components: {
    Pandect,
    Sort,
    TableList,
    AppChart,
    OtherTable
  },
  data() {
    return {
      appname: ""
    };
  },
  computed: {
    ...mapState([
      "ifapp",
      "appdatatotal",
      "countryfilter",
      "appcount",
      "ifaccount"
    ])
  },
  created() {
    // 清除老的缓存
    if (pandectOptionLS.old && localStorage.getItem(pandectOptionLS.old)) {
      localStorage.removeItem(pandectOptionLS.old);
    }
    if (pandectEventLS.old && localStorage.getItem(pandectEventLS.old)) {
      localStorage.removeItem(pandectEventLS.old);
    }

    let k = "ifapp";
    let v = "";
    this.SETSTATE({ k, v });

    k = "ifaccount";
    v = false;
    this.SETSTATE({ k, v });

    let startDate = this.$timeFormat(
      new Date().getTime() - 7 * 24 * 3600 * 1000,
      "yyyy-MM-dd"
    );
    let endDate = this.$timeFormat(new Date(), "yyyy-MM-dd");

    k = "appdatastartdate";
    v = startDate;
    this.SETSTATE({ k, v });

    (k = "appdataenddate"), (v = endDate);
    this.SETSTATE({ k, v });

    this.$store.dispatch("infoInit", { startDate, endDate });

    this.$store.dispatch("getAppCount");
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    toAddapp() {},
    pageSizeChange(size) {
      let k = "appdatapagesize";
      let v = size;

      this.SETSTATE({ k, v });
      this.$store.dispatch("selectApptable");
    },
    pageSwitch(page) {
      let k = "appdataindex";
      let v = page;

      this.SETSTATE({ k, v });

      this.$store.dispatch("selectApptable");
    },
    selectProject(name) {
      this.appname = name;
    }
  }
};
</script>

<style lang="less" scoped>
.main1 {
  padding: 0;
  overflow: visible;
}
.main2 {
  padding: 20px 0;
}
.contain {
  width: 1200px;
  margin: 0 auto;
}
.topselect {
  background-color: transparent;
}
.pageswitch {
  text-align: center;
  margin-top: 20px;
}
.hasapp {
  width: 1200px;
}
.noapp {
  width: 1200px;
  margin: 0 auto;
  text-align: center;
  .title {
    font-size: 16px;
    text-align: center;
    line-height: 40px;
    margin-top: 100px;
  }
  .info {
    font-size: 14px;
    text-align: center;
    line-height: 40px;
    color: #999;
  }
  .el-button {
    padding: 10px 40px;
    margin-top: 15px;
    border-radius: 18px;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
  }
}
</style>
