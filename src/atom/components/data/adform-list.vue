<template>
  <el-table id="dataTable" :data="adformlist" style="width: 960px" show-summary :summary-method="getSummaries" @sort-change="sortChange">
    <el-table-column prop="adCampaignName" fixed label="广告系列名称" width="160">
    </el-table-column>
    <el-table-column prop="adPlanName" fixed label="推广计划名称" width="160">
    </el-table-column>
    <el-table-column prop="reachNum" label="触达" sortable="custom" width="90">
    </el-table-column>
    <el-table-column prop="showNum" label="展示" sortable="custom" width="90">
    </el-table-column>
    <el-table-column prop="clicksNum" label="点击" sortable="custom" width="90">
    </el-table-column>
    <el-table-column prop="ctr" label="CTR" sortable="custom" width="90">
    </el-table-column>
    <el-table-column prop="cvr" label="CVR" sortable="custom" width="90">
    </el-table-column>
    <el-table-column prop="cpm" label="CPM" sortable="custom" width="90">
    </el-table-column>
    <el-table-column prop="cpc" label="CPC" sortable="custom" width="90">
    </el-table-column>
    <el-table-column prop="relevanceScore" label="相关度" sortable="custom" width="90">
    </el-table-column>
    <el-table-column prop="installsNum" label="安装" sortable="custom" width="90">
    </el-table-column>
    <el-table-column prop="spend" label="花费" sortable="custom" width="90">
    </el-table-column>
    <el-table-column prop="cpi" label="CPI" sortable="custom" width="90">
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
    outTable() {
      let name = `应用统计表_${this.$timeFormat(new Date(), "yyyyMMddHHmmss")}`;
      this.$exportHTML("outTable", name);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        } else if (
          index === 1 ||
          index === 8 ||
          index === 5 ||
          index === 6 ||
          index === 7
        ) {
          sums[index] = "";
          return;
        } else if (index === 12) {
          sums[12] = isNaN((sums[11] / sums[10]).toFixed(2))
            ? ""
            : (sums[11] / sums[10]).toFixed(2);
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] =
            sums[index].toString().indexOf(".") != -1
              ? sums[index].toFixed(2)
              : sums[index];
        } else {
          sums[index] = "";
        }
      });

      return sums;
    }
  },
  computed: {
    ...mapState(["adformlist"])
  }
};
</script>

<style lang="less">
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
