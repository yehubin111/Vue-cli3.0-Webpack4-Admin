<template>
  <div class="reguform">
    <p class="title">规则报表</p>
    <div class="ctrlbutton">
      <el-select class="select" v-model="status" filterable multiple collapse-tags placeholder="规则" @change="toSort">
        <el-option v-for="(item, index) in allrules" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-date-picker class="datar" v-model="value" type="daterange" :clearable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="toSort">
      </el-date-picker>
    </div>
    <div class="piechart">
      <div class="drawchart">
        <p class="ctitle">规则启用比例</p>
        <div class="chart" id="Chart1"></div>
      </div>
      <div class="drawchart">
        <p class="ctitle">规则触发比例</p>
        <div class="chart" id="Chart2"></div>
      </div>
    </div>
    <div class="stripchart">
      <div class="chart" id="Chart3"></div>
    </div>
    <p class="download">
      <span @click="outTable"> 导出全部
        <svg-icon svgname="save" svgclass="save"></svg-icon>
      </span>
    </p>
    <reguform-list></reguform-list>
  </div>
</template>

<script>
import ReguformList from "./reguform-list";
import { mapState } from "vuex";
import echarts from "@echarts/js/charts.require.js";
export default {
  components: {
    ReguformList
  },
  data() {
    return {
      value: [new Date().getTime() - 6 * 24 * 3600 * 1000, new Date()],
      status: []
    };
  },
  computed: {
    ...mapState(["allrules"])
  },
  mounted() {
    this.$store.dispatch("getAllRules");

    let startTime = this.$timeFormat(this.value[0], "yyyy-MM-dd");
    let endTime = this.$timeFormat(this.value[1], "yyyy-MM-dd");
    this.$store.dispatch("getReguFormData", { startTime, endTime });

    myChart5 = echarts.init(document.getElementById("Chart1"));
    myChart6 = echarts.init(document.getElementById("Chart2"));
    myChart7 = echarts.init(document.getElementById("Chart3"));
  },
  methods: {
    toSort() {
      let ruleGroupIds = this.status.join(",");
      let startTime = this.value
        ? this.$timeFormat(this.value[0], "yyyy-MM-dd")
        : "";
      let endTime = this.value
        ? this.$timeFormat(this.value[1], "yyyy-MM-dd")
        : "";
      this.$store.dispatch("getReguFormData", {
        startTime,
        endTime,
        ruleGroupIds
      });
    },
    outTable() {
      let name = `规则报表${this.$timeFormat(
        this.value[0],
        "yyyy-MM-dd"
      )}_${this.$timeFormat(this.value[1], "yyyy-MM-dd")}`;
      this.$exportHTML("regularList", name);
    }
  }
};
</script>

<style lang="less" scoped>
.reguform {
  width: 1200px;
  margin: 0 auto 50px auto;
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
  }
  .piechart {
    display: flex;
    margin-bottom: 20px;
    .drawchart {
      text-align: center;
      flex: 1;
      padding-top: 30px;
      .ctitle {
        font-size: 16px;
        line-height: 30px;
      }
      .chart {
        width: 240px;
        height: 300px;
        display: inline-block;
      }
    }
  }
  .stripchart {
    margin-bottom: 30px;
    .chart {
      width: 100%;
      height: 400px;
    }
  }
  .ctrlbutton {
    overflow: hidden;
    margin-bottom: 10px;
    .select {
      width: 300px;
    }
    .datar {
      float: right;
      //   margin-left: 20px;
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
}
</style>
