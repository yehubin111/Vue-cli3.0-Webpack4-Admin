<template>
  <el-dialog
    title="自定义列"
    :visible.sync="dialogFormVisible"
    class="dialog pandectdialog"
    @close="toCancel"
  >
    <div class="cont">
      <div class="leftnav">
        <div class="line" v-for="(item, index) in leftOption" :key="index">
          <p class="title" @click="goAnchor('option_' + item.key)">{{item.title}}</p>
          <div v-for="(g, index) in item.child" :key="index">
            <p class="child" v-if="g.name != '常用'" @click="goAnchor('option_' + g.key)">{{g.name}}</p>
          </div>
        </div>
      </div>
      <div class="midnav">
        <div class="search">
          <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="state"></el-input>
        </div>
        <div class="midlist" id="midList">
          <div class="mbox" v-for="(item, index) in leftOption" :key="index">
            <p class="title" :id="'option_' + item.key">{{item.title}}</p>
            <div class="child" v-for="(g, index) in item.child" :key="index">
              <p class="ntitle" v-if="g.name != '常用'" :id="'option_' + g.key">
                <span>{{g.name}}</span>
                <i class="line"></i>
              </p>
              <div class="event" v-if="g.name == '应用内事件'">
                <p
                  v-show="!specialOption || specialOption.length == 0"
                  style="color: #999;text-align: center;line-height: 30px;"
                >暂无</p>
                <div class="eline" v-show="specialOption && specialOption.length > 0">
                  <p class="tl"></p>
                  <p class="nm">独立用户数</p>
                  <p class="nm">事件发生数</p>
                  <p class="nm">事件收益({{customUnit}})</p>
                </div>
                <div
                  class="eline"
                  v-for="p in specialOption"
                  :key="p.name"
                  v-show="p.name.toLowerCase().indexOf(state.trim().toLowerCase()) != -1"
                >
                  <p class="tl">{{p.name}}</p>
                  <p class="nm">
                    <el-checkbox v-model="p.checked1" class="ck" @change="toSelectOption"></el-checkbox>
                  </p>
                  <p class="nm">
                    <el-checkbox v-model="p.checked2" class="ck" @change="toSelectOption"></el-checkbox>
                  </p>
                  <p class="nm">
                    <el-checkbox v-model="p.checked3" class="ck" @change="toSelectOption"></el-checkbox>
                  </p>
                </div>
              </div>
              <div class="nchild" v-else>
                <p v-for="(l, index) in middleOption[g.name]" :key="index">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :disabled="!l.tip"
                    :content="l.tip"
                    placement="right"
                  >
                    <el-checkbox
                      v-show="l.name.toLowerCase().indexOf(state.trim().toLowerCase()) != -1"
                      v-model="l.checked"
                      class="ckbox"
                      @change="toSelectOption"
                    >{{l.name}}</el-checkbox>
                  </el-tooltip>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightnav">
        <p class="tagtotal">已选择{{this.cantDeleteOption.length + this.selectOption.length}}项</p>
        <div class="tagall">
          <p v-for="tag in cantDeleteOption" :key="tag.name">
            <el-tag type="info" class="tagline">{{tag.name}}</el-tag>
          </p>
          <p
            v-for="tag in selectOption"
            :key="tag.name"
            v-dragging="{ item: tag, list: selectOption, group: 'tag'}"
          >
            <el-tag closable type="info" class="tagline" @close="deleteTag(tag.key)">{{tag.name}}</el-tag>
          </p>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="saveList" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: [
    "status",
    "opDefault",
    "setDefaultOption",
    "customEvent",
    "customUnit"
  ],
  data() {
    return {
      state: "",
      dialogFormVisible: false,
      cantDeleteOption: [],
      selectOption: [],
      eventOption: [], // 已选的事件列表
      localEvent: [], // 保存在本地的已选事件列表
      leftOption: [
        {
          title: "常用",
          key: "cy",
          child: [
            {
              name: "常用",
              key: "cy"
            }
          ]
        },
        // {
        //   title: "设置",
        //   key: "sz",
        //   child: [
        //     { name: "Atom", key: "atom" },
        //     { name: "对象名称和编号", key: "dxmchbh" }
        //   ]
        // },
        {
          title: "监测平台",
          key: "jcpt",
          child: [
            { name: "表现", key: "bx" },
            { name: "留存", key: 'lc' },
            { name: "应用内事件", key: "yynsj" }
          ]
        }
      ],
      specialOption: this.customEvent,
      middleOption: {}
    };
  },
  mounted() {
    this.$dragging.$on("dragged", ({ value }) => {
      // console.log(value.item)
      // console.log(value.list)
      // console.log(value.otherData)
    });
    this.$dragging.$on("dragend", () => {});
  },
  methods: {
    showBox() {
      this.middleOption = {
        常用: [
          {
            name: "触达",
            key: "reachNum",
            checked: this.setDefaultOption.find(v => v.name == "触达")
              ? true
              : false
          },
          {
            name: "展示",
            key: "showNum",
            checked: this.setDefaultOption.find(v => v.name == "展示")
              ? true
              : false
          },
          {
            name: "点击",
            key: "clicksNum",
            checked: this.setDefaultOption.find(v => v.name == "点击")
              ? true
              : false
          },
          {
            name: "CTR",
            key: "ctr",
            checked: this.setDefaultOption.find(v => v.name == "CTR")
              ? true
              : false
          },
          {
            name: "CVR",
            key: "cvr",
            checked: this.setDefaultOption.find(v => v.name == "CVR")
              ? true
              : false
          },
          {
            name: "CPM",
            key: "cpm",
            checked: this.setDefaultOption.find(v => v.name == "CPM")
              ? true
              : false
          },
          {
            name: "CPC",
            key: "cpc",
            checked: this.setDefaultOption.find(v => v.name == "CPC")
              ? true
              : false
          },
          {
            name: "安装",
            key: "installsNum",
            checked: this.setDefaultOption.find(v => v.name == "安装")
              ? true
              : false
          },
          {
            name: "花费",
            key: "spend",
            checked: this.setDefaultOption.find(v => v.name == "花费")
              ? true
              : false
          },
          {
            name: "CPI",
            key: "cpi",
            checked: this.setDefaultOption.find(v => v.name == "CPI")
              ? true
              : false
          }
        ],
        表现: [
          {
            name: "AF_展示数",
            key: "afImpressionsNum",
            checked: this.setDefaultOption.find(v => v.name == "AF_展示数")
              ? true
              : false
          },
          {
            name: "AF_点击数",
            key: "afClicksNum",
            checked: this.setDefaultOption.find(v => v.name == "AF_点击数")
              ? true
              : false
          },
          {
            name: "AF_点击率",
            key: "afCtr",
            checked: this.setDefaultOption.find(v => v.name == "AF_点击率")
              ? true
              : false
          },
          {
            name: "AF_安装数",
            key: "afInstallsNum",
            tip: "安装后有效激活的数量",
            checked: this.setDefaultOption.find(v => v.name == "AF_安装数")
              ? true
              : false
          },
          {
            name: "AF_安装数差异率",
            key: "afMinsRate",
            tip: "（监测平台安装数-Facebook安装数）/Facebook安装数",
            // isevent: true,
            checked: this.setDefaultOption.find(
              v => v.name == "AF_安装数差异率"
            )
              ? true
              : false
          },
          {
            name: "AF_CPI",
            key: "afCpi",
            tip: "花费/AF_安装量",
            checked: this.setDefaultOption.find(v => v.name == "AF_CPI")
              ? true
              : false
          },
          {
            name: "AF_转化率",
            key: "afCvr",
            tip: "安装数/点击数",
            checked: this.setDefaultOption.find(v => v.name == "AF_转化率")
              ? true
              : false
          },
          {
            name: "AF_次日留存率",
            key: "afRetentionRate",
            tip: "AF_2d_rr_user_独立用户数/AF_安装量，仅tiktok显示",
            checked: this.setDefaultOption.find(v => v.name == "AF_次日留存率")
              ? true
              : false
          },
          {
            name: "AF_会话次数",
            key: "afSessionsNum",
            tip: "APP打开次数",
            checked: this.setDefaultOption.find(v => v.name == "AF_会话次数")
              ? true
              : false
          },
          {
            name: "AF_忠实用户",
            key: "loyalUsersNum",
            tip: "默认为打开app超过三次以上的用户，可重新定义",
            checked: this.setDefaultOption.find(v => v.name == "AF_忠实用户")
              ? true
              : false
          },
          {
            name: "AF_忠实用户比率",
            key: "afLui",
            tip: "忠实用户数／安装数",
            checked: this.setDefaultOption.find(
              v => v.name == "AF_忠实用户比率"
            )
              ? true
              : false
          },
          {
            name: "AF_收益",
            key: "totalRevenue",
            tip: "源自应用内购买事件的收益",
            checked: this.setDefaultOption.find(v => v.name == "AF_收益")
              ? true
              : false
          },
          {
            name: "AF_花费",
            key: "totalCost",
            tip: "渠道上报的总花费",
            checked: this.setDefaultOption.find(v => v.name == "AF_花费")
              ? true
              : false
          },
          {
            name: "AF_投资回报率",
            key: "afRoi",
            tip: "ROI，收益/花费",
            checked: this.setDefaultOption.find(v => v.name == "AF_投资回报率")
              ? true
              : false
          },
          {
            name: "AF_单用户平均收益",
            key: "afArpu",
            tip: "平均每位用户带来的收益，收益/安装数",
            checked: this.setDefaultOption.find(
              v => v.name == "AF_单用户平均收益"
            )
              ? true
              : false
          },
          {
            name: "AF_平均eCPI",
            key: "afEcpi",
            tip: "每次安装的平均有效成本",
            checked: this.setDefaultOption.find(v => v.name == "AF_平均eCPI")
              ? true
              : false
          }
        ],
        留存: [
          {
            name: "Day 1留存量",
            key: "retentionNum1",
            checked: this.setDefaultOption.find(v => v.name == "Day 1留存量")
              ? true
              : false
          },
          {
            name: "Day 1留存率",
            key: "afReRate1",
            checked: this.setDefaultOption.find(v => v.name == "Day 1留存率")
              ? true
              : false
          },
          {
            name: "Day 2留存量",
            key: "retentionNum2",
            checked: this.setDefaultOption.find(v => v.name == "Day 2留存量")
              ? true
              : false
          },
          {
            name: "Day 2留存率",
            key: "afReRate2",
            checked: this.setDefaultOption.find(v => v.name == "Day 2留存率")
              ? true
              : false
          },
          {
            name: "Day 3留存量",
            key: "retentionNum3",
            checked: this.setDefaultOption.find(v => v.name == "Day 3留存量")
              ? true
              : false
          },
          {
            name: "Day 3留存率",
            key: "afReRate3",
            checked: this.setDefaultOption.find(v => v.name == "Day 3留存率")
              ? true
              : false
          },
          {
            name: "Day 4留存量",
            key: "retentionNum4",
            checked: this.setDefaultOption.find(v => v.name == "Day 4留存量")
              ? true
              : false
          },
          {
            name: "Day 4留存率",
            key: "afReRate4",
            checked: this.setDefaultOption.find(v => v.name == "Day 4留存率")
              ? true
              : false
          },
          {
            name: "Day 5留存量",
            key: "retentionNum5",
            checked: this.setDefaultOption.find(v => v.name == "Day 5留存量")
              ? true
              : false
          },
          {
            name: "Day 5留存率",
            key: "afReRate5",
            checked: this.setDefaultOption.find(v => v.name == "Day 5留存率")
              ? true
              : false
          },
          {
            name: "Day 6留存量",
            key: "retentionNum6",
            checked: this.setDefaultOption.find(v => v.name == "Day 6留存量")
              ? true
              : false
          },
          {
            name: "Day 6留存率",
            key: "afReRate6",
            checked: this.setDefaultOption.find(v => v.name == "Day 6留存率")
              ? true
              : false
          },
          {
            name: "Day 7留存量",
            key: "retentionNum7",
            checked: this.setDefaultOption.find(v => v.name == "Day 7留存量")
              ? true
              : false
          },
          {
            name: "Day 7留存率",
            key: "afReRate7",
            checked: this.setDefaultOption.find(v => v.name == "Day 7留存率")
              ? true
              : false
          }
        ]
      };
      this.cantDeleteOption = this.opDefault;
      this.selectOption = this.setDefaultOption;

      this.customEvent.forEach(v => {
        v.checked1 = this.setDefaultOption.find(
          g => g.name == `${v.name}独立用户数`
        )
          ? true
          : false;
        v.checked2 = this.setDefaultOption.find(
          g => g.name == `${v.name}事件发生数`
        )
          ? true
          : false;
        v.checked3 = this.setDefaultOption.find(
          g => g.name.indexOf(`${v.name}事件收益`) != -1
        )
          ? true
          : false;
      });
    },
    goAnchor(id) {
      // console.log(id);
      document.getElementById("midList").scrollTop =
        document.getElementById(id).offsetTop - 134;
    },
    saveList() {
      let option = this.cantDeleteOption.concat(this.selectOption);
      this.$emit("outOption", option, this.selectOption, this.localEvent);

      this.dialogFormVisible = false;
    },
    toCancel() {
      this.$emit("hideOptionbox");
    },
    deleteTag(key) {
      this.selectOption = this.selectOption.filter(v => v.key != key);

      for (let i in this.middleOption) {
        this.middleOption[i].forEach(v => {
          if (key == v.key) {
            v.checked = false;
          }
        });
      }
    },
    toSelectOption(r) {
      this.selectOption = [];

      for (let i in this.middleOption) {
        let res = this.middleOption[i];

        this.selectOption = this.selectOption.concat(
          res.filter(v => v.checked)
        );
      }

      this.eventOption = [];
      this.localEvent = [];
      this.specialOption.forEach(v => {
        // 保存已选的事件到本地
        if (v.checked1 || v.checked2 || v.checked3) {
          this.localEvent.push(v.name);
        }
        if (v.checked1) {
          let obj1 = {
            name: v.name + "独立用户数",
            key: v.name + "|uniqueUsers",
            checked: true,
            isevent: true
          };
          this.eventOption.push(obj1);
        }
        if (v.checked2) {
          let obj2 = {
            name: v.name + "事件发生数",
            key: v.name + "|eventCounter",
            checked: true,
            isevent: true
          };
          this.eventOption.push(obj2);
        }
        if (v.checked3) {
          let obj3 = {
            name: v.name + `事件收益(${this.customUnit})`,
            key: v.name + "|salesIn",
            checked: true,
            isevent: true
          };
          this.eventOption.push(obj3);
        }
      });

      this.selectOption = this.selectOption.concat(this.eventOption);
    }
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;
    },
    /**
     * 20181116新增，动态切换app之后
     * 自定义列选项选择情况动态更新
     */
    setDefaultOption(n, o) {
      this.selectOption = n;

      for (let i in this.middleOption) {
        this.middleOption[i].forEach(v => {
          if (n.find(g => g.name == v.name)) {
            v.checked = true;
          } else {
            v.checked = false;
          }
        });
      }
    },
    customEvent(n, o) {
      // if(n.length > 0) {
      this.specialOption = n;
      // }
    }
  }
};
</script>
<style>
.cont .el-checkbox__label {
  font-size: 12px;
}
.pandectdialog .el-dialog {
  width: 60%;
}
</style>

