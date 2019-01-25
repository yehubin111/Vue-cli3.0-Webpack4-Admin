<template>
  <el-dialog :title="logdetailname + '创建详情'" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-form ref="form" :model="form" label-width="80px" class="cform">
      <p class="allinfo">已成功创建
        <span>{{detailcampaignsuccess}}</span>个广告系列，
        <span>{{detailsetsuccess}}</span>个广告组，
        <span>{{detailadsuccess}}</span>个广告
        <span class="see">
          <router-link :to="'/project/' + $route.params.id + '/ad/' + logdetailid">查看</router-link>
        </span>
      </p>
      <div class="listall" v-for="(item, index) in logdetail" :key="index">
        <p class="infotop">账户ID：{{item.fb_account_id.split('_')[1]}} 账户名称：{{item.adaccountName}}</p>
        <div :class="{stepline: true, process1: item.statuskey1, process2: item.statuskey2,process3: item.statuskey3}">
          <p class="spline"></p>
          <div class="step step1">
            <p class="sicon">
              <span>1</span>
            </p>
            <p class="stitle">创建广告系列</p>
            <!-- <p class="sdetail">{{item.statusname}}</p> -->
            <p class="sdetail">成功{{item.campaignDetail.createSuccess}}个 失败{{item.campaignDetail.createFailed}}个
              <el-tooltip v-if="item.campaignDetail.errorMsg.length > 0" class="item" effect="dark" placement="top-start">
                <div slot="content" v-html="item.campaignDetail.errorMsg.join('<br/>')"></div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </p>
          </div>
          <div class="step step2">
            <p class="sicon">
              <span>2</span>
            </p>
            <p class="stitle">创建广告组</p>
            <p class="sdetail">成功{{item.adsetDetail.createSuccess}}个 失败{{item.adsetDetail.createFailed}}个
              <el-tooltip v-if="item.adsetDetail.errorMsg.length > 0" class="item" effect="dark" placement="top-start">
                <div slot="content" v-html="item.adsetDetail.errorMsg.join('<br/>')"></div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </p>
          </div>
          <div class="step step3">
            <p class="sicon">
              <span>3</span>
            </p>
            <p class="stitle">创建广告</p>
            <p class="sdetail">成功{{item.adDetail.createSuccess}}个 失败{{item.adDetail.createFailed}}个
              <el-tooltip v-if="item.adDetail.errorMsg.length > 0" class="item" effect="dark" placement="top-start">
                <div slot="content" v-html="item.adDetail.errorMsg.join('<br/>')"></div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </p>
          </div>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  props: ["status"],
  data() {
    return {
      dialogFormVisible: false,
      // rundetail: null,
      form: {
        money: ""
      }
    };
  },
  computed: {
    ...mapState(["logdetail", "logdetailname", "logdetailid"]),
    ...mapGetters([
      "detailadsuccess",
      "detailsetsuccess",
      "detailcampaignsuccess"
    ])
  },
  mounted() {
    // this.$store.dispatch("getLogdetail", 106);
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    toCancel() {
      // this.$emit("cancelAddbm", "status4");

      let k = "logdetail";
      let v = [];
      this.SETSTATE({ k, v });
      k = "logdetailname";
      v = "";
      this.SETSTATE({ k, v });
      k = "logdetailid";
      v = "";
      this.SETSTATE({ k, v });

      k = "ifadcreate";
      v = false;
      this.SETSTATE({ k, v });
    }
  },
  watch: {
    status(n, v) {
      let self = this;
      this.dialogFormVisible = n;

      if (n) {
        rundetail = setInterval(function() {
          self.$store.dispatch("getLogdetail");
        }, 2000);
      } else {
        clearInterval(rundetail);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.moneyinput {
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
  .moneyus {
    position: absolute;
    z-index: 9;
    left: 8px;
    font-size: 18px;
  }
  .minput {
    width: 300px;
  }
}
.listall {
  margin-bottom: 30px;
  .infotop {
    margin-bottom: 20px;
  }
  .stepline {
    margin: 0 50px;
    height: 80px;
    border-top: 2px solid #c0c4cc;
    position: relative;
    .spline {
      width: 100%;
      height: 2px;
      background-color: #c0c4cc;
      width: 50%;
      position: absolute;
      top: -2px;
      left: 0;
      display: none;
    }
    .step {
      position: absolute;
      top: -12px;
      text-align: center;
      width: 120px;
      .sicon {
        text-align: center;
        margin-bottom: 10px;
        span {
          font-size: 14px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          display: inline-block;
          text-align: center;
          font-weight: bold;
          // color: #409eff;
          color: #c0c4cc;
          background-color: #fff;
          border-radius: 50%;
          border: 2px solid #c0c4cc;
        }
      }
      .stitle {
        // color: #409eff;
        color: #c0c4cc;
        font-size: 16px;
        line-height: 20px;
      }
      .sdetail {
        // color: #409eff;
        color: #c0c4cc;
        font-size: 12px;
        line-height: 24px;
      }
      &.step1 {
        left: 0;
        transform: translate(-50%, 0);
      }
      &.step2 {
        left: 50%;
        transform: translate(-50%, 0);
      }
      &.step3 {
        left: 100%;
        transform: translate(-50%, 0);
      }
    }
    &.process1 {
      border-top: 2px solid #c0c4cc;
      .spline {
        background-color: #c0c4cc;
      }
      .step1 {
        .sicon {
          span {
            color: #409eff;
            border: 2px solid #409eff;
          }
        }
        .stitle {
          color: #409eff;
        }
        .sdetail {
          color: #409eff;
        }
      }
    }
    &.process2 {
      border-top: 2px solid #c0c4cc;
      .spline {
        background-color: #409eff;
      }
      .step1,
      .step2 {
        .sicon {
          span {
            color: #409eff;
            border: 2px solid #409eff;
          }
        }
        .stitle {
          color: #409eff;
        }
        .sdetail {
          color: #409eff;
        }
      }
    }
    &.process3 {
      border-top: 2px solid #409eff;
      .spline {
        background-color: #409eff;
      }
      .step1,
      .step2,
      .step3 {
        .sicon {
          span {
            color: #409eff;
            border: 2px solid #409eff;
          }
        }
        .stitle {
          color: #409eff;
        }
        .sdetail {
          color: #409eff;
        }
      }
    }
    // &.fail {
    //   border-top: 2px solid #c0c4cc;
    //   .step1 {
    //     .sicon {
    //       span {
    //         color: #333;
    //         border: 2px solid #333;
    //       }
    //     }
    //     .stitle {
    //       color: #333;
    //     }
    //     .sdetail {
    //       color: #333;
    //     }
    //   }
    //   .step2,
    //   .step3 {
    //     .sicon {
    //       span {
    //         color: #c0c4cc;
    //         border: 2px solid #c0c4cc;
    //       }
    //     }
    //     .stitle {
    //       color: #c0c4cc;
    //     }
    //     .sdetail {
    //       color: #c0c4cc;
    //     }
    //   }
    // }
    // &.wait {
    //   border-top: 2px solid #333;
    //   .spline {
    //     display: block;
    //   }
    //   .step3 {
    //     .sicon {
    //       span {
    //         color: #333;
    //         border: 2px solid #333;
    //       }
    //     }
    //     .stitle {
    //       color: #333;
    //     }
    //     .sdetail {
    //       color: #333;
    //     }
    //   }
    // }
  }
}
.allinfo {
  margin-bottom: 20px;
  font-weight: bold;
  span {
    color: #409eff;
    &.see {
      a {
        color: #409eff;
      }
    }
  }
}
.tip {
  line-height: 20px;
  color: #666;
  width: 320px;
}
</style> 
