<template>
  <div class="optimize">
    <bread-crumb pageName="优化记录"></bread-crumb>
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
          v-for="item in commonaccount"
          :key="item.fbAccountId"
          :label="item.name + (item.fbAccountId != -1?'('+item.fbAccountId+')':'')"
          :value="item.fbAccountId"
          :disabled="item.accountStatus != 1"
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
import OptimizeList from "./optimize-list";
import BreadCrumb from '@/atom/components/project-breadcrumb';
import { mapState, mapGetters } from "vuex";
export default {
  props: ["id"],
  components: {
    OptimizeList,
    BreadCrumb
  },
  data() {
    return {
      account: [],
      sortdate: [new Date().setDate(new Date().getDate() - 6), new Date()],
      checked: false,
      pageindex: 1,
      pagesize: 20,
      fbruleid: ""
    };
  },
  computed: {
    ...mapState(["commonaccount", "optotal"]),
    ruleId() {
      return this.$route.params.ruleId;
    }
  },
  mounted() {
    this.fbruleid = this.$route.params.ruleId;
    this.toSort();

    let n = this.$route.params.id;
    // 获取广告账户
    this.$store.dispatch("commonAccount", { project_id: n });
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
  .sort {
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
    //   width: 100%;
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
