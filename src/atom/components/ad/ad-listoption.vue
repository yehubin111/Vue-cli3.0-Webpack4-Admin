<template>
  <el-dialog
    title="自定义列"
    :visible="status"
    class="dialog pandectdialog"
    @close="toCancel"
  >
    <div class="cont">
      <div class="leftnav">
        <div class="line" v-for="(item, index) in leftOption" :key="index">
          <p class="title" @click="goAnchor(type + 'option_' + item.key)">{{item.title}}</p>
          <div v-for="(g, index) in item.child" :key="index">
            <p
              class="child"
              v-if="g.name != '常用'"
              @click="goAnchor(type + 'option_' + g.key)"
            >{{g.name}}</p>
          </div>
        </div>
      </div>
      <div class="midnav">
        <div class="search">
          <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="state"></el-input>
        </div>
        <div class="midlist" :id="type + 'midList'">
          <div class="mbox" v-for="(item, index) in leftOption" :key="index">
            <p class="title" :id="type + 'option_' + item.key">{{item.title}}</p>
            <div class="child" v-for="(g, index) in item.child" :key="index">
              <p class="ntitle" v-if="g.name != '常用'" :id="type + 'option_' + g.key">
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
                  v-show="p.name && p.name.toLowerCase().indexOf(state.trim().toLowerCase()) != -1"
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
                      v-show="l.name && l.name.toLowerCase().indexOf(state.trim().toLowerCase()) != -1"
                      v-model="l.checked"
                      class="ckbox"
                      @change="toSelectOption"
                      :disabled="(type == 'campaignName' && l.name == '广告系列名称') || (type == 'adSetName' && l.name == '广告组名称') || (type == 'adName' && l.name == '广告名称')"
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
          <p v-for="tag in cantDeleteOption" :key="tag.key">
            <el-tag type="info" class="tagline">{{tag.name}}</el-tag>
          </p>
          <p
            v-for="tag in selectOption"
            :key="tag.name"
            v-dragging="{ item: tag, list: selectOption, group: 'tag' }"
          >
            <span
              v-if="(type == 'campaignName' && tag.name != '广告系列名称')||(type == 'adSetName' && tag.name != '广告组名称')||(type == 'adName' && tag.name != '广告名称')"
            >
              <el-tag closable type="info" class="tagline" @close="deleteTag(tag.key)">{{tag.name}}</el-tag>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button @click="saveList" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapState } from "vuex";
  export default {
    props: [
      "status",
      "opDefault",
      "setDefaultOption",
      "customEvent",
      "customUnit",
      "type"
    ],
    data() {
      return {
        state: "",
        specialStatus: false, // 特殊字段初始状态
        cantDeleteOption: [],
        selectOption: [],
        eventOption: [], // 已选的事件列表
        localEvent: [], // 保存在本地的已选事件列表
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
    computed: {
      ...mapState(["adleftOption"]),
      leftOption() {
        return this.adleftOption;
      }
    },
    methods: {
      showBox() {
        /**
         * v2.2.4
         * 20190530新增特殊字段
         * 需要通过单独请求接口获取响应数据，不支持排序
         */
        this.middleOption = {
          常用: [
            {
              name: "投放状态",
              key: "effectiveStatusName",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "投放状态")
                ? true
                : false
            },
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
              key: "installNum",
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
            },
            {
              name: "相关度",
              key: "relevanceScore",
              checked: this.setDefaultOption.find(v => v.name == "相关度")
                ? true
                : false
            }
          ],
          Atom: [
            {
              name: "推广计划编号",
              key: "planId",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "推广计划编号")
                ? true
                : false
            },
            {
              name: "推广计划名称",
              key: "planName",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "推广计划名称")
                ? true
                : false
            },
            {
              name: "创建人",
              key: "creator",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "创建人")
                ? true
                : false
            }
          ],
          对象名称和编号: [
            {
              name: "账户编号",
              key: "accountId",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "账户编号")
                ? true
                : false
            },
            {
              name: "账户名称",
              key: "accountName",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "账户名称")
                ? true
                : false
            },
            {
              name: "广告系列名称",
              key: "campaignName",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "广告系列名称")
                ? true
                : false
            },
            {
              name: "广告系列编号",
              key: "campaignId",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "广告系列编号")
                ? true
                : false
            },
            {
              name: "广告组名称",
              key: "adSetName",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "广告组名称")
                ? true
                : false
            },
            {
              name: "广告组编号",
              key: "adsetId",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "广告组编号")
                ? true
                : false
            },
            {
              name: "广告名称",
              key: "adName",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "广告名称")
                ? true
                : false
            },
            {
              name: "广告编号",
              key: "adId",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "广告编号")
                ? true
                : false
            }
          ],
          状态和日期: [
            {
              name: "创建日期",
              key: "fbCreatedTime",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "创建日期")
                ? true
                : false
            },
            {
              name: "上次编辑",
              key: "fbUpdateTime",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "上次编辑")
                ? true
                : false
            },
            {
              name: "开始日期",
              key: "startTime",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "开始日期")
                ? true
                : false
            },
            {
              name: "结束日期",
              key: "stopTime",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "结束日期")
                ? true
                : false
            },
            {
              name: "错误",
              key: "issuesInfo",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "错误")
                ? true
                : false
            },
            // {
            //   name: "报告开始日期",
            //   key: "accountId",
            //   nosort: true,
            //   checked: this.setDefaultOption.find(v => v.name == "报告开始日期")
            //     ? true
            //     : false
            // },
            // {
            //   name: "报告结束日期",
            //   key: "accountId",
            //   nosort: true,
            //   checked: this.setDefaultOption.find(v => v.name == "报告结束日期")
            //     ? true
            //     : false
            // },
            {
              name: "经过时间百分比",
              key: "passTimeRate",
              nosort: true,
              checked: this.setDefaultOption.find(v => v.name == "经过时间百分比")
                ? true
                : false
            }
          ],
          "目标、预算与排期": [
            {
              name: "目标",
              key: "objective",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "目标")
                ? true
                : false
            },
            {
              name: "购买类型",
              key: "buyingType",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "购买类型")
                ? true
                : false
            },
            {
              name: "竞价",
              key: "bidStrategy",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "竞价")
                ? true
                : false
            },
            {
              name: "预算",
              key: "budget",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "预算")
                ? true
                : false
            },
            {
              name: "剩余预算",
              key: "budgetRemaining",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "剩余预算")
                ? true
                : false
            },
            {
              name: "花费金额百分比",
              key: "spendRate",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "花费金额百分比")
                ? true
                : false
            },
            {
              name: "花费上限",
              key: "spendCap",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "花费上限")
                ? true
                : false
            }
          ],
          目标受众定位: [
            {
              name: "地区",
              key: "countries",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "地区")
                ? true
                : false
            },
            {
              name: "年龄范围",
              key: "ageRange",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "年龄范围")
                ? true
                : false
            },
            {
              name: "性别",
              key: "genders",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "性别")
                ? true
                : false
            },
            {
              name: "包含的自定义受众",
              key: "customAudiencesNames",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "包含的自定义受众")
                ? true
                : false
            },
            {
              name: "排除的自定义受众",
              key: "excludedCustomAudiencesNames",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "排除的自定义受众")
                ? true
                : false
            }
          ],
          广告创意: [
            {
              name: "主页名称",
              key: "themeName",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "主页名称")
                ? true
                : false
            },
            {
              name: "标题",
              key: "title",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "标题")
                ? true
                : false
            },
            {
              name: "正文",
              key: "messageText",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "正文")
                ? true
                : false
            },
            {
              name: "链接",
              key: "linkUrl",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "链接")
                ? true
                : false
            },
            {
              name: "推广标的",
              key: "appName",
              nosort: true,
              type: 'set',
              checked: this.setDefaultOption.find(v => v.name == "推广标的")
                ? true
                : false
            },
          ],
          表现: [
            {
              name: "AF_展示数",
              key: "afShowsNum",
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
              key: "afConversionRate",
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
              key: "afLoyalUsersNum",
              tip: "默认为打开app超过三次以上的用户，可重新定义",
              checked: this.setDefaultOption.find(v => v.name == "AF_忠实用户")
                ? true
                : false
            },
            {
              name: "AF_忠实用户比率",
              key: "afLoyalUsersRate",
              tip: "忠实用户数／安装数",
              checked: this.setDefaultOption.find(
                v => v.name == "AF_忠实用户比率"
              )
                ? true
                : false
            },
            {
              name: "AF_收益",
              key: "afTotalReveue",
              tip: "源自应用内购买事件的收益",
              checked: this.setDefaultOption.find(v => v.name == "AF_收益")
                ? true
                : false
            },
            {
              name: "AF_花费",
              key: "afTotalCost",
              tip: "渠道上报的总花费",
              checked: this.setDefaultOption.find(v => v.name == "AF_花费")
                ? true
                : false
            },
            {
              name: "AF_投资回报率",
              key: "afROI",
              tip: "ROI，收益/花费",
              checked: this.setDefaultOption.find(v => v.name == "AF_投资回报率")
                ? true
                : false
            },
            {
              name: "AF_单用户平均收益",
              key: "afUserReveue",
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
        document.getElementById(this.type + "midList").scrollTop =
          document.getElementById(id).offsetTop - 134;
      },
      saveList() {
        let option = this.cantDeleteOption.concat(this.selectOption);
        this.$emit("outOption", option, this.selectOption, this.localEvent);

        this.toCancel();
      },
      toCancel() {
        this.$emit("update:status", false);
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

        /**
         * 20181227新增逻辑
         * 如果之前已选3个特殊字段，则后续继续加上
         * 如果之前没选，则后续不加
         */
        for (let i in this.middleOption) {
          let res = this.middleOption[i];
          let arr = [];
          let keyname = "";

          switch (this.type) {
            case "campaignName":
              keyname = "广告系列名称";
              break;
            case "adSetName":
              keyname = "广告组名称";
              break;
            case "adName":
              keyname = "广告名称";
              break;
          }
          if (!this.setDefaultOption.find(v => v.name == keyname))
            arr = res.filter(v => v.checked && v.name != keyname);
          else arr = res.filter(v => v.checked);

          this.selectOption = this.selectOption.concat(arr);
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
        let obj = null;
        let keyname = "";
        if (n) {
          this.cantDeleteOption = this.opDefault[this.type];
          switch (this.type) {
            case "campaignName":
              keyname = "campaignName";
              break;
            case "adSetName":
              keyname = "adSetName";
              break;
            case "adName":
              keyname = "adName";
              break;
          }
          obj = this.middleOption["对象名称和编号"].find(v => v.key == keyname);
          this.specialStatus = obj.checked;
          obj.checked = true;
        } else {
          this.cantDeleteOption = [];
          switch (this.type) {
            case "campaignName":
              keyname = "campaignName";
              break;
            case "adSetName":
              keyname = "adSetName";
              break;
            case "adName":
              keyname = "adName";
              break;
          }
          obj = this.middleOption["对象名称和编号"].find(v => v.key == keyname);
          obj.checked = this.specialStatus;
        }
      },
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
        // if (n.length > 0) {
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
        display: inline-block;
        height: 32px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
