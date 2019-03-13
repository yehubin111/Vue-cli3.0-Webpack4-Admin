<template>
  <div class="ad">
    <p class="title">项目{{projectname}}&nbsp;&nbsp;>&nbsp;&nbsp;每日CPI</p>
    <div class="ctrlbutton">
      <el-date-picker class="datar" v-model="form.value" type="daterange" range-separator="至" :clearable="false" start-placeholder="开始日期" end-placeholder="结束日期" @change="toSort">
      </el-date-picker>
    </div>
    <div class="chart">
      <dayapi-chart></dayapi-chart>
    </div>
    <p class="download">
      <span @click="outTable"> 导出全部
        <svg-icon svgname="save" svgclass="save"></svg-icon>
      </span>
    </p>
    <div class="list" v-if="cpicountry.length > 0">
      <dayapi-list @tableSort="tableSort" @tableFilter="tableFilter"></dayapi-list>
    </div>
    <div class="pageswitch">
      <el-pagination background @size-change="pageSizeChange" :page-sizes="[20, 200, 500]" layout="total, sizes, prev, pager, next, jumper" :current-page="pageindex" :total="daycpitotal" :page-size="20" @current-change="pageSwitch">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import DayapiChart from "./dayapi-chart";
import DayapiList from "./dayapi-list";
import { mapState, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
let search;
export default {
  data() {
    return {
      sort: '',
      filtercountry: '',
      filtercompress: '',
      form: {
        value: [new Date().setDate(new Date().getDate() - 6), new Date()]
      },
      pageindex: 1,
      pagesize: 20
    };
  },
  components: {
    DayapiList,
    DayapiChart
  },
  created() {
    // this.$store.dispatch("getCondition");

    let option = {
      pageNo: 1,
      pageSize: 20,
      startDate: this.$timeFormat(
        new Date().getTime() - 6 * 24 * 3600 * 1000,
        "yyyy-MM-dd"
      ),
      // impressionDeviceList: this.filtercompress,
      endDate: this.$timeFormat(new Date().getTime(), "yyyy-MM-dd"),
      projectId: this.$route.params.id
    };

    this.$store.dispatch("getDaycpiList", { option });
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    tableFilter(country, platform) {
      // console.log(country, impress);
      this.pageindex = 1;
      this.filtercountry = country;
      this.filtercompress = platform;
      this.toGetdata();
    },
    tableSort(sort) {
      this.sort = sort;
      this.toGetdata();
    },
    pageSizeChange(size) {
      this.pagesize = size;

      this.toGetdata();
    },
    outTable() {
      let name = `${this.projectname}每日CPI${this.$timeFormat(
        new Date(),
        "yyyyMMddHHmmss"
      )}`;

      let option = {
        endDate:
          this.form.value.length > 0
            ? this.$timeFormat(this.form.value[1], "yyyy-MM-dd")
            : this.$timeFormat(new Date().getTime(), "yyyy-MM-dd"),
        pageNo: 1,
        pageSize: this.daycpitotal,
        orderByClause: this.sort,
        countryList: this.filtercountry,
        userOsList: this.filtercompress,
        startDate:
          this.form.value.length > 0
            ? this.$timeFormat(this.form.value[0], "yyyy-MM-dd")
            : this.$timeFormat(
                new Date().getTime() - 6 * 24 * 3600 * 1000,
                "yyyy-MM-dd"
              ),
        projectId: this.$route.params.id
      };

      this.$store.dispatch("getDaycpiListout", { option, name });

      // this.$exportHTML("daycpiTable", name);
    },
    toGetdata() {
      console.log(this.form);
      let option = {
        endDate:
          this.form.value && this.form.value.length > 0
            ? this.$timeFormat(this.form.value[1], "yyyy-MM-dd")
            : "",
        pageNo: this.pageindex,
        pageSize: this.pagesize,
        countryList: this.filtercountry,
        userOsList: this.filtercompress,
        startDate:
          this.form.value && this.form.value.length > 0
            ? this.$timeFormat(this.form.value[0], "yyyy-MM-dd")
            : "",
        projectId: this.$route.params.id
      };

      this.$store.dispatch("getDaycpiList", { option, sort: this.sort });
    },
    toSort() {
      this.pageindex = 1;

      this.toGetdata();
    },
    pageSwitch(page) {
      this.pageindex = page;

      this.toGetdata();
    }
  },
  computed: {
    ...mapState(["itemlist", "daycpitotal", "cpicountry"]),
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    }
  }
};
</script>

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
  .download {
    font-size: 14px;
    color: #3297ff;
    text-align: right;
    float: right;
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
  .ctrlbutton {
    margin-left: 40px;
    overflow: hidden;
    margin-bottom: 10px;
    .datar {
      float: right;
      //   margin-left: 20px;
    }
  }
  .list {
    margin-left: 40px;
    // width: 960px;
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 50px;
  }
}
</style>
