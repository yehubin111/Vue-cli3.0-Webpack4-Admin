<template>
  <el-table
    id="dataTable"
    ref="dataForm"
    @sort-change="sortChange"
    :data="createformlist"
    show-summary
    :summary-method="getSummaries"
  >
    <el-table-column prop="creativeId" fixed label="创意ID" width="100"></el-table-column>
    <el-table-column prop="adCreativeName" fixed label="创意名称" width="160"></el-table-column>
    <el-table-column prop="imageUrl" label="缩略图" width="90">
      <template slot-scope="scope">
        <span class="headpic">
          <img :src="scope.row.img" alt>
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="country" label="国家" width="90"></el-table-column>
    <el-table-column prop="reachNum" label="触达" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="showNum" label="展示" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="clicksNum" label="点击" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="ctr" label="CTR" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="cvr" label="CVR" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="cpm" label="CPM" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="cpc" label="CPC" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="relevanceScore" label="相关度" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="installsNum" label="安装" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="spend" label="花费" sortable="custom" width="90"></el-table-column>
    <el-table-column prop="cpi" label="CPI" sortable="custom" width="90"></el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  mounted() {
    console.log(this.$refs);
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
          case 2:
          case 3:
            sums[index] = "";
            break;
          default:
            sums[index] = this.createformsum[keyarr[index - 4]];
            break;
        }
      });

      return sums;
    }
  },
  computed: {
    ...mapState(["createformlist", "createformsum"])
  }
};
</script>

<style lang="less" scoped>
.headpic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  background-color: #f5f5f5;
  position: relative;
  img {
    // width: 100%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    height: 100%;
  }
}
</style>
