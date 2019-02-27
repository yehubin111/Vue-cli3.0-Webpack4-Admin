<template>
  <div class="guide">
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
    <p class="title">不同价位最近一周效果
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
    this.SETSTATE({k: 'bidguide', v: []});
    
    myChart8 = echarts.init(document.getElementById("Canvas1"));
    myChart9 = echarts.init(document.getElementById("Canvas2"));
    myChart10 = echarts.init(document.getElementById("Canvas3"));
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
    ...mapMutations(['SETSTATE']),
    effectSelect(idx) {
      this.effecttab = idx;
    }
  }
};
</script>

<style lang="less" scoped>
.guide {
  width: 300px;
  height: 400px;
  border: 1px solid #dcdfe6;
  background-color: #fff;
  .title {
    line-height: 34px;
    padding-left: 12px;
    border-bottom: 1px solid #dcdfe6;
    font-weight: bold;
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

