<template>
    <div class="chart" id="appChart"></div>
</template>

<script>
import echarts from "@echarts/js/charts.require.js";
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    // ...mapState(["ifapp"])
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      myChart4 = echarts.init(document.getElementById("appChart"));
    },
    resizeChart() {
      myChart4.resize();
    }
  }
};
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: 450px;
  margin-bottom: 40px;
}
</style>
