<template>
  <div class="pandect">
    <div class="title">
      <p class="left">总览</p>
      <p class="right">
      <el-popover trigger="click" placement="top" width="600">
        <el-table id="waitAtt" :data="paycountlist" height="250">
          <el-table-column prop="bmName" width="140" label="所属BM">
          </el-table-column>
          <el-table-column width="140" prop="fbAccountId" label="账号ID">
          </el-table-column>
          <el-table-column prop="name" label="账号名称">
          </el-table-column>
          <el-table-column width="100" prop="balance" label="余额($)">
            <template slot-scope="scope">
              <span>{{scope.row.balance / 100}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-button slot="reference" type="text"><span>{{paycount}}</span> 个待充值广告账户</el-button>
      </el-popover>
      </p>
    </div>
    <div class="info">
      <div class="chartbox">
        <div class="data">
          <p class="name">今日安装量</p>
          <p class="count">{{todayinstall | numberFormat}}</p>
        </div>
        <div class="chart" id="Chart1"></div>
      </div>
      <div class="chartbox">
        <div class="data">
          <p class="name">今日花费</p>
          <p class="count">${{todayexpend | numberFormat}}</p>
        </div>
        <div class="chart mb0" id="Chart2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      // ctoption1: chart.pie1(),
      // ctoption2: chart.pie1()
    };
  },
  mounted() {
    // 获取待充值数量
    this.$store.dispatch("getPayCount");

    myChart2 = echarts.init(document.getElementById("Chart1"));
    // myChart2.setOption(this.ctoption1);
    myChart3 = echarts.init(document.getElementById("Chart2"));
    // myChart3.setOption(this.ctoption2);
  },
  computed: {
    ...mapState(["paycount", "paycountlist"]),
    ...mapGetters(["todayinstall", "todayexpend"])
  }
};
</script>

<style lang="less">
.pandect {
  flex-grow: 1;
  .title {
    overflow: hidden;
    line-height: 60px;
    .left {
      float: left;
      font-size: 20px;
    }
    .right {
      float: right;
      font-size: 16px;
    }
  }
  .info {
    width: 100%;
    height: 240px;
    // margin: 0 0 0 20px;
    display: flex;
    align-content: space-between;
    height: 240px;
    .chartbox {
      display: flex;
      align-content: space-between;
      height: 240px;
      flex: 1;
      .data {
        flex-basis: 100px;
        display: flex;
        flex-direction: column;
        align-items: left;
        justify-content: center;
        margin: 0 20px 0 0;
        .name {
          line-height: 46px;
          font-size: 14px;
          color: #999;
        }
        .count {
          line-height: 30px;
          font-size: 30px;
          color: #333;
        }
      }
      .chart {
        flex-basis: 350px;
        // background-color: #f5f5f5;
        margin: 0 20px 0 0;
      }
      .mb0 {
        margin-right: 0;
      }
    }
  }
}
</style>
