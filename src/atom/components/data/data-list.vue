<template>
  <el-table
    id="dataTable"
    :data="datalist"
    show-summary
    :summary-method="getSummaries"
    @sort-change="sortChange"
  >
    <el-table-column prop="fbAccountId" fixed label="广告账户ID" width="100"></el-table-column>
    <el-table-column prop="adAccountName" fixed label="广告账户名称" width="160"></el-table-column>
    <el-table-column prop="reachNum" label="触达" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="showNum" label="展示" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="clicksNum" label="点击" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="ctr" label="CTR" sortable="custom" width="90">
      <template slot-scope="scope">
        <span>{{scope.row.ctr}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cvr" label="CVR" sortable="custom" width="90">
      <template slot-scope="scope">
        <span>{{scope.row.cvr?scope.row.cvr:'--'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cpm" label="CPM" sortable="custom" width="90">
      <template slot-scope="scope">
        <span>{{scope.row.cpm?scope.row.cpm:'--'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cpc" label="CPC" sortable="custom" width="90">
      <template slot-scope="scope">
        <span>{{scope.row.cpc?scope.row.cpc:'--'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="relevanceScore" label="相关度" sortable="custom" width="90">
      <template slot-scope="scope">
        <span>{{scope.row.relevanceScore?scope.row.relevanceScore:'--'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="installsNum" label="安装" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="spend" label="花费" sortable="custom" width="90">
      <template slot-scope="scope">
        <span>{{scope.row.spend?scope.row.spend:'--'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cpi" label="CPI" sortable="custom" width="90">
      <template slot-scope="scope">
        <span>{{scope.row.cpi?scope.row.cpi:'--'}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    sortChange({ column, prop, order }) {
      let sort = "";
      switch (prop) {
        case "reachNum":
          if (order == "ascending") sort = "reach_num asc";
          else sort = "reach_num desc";
          break;
        case "showNum":
          if (order == "ascending") sort = "show_num asc";
          else sort = "show_num desc";

          break;
        case "clicksNum":
          if (order == "ascending") sort = "clicks_num asc";
          else sort = "clicks_num desc";
          break;
        case "ctr":
          if (order == "ascending") sort = "ctr asc";
          else sort = "ctr desc";
          break;
        case "cvr":
          if (order == "ascending") sort = "cvr asc";
          else sort = "cvr desc";

          break;
        case "cpm":
          if (order == "ascending") sort = "cpm asc";
          else sort = "cpm desc";
          break;
        case "cpc":
          if (order == "ascending") sort = "cpc asc";
          else sort = "cpc desc";
          break;
        case "relevanceScore":
          if (order == "ascending") sort = "relevance_score asc";
          else sort = "relevance_score desc";

          break;
        case "installsNum":
          if (order == "ascending") sort = "installs_num asc";
          else sort = "installs_num desc";
          break;
        case "spend":
          if (order == "ascending") sort = "spend asc";
          else sort = "spend desc";
          break;
        case "cpi":
          if (order == "ascending") sort = "cpi asc";
          else sort = "cpi desc";

          break;
      }

      this.$emit("tableSort", sort);
    },
    getSummaries(param) {
      let { columns, data } = param;
      let sums = [];
      let keyarr = [
        "reachNum",
        "showNum",
        "clicksNum",
        "ctr",
        "cvr",
        "cpm",
        "cpc",
        "relevanceScore",
        "installsNum",
        "spend",
        "cpi"
      ];
      columns.forEach((column, index) => {
        switch (index) {
          case 0:
            sums[index] = "合计";
            break;
          case 1:
            sums[index] = "";
            break;
          default:
            sums[index] = this.datasum[keyarr[index - 2]];
            break;
        }
      });

      return sums;
    }
  },
  computed: {
    ...mapState(["datalist", "datasum"])
  }
};
</script>

<style lang="less" scoped>
.tablelist {
  .download {
    font-size: 14px;
    color: #3297ff;
    text-align: right;
    line-height: 20px;
    margin-bottom: 5px;
    span {
      position: relative;
      padding-right: 24px;
      display: inline-block;
      cursor: pointer;
      .save {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 0;
        top: 2px;
        cursor: pointer;
      }
    }
  }
}
</style>
