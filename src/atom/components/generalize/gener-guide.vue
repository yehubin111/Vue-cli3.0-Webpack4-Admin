<template>
  <div class="guide">
    <p class="title">受众信息</p>
    <div class="targetchart">
      <div class="chart" id="targetChart"></div>
      <p class="chartfont">未设定受众</p>
    </div>
    <div class="targetinfo">
      <p>潜在覆盖人数：120,000</p>
      <p>
        最近1天活跃人数：120,000
        <el-tooltip
          class="conditiontip"
          effect="dark"
          content="所选平台上满足定位条件的过去1天内的活跃人数（估计值）"
          placement="top-start"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </p>
      <p>
        最近1个月活动人数：120,000
        <el-tooltip
          class="conditiontip"
          effect="dark"
          content="所选平台上满足定位条件的过去1个月内的活跃人数（估计值）"
          placement="top-start"
        >
          <i class="el-icon-question"></i>
        </el-tooltip>
      </p>
    </div>
    <p class="title">出价指南</p>
    <div class="nowprice">
      <div class="price cpm">
        <p class="unit">目前出价{{bid}}</p>
        <p class="val">{{maxbid?'$'+maxbid:'--'}}</p>
      </div>
      <div class="price">
        <p class="unit">目前{{moneytype == 'day_budget'? '单日预算' : '总预算'}}</p>
        <p class="val">{{money?'$' + money: '--'}}</p>
      </div>
    </div>
    <p class="title">
      不同价位最近一周效果
      <el-tooltip class="item" effect="dark" content="根据所有广告账户下的广告组数据计算得出" placement="top-start">
        <i class="el-icon-question"></i>
      </el-tooltip>
    </p>
    <div class="effect">
      <div :class="{price: true, on: effecttab == 0}" @click="effectSelect(0)">
        <p class="unit">CPI</p>
        <p class="val">{{cpi_data}}</p>
      </div>
      <div :class="{price: true, cpm: true, on: effecttab == 1}" @click="effectSelect(1)">
        <p class="unit">花费</p>
        <p class="val">{{spend_data}}</p>
      </div>
      <div :class="{price: true, cpm: true, on: effecttab == 2}" @click="effectSelect(2)">
        <p class="unit">安装量</p>
        <p class="val">{{installs_data}}</p>
      </div>
    </div>
    <div class="charts">
      <div class="canvas" id="Canvas1" v-show="effecttab == 0"></div>
      <div class="canvas" id="Canvas2" v-show="effecttab == 1"></div>
      <div class="canvas" id="Canvas3" v-show="effecttab == 2"></div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from "vuex";
  import echarts from "@echarts/js/charts.require.js";
  export default {
    props: ["bid", "maxbid", "moneytype", "money"],
    data() {
      return {
        effecttab: 0,
        weebeffect: [
          { name: "CPI", price: "12.00" },
          { name: "花费", price: "1200" },
          { name: "安装量", price: "1200" }
        ]
      };
    },
    mounted() {
      this.SETSTATE({ k: "bidguide", v: [] });

      myChart8 = echarts.init(document.getElementById("Canvas1"));
      myChart9 = echarts.init(document.getElementById("Canvas2"));
      myChart10 = echarts.init(document.getElementById("Canvas3"));
      // 20190527新增受众信息图表
      let option = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
          show: false
        },
        grid: {
          top: "middle"
        },
        series: [
          {
            name: "业务指标",
            type: "gauge",
            radius: "90%",
            // startAngle: 180,
            // endAngle: 0,
            axisLine: {
              lineStyle: {
                width: 7
              }
            },
            splitLine: {
              length: 7
            },
            axisTick: {
              length: 3
            },
            axisLabel: {
              show: false
            },
            title: {
              show: false
            },
            // 指针
            pointer: {
              width: 4,
              length: "70%"
            },
            detail: { formatter: "{value}%", fontSize: 14 },
            data: [{ value: 50, name: "完成率" }]
          }
        ]
      };
      myChart11 = echarts.init(document.getElementById("targetChart"));
      myChart11.setOption(option, true);
    },
    computed: {
      ...mapState(["bidguide"]),
      cpi_data() {
        let obj = this.bidguide.find(
          v => this.maxbid >= v.bidAmountStart && this.maxbid <= v.bidAmountEnd
        );
        if (obj)
          return obj.cpi.toString().indexOf(".") != -1
            ? "$" + parseFloat(obj.cpi).toFixed(2)
            : "$" + obj.cpi;
        else return "--";
      },
      spend_data() {
        let obj = this.bidguide.find(
          v => this.maxbid >= v.bidAmountStart && this.maxbid <= v.bidAmountEnd
        );
        if (obj)
          return obj.spend.toString().indexOf(".") != -1
            ? "$" + parseFloat(obj.spend).toFixed(2)
            : "$" + obj.spend;
        else return "--";
      },
      installs_data() {
        let obj = this.bidguide.find(
          v => this.maxbid >= v.bidAmountStart && this.maxbid <= v.bidAmountEnd
        );
        if (obj)
          return obj.installs.toString().indexOf(".") != -1
            ? parseFloat(obj.installs).toFixed(2)
            : obj.installs;
        else return "--";
      }
    },
    methods: {
      ...mapMutations(["SETSTATE"]),
      effectSelect(idx) {
        this.effecttab = idx;
      }
    }
  };
</script>

<style lang="less" scoped>
.guide {
  width: 300px;
  // height: 400px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  .title {
    line-height: 34px;
    padding-left: 12px;
    border-bottom: 1px solid #dcdfe6;
    font-weight: bold;
  }
  .targetchart {
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    padding-top: 16px;
    .chart {
      flex-basis: 180px;
      height: 130px;
    }
    .chartfont {
      flex-grow: 1;
      padding: 20px 0;
    }
  }
  .targetinfo {
    border-bottom: 1px solid #dcdfe6;
    padding: 7px 0 7px 12px;
    p {
      line-height: 24px;
    }
  }
  .nowprice {
    overflow: hidden;
    .price {
      float: left;
      width: 50%;
      box-sizing: border-box;
      padding-left: 12px;
      border-bottom: 1px solid #dcdfe6;
      .unit {
        font-size: 12px;
        color: #999;
        line-height: 30px;
        margin-top: 10px;
      }
      .val {
        font-size: 16px;
        margin-bottom: 12px;
      }
      &.cpm {
        border-right: 1px solid #dcdfe6;
      }
    }
  }
  .charts {
    .canvas {
      height: 176px;
      width: 300px;
    }
  }
  .effect {
    overflow: hidden;
    display: flex;
    .price {
      flex: 1;
      width: 50%;
      box-sizing: border-box;
      padding-left: 12px;
      border-bottom: 1px solid #dcdfe6;
      cursor: pointer;
      .unit {
        font-size: 12px;
        color: #999;
        line-height: 30px;
        margin-top: 10px;
      }
      .val {
        font-size: 16px;
        margin-bottom: 12px;
      }
      &.cpm {
        border-left: 1px solid #dcdfe6;
      }
      &.on {
        background-color: #409eff;
        .unit {
          color: #fff;
        }
        .val {
          color: #fff;
        }
      }
    }
  }
}
</style>

