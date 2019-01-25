<template>
  <el-dialog :title="`创建${customtype == 1? '应用事件': '客户名单'}自定义受众`" :visible.sync="dialogFormVisible" class="dialog createdialog" @close="toCancel">
    <el-form ref="form" :model="form" label-width="80px" class="cform">
      <div class="leftform forleft">
        <el-form-item label="应用">
          <el-select class="search" v-model="form.app" disabled placeholder="请选择应用" filterable @change="getAccount">
            <el-option v-for="(l,index) in targetapplist" :key="index" :label="l.name" :value="l.applicationId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台" v-if="customtype == 2">
          <el-radio-group v-model="form.platform">
            <el-radio label="manual">
              google_play
            </el-radio>
            <el-radio label="auto">
              itunes
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="媒体平台" v-if="customtype == 2">
          <el-select class="search" v-model="form.type" disabled placeholder="请选择媒体平台" filterable>
            <el-option label="应用事件" value="应用事件"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="受众名称">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc" placeholder="请输入描述，选填"></el-input>
        </el-form-item>
        <el-form-item label="已选账户" v-if="form.selectaccount.length > 0">
          <el-select class="search" v-model="form.selectid" multiple disabled placeholder="请选择广告账户" filterable>
            <el-option v-for="(l,index) in form.selectaccount" :key="index" :label="l.name + '('+l.id.split('_')[1]+')'" :value="l.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告账户">
          <el-select class="search" v-model="form.account" collapse-tags multiple placeholder="请选择广告账户" filterable>
            <el-option v-for="(l,index) in applist" :key="index" :label="l.name + '('+l.fbId.split('_')[1]+')'" :value="l.fbId"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="leftform">
        <div class="el-form-item">
          <span class="condition">包含符合以下</span>
          <el-select class="selectapp" v-model="form.relative" :disabled="editid != ''" placeholder="请选择" filterable>
            <el-option v-for="(l,index) in relativearr" :key="index" :label="l" :value="l"></el-option>
          </el-select>
          <span class="condition">条件的用户</span>
          <span class="scale" v-if="customtype == 2">规模：123322</span>
        </div>
        <div class="conditionbox" :style="{height: conditionHeight + 'px'}">
          <div class="conditionline" v-for="(item, index) in form.condition" :key="index">
            <div class="conditionlist">
              <span class="condition">过去</span>
              <el-input-number style="width: 140px" v-model="item.day" :precision="0" :disabled="editid != ''" :min="1" :max="180" label="天数"></el-input-number>
              <span class="condition">天内</span>
              <el-select class="selectapp" v-model="item.app" :disabled="editid != ''" placeholder="请选择事件" filterable>
                <el-option v-for="(l,index) in appaccount" :key="index" :label="l.display_name" :value="l.template? `${l.event_name}|${l.template}` : l.event_name"></el-option>
              </el-select>
              <span class="condition" v-show="item.app == 'fb_mobile_activate_app|MACA_MOST_ACTIVE_USERS'">最高</span>
              <el-select class="selectpercent" v-show="item.app == 'fb_mobile_activate_app|MACA_MOST_ACTIVE_USERS'" :disabled="editid != ''" v-model="item.percent">
                <el-option v-for="l in ['25%', '10%', '5%']" :key="l" :label="l" :value="l"></el-option>
              </el-select>
              <i class="el-icon-close" @click="delCondition(index)" v-show="form.condition.length > 1"></i>
            </div>
            <p class="conditionrelative">{{relativekey}}</p>
          </div>
        </div>
        <div class="conditionctrl">
          <el-checkbox class="ctrlleft" v-model="form.checked" :disabled="form.condition.length == 5 || editid != ''" @change="checkListten">不排除任何人群</el-checkbox>
          <el-button class="ctrlright" type="text" @click="addCondition" v-show="ifAdd && editid == ''">新增条件</el-button>
        </div>
        <div class="el-form-item" v-show="!form.checked">
          <span class="condition">排除符合以下任意条件的用户</span>
        </div>
        <div class="conditionbox" :style="{height: noconditionHeight + 'px'}" v-show="!form.checked">
          <div class="conditionline" v-for="(item, index) in form.nocondition" :key="index">
            <div class="conditionlist">
              <span class="condition">过去</span>
              <el-input-number style="width: 140px" v-model="item.day" :precision="0" :disabled="editid != ''" :min="1" :max="180" label="天数"></el-input-number>
              <span class="condition">天内</span>
              <!-- <el-select class="selectapp" v-model="item.app" :disabled="editid != ''" placeholder="请选择事件" filterable>
                <el-option v-for="(l,index) in appaccount" :key="index" :label="l.display_name" :value="l.event_name"></el-option>
              </el-select> -->
              <el-select class="selectapp" v-model="item.app" :disabled="editid != ''" placeholder="请选择事件" filterable>
                <el-option v-for="(l,index) in appaccount" :key="index" :label="l.display_name" :value="l.template? `${l.event_name}|${l.template}` : l.event_name"></el-option>
              </el-select>
              <span class="condition" v-show="item.app == 'fb_mobile_activate_app|MACA_MOST_ACTIVE_USERS'">最高</span>
              <el-select class="selectpercent" v-show="item.app == 'fb_mobile_activate_app|MACA_MOST_ACTIVE_USERS'" :disabled="editid != ''" v-model="item.percent">
                <el-option v-for="l in ['25%', '10%', '5%']" :key="l" :label="l" :value="l"></el-option>
              </el-select>
              <i class="el-icon-close" @click="delNoCondition(index)"></i>
            </div>
            <p class="conditionrelative">{{relativekey}}</p>
          </div>
        </div>
        <div class="conditionctrl" v-show="!form.checked">
          <el-button class="ctrlright" type="text" @click="addNoCondition" v-show="ifAdd && editid == ''">新增条件</el-button>
        </div>
      </div>
      <el-form-item class="cbutton">
        <el-button type="primary" @click="toSubmit">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status", "editid", "customtype"],
  data() {
    return {
      dialogFormVisible: false,
      relativearr: ["任意", "所有"],
      form: {
        type: "应用事件",
        app: "",
        relative: "任意",
        name: "",
        desc: "",
        checked: true,
        account: [],
        selectid: [],
        selectaccount: [],
        platform: '',
        // 包含条件
        condition: [
          {
            day: 30,
            app: "",
            percent: "25%"
          }
        ],
        // 排除条件
        nocondition: [
          {
            day: 30,
            app: "",
            percent: "25%"
          }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    // 取消排除选项时，删除已添加的排除条件，剩余一个
    checkListten(vl) {
      if (vl) this.form.nocondition = this.form.nocondition.slice(0, 1);
    },
    getAccount() {
      let id = this.form.app;
      this.$store.dispatch("setApp", { id });

      this.form.account = [];
    },
    toCancel() {
      this.formReset();

      this.$emit("cancelAddbm", "status");
    },
    formCheck() {
      if (this.form.name == "") return [false, "请输入受众名称"];
      if (this.form.name.replace(/[\u0391-\uFFE5]/g, "aa").length > 100) {
        return [false, "受众名称长度不能大于100个字符"];
      }
      if (this.form.desc.replace(/[\u0391-\uFFE5]/g, "aa").length > 200) {
        return [false, "描述长度不能大于200个字符"];
      }
      if (this.form.account.length == 0 && this.form.selectid.length == 0)
        return [false, "请选择广告账户"];

      // 已新增的条件必须填写完整
      let fullcond = this.form.condition.filter(v => v.app == "");
      let nofullcond = this.form.nocondition.filter(v => v.app == "");
      if (fullcond.length != 0) return [false, "新增条件不完整"];
      if (!this.form.checked && nofullcond.length != 0)
        return [false, "新增条件不完整"];

      return [true];
    },
    toSubmit() {
      let check = this.formCheck();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }

      // 组合包含条件
      let condar = [];
      this.form.condition.forEach(v => {
        if (v.day && v.app) {
          let obj = {
            event_sources: [
              {
                type: "app",
                id: this.form.app
              }
            ],
            retention_seconds: v.day * 24 * 60 * 60,
            filter: {
              operator: "and",
              filters: [
                {
                  field: "event",
                  operator: "eq",
                  value: v.app.indexOf("|") != -1 ? v.app.split("|")[0] : v.app
                }
              ]
            }
          };

          if (v.app.indexOf("|") != -1) {
            obj.template = v.app.split("|")[1];
            if (obj.template == "MACA_MOST_ACTIVE_USERS") {
              obj.aggregation = {
                type: "count",
                method: "percentile",
                operator: "in_range",
                value: {
                  from: 100 - parseFloat(v.percent),
                  to: 100
                }
              };
            }
          }

          condar.push(obj);
        }
      });

      // 组合排除条件
      let nocondar = [];
      this.form.nocondition.forEach(v => {
        if (v.day && v.app) {
          let obj = {
            event_sources: [
              {
                type: "app",
                id: parseInt(this.form.app)
              }
            ],
            retention_seconds: v.day * 24 * 60 * 60,
            filter: {
              operator: "and",
              filters: [
                {
                  field: "event",
                  operator: "eq",
                  value: v.app.indexOf("|") != -1 ? v.app.split("|")[0] : v.app
                }
              ]
            }
          };
          if (v.app.indexOf("|") != -1) {
            obj.template = v.app.split("|")[1];
            if (obj.template == "MACA_MOST_ACTIVE_USERS") {
              obj.aggregation = {
                type: "count",
                method: "percentile",
                operator: "in_range",
                value: {
                  from: 100 - parseFloat(v.percent),
                  to: 100
                }
              };
            }
          }

          nocondar.push(obj);
        }
      });

      let rule = {};
      if (condar.length > 0) {
        rule.inclusions = {
          operator: this.form.relative == "任意" ? "or" : "and",
          rules: condar
        };
      }
      if (nocondar.length > 0) {
        rule.exclusions = {
          operator: "or",
          rules: nocondar
        };
      }

      let option = {
        audienceId: this.editid ? this.editid : "",
        applicationId: this.form.app,
        audienceType: "app",
        description: this.form.desc,
        fbAccountIds: this.form.selectid.concat(this.form.account),
        name: this.form.name,
        projectId: this.$route.params.id,
        rule: JSON.stringify(rule)
      };

      let k = "resultid";
      let v = this.editid;
      this.SETSTATE({ k, v });

      if (this.editid)
        this.$store.dispatch("editTarget", {
          option,
          account: this.form.account
        });
      else this.$store.dispatch("addTarget", { option });

      // let totalcount = this.form.selectid.concat(this.form.account).length;
      this.$emit("showResult", this.form.account);

      this.dialogFormVisible = false;
    },
    formReset() {
      this.form.type = "应用事件";
      this.form.app = this.itemlist.find(
        v => v.id == this.$route.params.id
      ).applicationId;
      this.form.relative = "任意";
      this.form.name = "";
      this.form.desc = "";
      this.form.account = [];
      this.form.checked = true;
      this.form.condition = [
        {
          day: 30,
          app: "",
          percent: "25%"
        }
      ];
      this.form.nocondition = [
        {
          day: 30,
          app: "",
          percent: "25%"
        }
      ];

      this.form.selectaccount = [];
      this.form.selectid = [];
    },
    addCondition() {
      this.form.condition.push({
        day: 30,
        app: "",
        percent: "25%"
      });
    },
    delCondition(idx) {
      this.form.condition.splice(idx, 1);
    },
    addNoCondition() {
      this.form.nocondition.push({
        day: 30,
        app: "",
        percent: "25%"
      });
    },
    delNoCondition(idx) {
      if (this.form.nocondition.length > 1)
        this.form.nocondition.splice(idx, 1);
      else {
        this.form.checked = true;
      }
    }
  },
  computed: {
    ...mapState([
      "targetapplist",
      "itemlist",
      "appaccount",
      "targetinfo",
      "addtargetaccount"
    ]),
    ...mapGetters(["setapplist"]),
    // 可选广告账户列表，排除已选广告账户
    applist() {
      return this.setapplist.filter(
        v => this.form.selectid.indexOf(v.fbId) == -1
      );
    },
    relativekey() {
      return this.form.relative == "任意" ? "或" : "且";
    },
    ifAdd() {
      return this.form.checked
        ? this.form.condition.length < 5
        : this.form.condition.length + this.form.nocondition.length < 5;
    },
    conditionHeight() {
      return (
        (this.form.condition.length - 1) * 30 + this.form.condition.length * 102
      );
    },
    noconditionHeight() {
      return (
        (this.form.nocondition.length - 1) * 30 +
        this.form.nocondition.length * 102
      );
    }
  },
  mounted() {
    if (this.itemlist.length != 0) {
      this.form.app = this.itemlist.find(
        v => v.id == this.$route.params.id
      ).applicationId;

      this.getAccount();
      // 初始化根据所选应用，获取应用的所有用户
      this.$store.dispatch("appToAccount", { appid: this.form.app });
    }
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;

      if (n) {
        // 获取应用列表，新增受众用
        this.$store.dispatch("targetApplist");
      }
    },
    itemlist(n, v) {
      if (n.length != 0) {
        this.form.app = this.itemlist.find(
          v => v.id == this.$route.params.id
        ).applicationId;

        this.getAccount();

        this.$store.dispatch("appToAccount", { appid: this.form.app });
      }
    },
    // 根据获取到的已创建受众信息，提取已选择广告账户列表
    addtargetaccount(n, v) {
      if (n.length > 0) {
        this.form.selectaccount = [];
        this.form.selectid = [];

        n.forEach(v => {
          let obj = {
            id: v.fbAccountId,
            name: v.fbAccountName
          };

          this.form.selectaccount.push(obj);
          this.form.selectid.push(v.fbAccountId);
        });
      }
    },
    targetinfo(n, v) {
      if (n) {
        this.form.name = n.name;
        this.form.desc = n.description;
        this.form.account = [];

        let rule = eval("(" + n.rule + ")");

        this.form.relative = rule.inclusions.operator == "or" ? "任意" : "所有";

        if (rule.inclusions && rule.inclusions.rules.length > 0) {
          this.form.condition = [];
          rule.inclusions.rules.forEach(v => {
            let obj = {
              day: v.retention_seconds / (24 * 60 * 60),
              app: v.template
                ? `${v.filter.filters[0].value}|${v.template}`
                : v.filter.filters[0].value,
              percent: v.aggregation
                ? v.aggregation.value.to - v.aggregation.value.from + "%"
                : "25%"
            };

            this.form.condition.push(obj);
          });
        }

        if (rule.exclusions && rule.exclusions.rules.length > 0) {
          this.form.nocondition = [];
          this.form.checked = false;
          rule.exclusions.rules.forEach(v => {
            let obj = {
              day: v.retention_seconds / (24 * 60 * 60),
              app: v.template
                ? `${v.filter.filters[0].value}|${v.template}`
                : v.filter.filters[0].value,
              percent: v.aggregation
                ? v.aggregation.value.to - v.aggregation.value.from + "%"
                : "25%"
            };

            this.form.nocondition.push(obj);
          });
        }
      }
    },
    editid(n, v) {
      if (n) {
        let audience_id = n;
        this.$store.dispatch("getTargetInfo", { audience_id });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  width: 100%;
}
.leftform {
  width: 50%;
  float: left;
  &.forleft {
    padding-right: 20px;
    box-sizing: border-box;
  }
  .condition {
    color: #606266;
  }
  .scale{
    color: #606266;
    float: right;
    line-height: 40px;
  }
  .selectapp {
    margin: 0 10px;
    width: 100px;
  }
  .selectpercent {
    width: 80px;
  }
  .cinput {
    width: 100px;
    margin: 0 10px;
  }
  .conditionbox {
    overflow: hidden;
    .conditionlist {
      width: 100%;
      padding: 30px 0 30px 20px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      border-radius: 4px;
      position: relative;
      .el-icon-close {
        right: 10px;
        top: 10px;
        position: absolute;
        cursor: pointer;
      }
    }
    .conditionrelative {
      line-height: 30px;
      height: 30px;
    }
  }
  .conditionctrl {
    margin-bottom: 20px;
    .ctrlleft {
      margin-right: 20px;
      height: 20px;
      padding: 10px 0;
    }
    .ctrlright {
    }
  }
}
.cline {
  // width: 50%;
  // float: left;
}
.cbutton {
  width: 100%;
  float: left;
  padding-right: 80px;
  box-sizing: border-box;
  text-align: center;
}
.cform {
  overflow: hidden;
}
</style>