<template>
  <el-table
    id="daycpiTable"
    :data="daycpilist"
    show-summary
    :summary-method="getSummaries"
    @filter-change="toFilter"
    @sort-change="sortChange"
  >
    <el-table-column prop="insightDate" label="日期">
      <template slot-scope="scope">
        <span>{{scope.row.insightDate | timeFormat}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="country"
      :filters="cpiCountry"
      label="国家"
      :filter-method="filterTag"
      filter-placement="bottom-end"
    ></el-table-column>
    <el-table-column
      prop="userOs"
      :filters="[{text: 'Android', value: 'platform|Android'},{text: 'iOS', value: 'platform|iOS'}]"
      label="平台"
      :filter-method="filterTag2"
      filter-placement="bottom-end"
    >
      <template slot-scope="scope">
        <span>{{scope.row.userOs?scope.row.userOs:'--'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="installsNum" label="安装" sortable="custom"></el-table-column>
    <el-table-column prop="spend" label="花费" sortable="custom">
      <template slot-scope="scope">
        <span>{{scope.row.spend?parseFloat(scope.row.spend).toFixed(2):'--'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="cpi" label="CPI" sortable="custom">
      <template slot-scope="scope">
        <span>{{scope.row.cpi?parseFloat(scope.row.cpi).toFixed(2):'--'}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      filters: {
        country: [],
        // imporession: [],
        platform: []
      }
    };
  },
  methods: {
    toFilter(filters) {
      // console.log(filters);

      for (let i in filters) {
        this.filters[i] = filters[i];
      }

      let countryar = [];
      let platformar = [];

      for (let p in this.filters) {
        this.filters[p].forEach(v => {
          if (v.indexOf("country") != -1) {
            countryar.push(v.split("_")[1]);
          }
          if (v.indexOf("platform") != -1) {
            platformar.push(v.split("|")[1]);
          }
        });
      }

      this.$emit("tableFilter", countryar.join(","), platformar.join(","));
    },
    sortChange({ column, prop, order }) {
      let sort = "";
      switch (prop) {
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
    filterTag(value, row) {
      return true;
    },
    filterTag2(value, row, column) {
      return true;
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
        } else if (index === 1 || index === 2) {
          sums[index] = "";
          return;
        } else if (index === 5) {
          sums[5] =
            (sums[3] == 0) | isNaN((sums[4] / sums[3]).toFixed(2))
              ? ""
              : (sums[4] / sums[3]).toFixed(2);
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
    ...mapState(["daycpilist"]),
    ...mapGetters(["cpiCountry", "cpiImpression"])
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
