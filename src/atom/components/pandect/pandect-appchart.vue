<template>
    <div class="chart" id="appChart" v-show="ifapp"></div>
</template>

<script>
import echarts from "@echarts/js/charts.require.js";
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["ifapp"])
  },
  mounted() {
    myChart = echarts.init(document.getElementById("appChart"));
  }
};
</script>

<style lang="less" scoped>
.chart {
  width: 1440px;
  height: 450px;
}
</style>
