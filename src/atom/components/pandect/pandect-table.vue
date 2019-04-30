<template>
  <div class="tablelist">
    <p class="download">
      <span @click="outTable"> 导出全部
        <svg-icon svgclass="save" svgname="save"></svg-icon>
      </span>
    </p>
    <el-table id="outTable" :data="appdatalist" style="width: 100%" show-summary :summary-method="getSummaries" :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column prop="app" label="APP">
      </el-table-column>
      <el-table-column prop="cd" label="触达" sortable width="110">
      </el-table-column>
      <el-table-column prop="zs" label="展示" sortable width="110">
      </el-table-column>
      <el-table-column prop="dj" label="点击" sortable width="90">
      </el-table-column>
      <el-table-column prop="ctr" label="CTR" sortable width="80">
      </el-table-column>
      <el-table-column prop="cvr" label="CVR" sortable width="80">
      </el-table-column>
      <el-table-column prop="cpm" label="CPM" sortable width="80">
      </el-table-column>
      <el-table-column prop="cpc" label="CPC" sortable width="80">
      </el-table-column>
      <!-- <el-table-column
        prop="xgd"
        label="相关度"
        sortable
        width="90">
      </el-table-column> -->
      <el-table-column prop="az" label="安装" sortable width="90">
      </el-table-column>
      <el-table-column prop="hf" label="花费" sortable width="110">
      </el-table-column>
      <el-table-column prop="cpi" label="CPI" sortable width="80">
      </el-table-column>
      <el-table-column prop="afInstallsNum" label="监测平台安装" width="130">
      </el-table-column>
      <el-table-column prop="gap" label="GAP" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.gap}}%</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
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
        } else if (index === 4 || index === 5 || index === 6 || index === 7) {
          sums[index] = "";
          return;
        } else if (index === 10) {
          sums[10] = (sums[9] / sums[8]).toFixed(2);
          return;
        } else if (index === 12) {
          sums[12] = ((sums[11] - sums[8]) * 100 / sums[8]).toFixed(2);
          sums[12] = sums[12] < 0 ? sums[12] + "%" : "+" + sums[12] + "%";
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
    ...mapState(["appdataappid"]),
    ...mapGetters(["appdatalist"])
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
