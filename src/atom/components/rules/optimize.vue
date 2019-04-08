<template>
  <div class="optimize">
    <p class="title">项目{{projectname}}&nbsp;&nbsp;>&nbsp;&nbsp;优化记录</p>
    <div class="sort">
      <el-select
        class="select"
        v-model="account"
        filterable
        multiple
        collapse-tags
        placeholder="广告账户"
        @change="toSort"
      >
        <el-option
          v-for="item in adaccountlist"
          :key="item.fbId"
          :label="item.name + (item.fbId != -1?'('+item.fbId+')':'')"
          :value="item.fbId"
        ></el-option>
      </el-select>
      <el-date-picker
        v-model="sortdate"
        @change="toSort"
        class="daterange"
        type="daterange"
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-checkbox v-model="checked" @change="toSort">不显示未更改</el-checkbox>
    </div>
    <div class="dialog">
      <optimize-list></optimize-list>
    </div>
    <div class="pageswitch">
      <el-pagination
        background
        @size-change="pageSizeChange"
        :page-sizes="[20, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="optotal"
        :page-size="pagesize"
        :current-page="pageindex"
        @current-change="pageSwitch"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import OptimizeList from "./optimize-list";
export default {
  props: ["id"],
  components: {
    OptimizeList
  },
  data() {
    return {
      account: [],
      sortdate: [new Date().setDate(new Date().getDate() - 6), new Date()],
      checked: false,
      pageindex: 1,
      pagesize: 20,
      fbruleid: ''
    };
  },
  computed: {
    ...mapState(["itemlist", "adaccountlist", "optotal"]),
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    },
    ruleId() {
      return this.$route.params.ruleId;
    }
  },
  mounted() {
    this.fbruleid = this.$route.params.ruleId;
    this.toSort();

    let n = this.$route.params.id;
    // this.$store.dispatch("getOptimizeAccount", n);
    this.$store.dispatch("getAdaccount", n);
  },
  methods: {
    pageSizeChange(size) {
      this.pageindex = 1;
      this.pagesize = size;
      this.toSort();
    },
    pageSwitch(page) {
      this.pageindex = page;

      this.toSort();
    },
    toSort() {
      let option = {
        projectId: this.$route.params.id,
        fbRuleId: this.fbruleid,
        fbAccountIds: this.account.map(v => v.replace("act_", "")).join(","),
        startDate:
          this.sortdate && this.sortdate.length > 0
            ? this.$timeFormat(this.sortdate[0], "yyyy-MM-dd")
            : "",
        endDate:
          this.sortdate && this.sortdate.length > 0
            ? this.$timeFormat(this.sortdate[1], "yyyy-MM-dd")
            : "",
        withoutUnChange: this.checked.toString(),
        pageSize: this.pagesize,
        pageIndex: this.pageindex
      };

      this.$store.dispatch("getOptimizeList", option);
    }
  },
  watch: {
    ruleId(n, o) {
      this.fbruleid = n;
      this.toSort(); 
    }
  }
};
</script>

<style lang="less" scoped>
.optimize {
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
  .sort {
    margin-left: 40px;
    margin-bottom: 20px;
    .select {
      width: 360px;
      margin-right: 20px;
    }
    .daterange {
      margin-right: 20px;
    }
    .label {
      font-size: 14px;
      margin-right: 5px;
    }
  }
  .dialog {
    margin-left: 40px;
    //   width: 100%;
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