<style lang="less" scoped>
.cont {
  display: flex;
  .leftnav {
    flex-basis: 130px;
    border-right: 1px solid #ebebeb;
    flex-grow: 0;
    width: 0;
    height: 380px;
    overflow-y: auto;
    .line {
      margin-bottom: 20px;
      .title {
        margin-bottom: 10px;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
      .child {
        font-size: 12px;
        padding-left: 20px;
        line-height: 26px;
        margin-right: 10px;
        height: 26px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
  .midnav {
    flex-grow: 1;
    padding: 0 20px;
    .search {
      margin-bottom: 10px;
    }
    .midlist {
      height: 330px;
      overflow-y: auto;
      .mbox {
        margin-bottom: 15px;
        .title {
          line-height: 26px;
          background-color: #e5e9f2;
          padding-left: 10px;
          font-size: 12px;
        }
        .event {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          margin-right: 20px;
          .eline {
            display: flex;
            font-size: 12px;
            line-height: 24px;
            .tl {
              //   flex: 1;
              width: 220px;
              flex-shrink: 0;
              color: #606266;
            }
            .nm {
              flex: 1;
              color: #606266;
              text-align: center;
            }
          }
        }
        .child {
          .ntitle {
            display: flex;
            align-items: center;
            line-height: 20px;
            margin-top: 5px;
            span {
              font-size: 12px;
              color: #999;
              padding-left: 10px;
              line-height: 20px;
              position: relative;
              display: inline-block;
              margin-right: 10px;
            }
            .line {
              flex-grow: 1;
              height: 1px;
              background-color: #ebebeb;
              margin-right: 20px;
            }
            //   &:after{
            //       content: '';
            //       height: 1px;
            //       background-color: #ebebeb;
            //       width: 200px;
            //       display: inline-block;
            //     //   position: absolute;
            //     //   left: 4em;
            //     //   top: 14px;
            //   }
          }
          .nchild {
            margin-top: 5px;
            margin-bottom: 5px;
            p {
              .item {
                display: inline-block;
              }
            }
            .ckbox {
              font-size: 12px;
              margin-left: 20px;
              display: block;
              padding: 5px 0;
            }
          }
        }
      }
    }
  }
  .rightnav {
    flex-basis: 150px;
    border-left: 1px solid #ebebeb;
    // width: 0;
    // flex-grow: 0;
    .tagtotal {
      margin-bottom: 10px;
      margin-left: 10px;
    }
    .tagall {
      height: 350px;
      overflow-y: auto;
      p {
        margin-bottom: 10px;
      }
      .tagline {
        margin-left: 10px;
        margin-right: 10px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        display: inline-block;
        height: 32px;
        // max-width: 100%;
        box-sizing: border-box;
        // position: relative;
        // .el-tag__close{
        //     top: 8px;
        //     right: 4px;
        //     position: absolute;
        // }
      }
    }
  }
}
</style>
