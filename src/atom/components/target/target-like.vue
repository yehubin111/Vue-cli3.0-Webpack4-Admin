<template>
  <el-dialog title="创建类似受众" :visible.sync="dialogFormVisible" class="dialog likedialog" @close="toCancel">
    <el-form ref="form" :model="form" label-width="90px" class="cform">
      <el-form-item label="自定义受众" v-if="liketype == 1">
        <el-select class="search" v-model="form.custom" :disabled="likeeditid != ''" placeholder="请选择自定义受众" filterable @change="formTargetName">
          <el-option v-for="(l,index) in liketarget" :key="index" :label="l.name" :value="l.id"></el-option>
        </el-select>
        <p class="info">至少拥有100个用户</p>
      </el-form-item>
      <el-form-item label="广告" v-if="liketype == 2">
        <div class="selectinput">
          <div v-if="form.customarr.length > 0">
            <el-popover placement="right" width="400" trigger="hover">
              <div v-for="(g, index) in form.customarrfrom" :key="index" v-if="g.bth.length > 0">
                <h1 class="cpselectedtitle">{{g.name}}</h1>
                <p class="cpselected" v-for="(t, idx) in g.bth" :key="idx">{{idx + 1}}.{{t}}</p>
              </div>
              <el-tag slot="reference" class="custag" type="">
                已选{{form.customarr.length}}个
              </el-tag>
            </el-popover>
          </div>
          <el-button class="cusinput" type="primary" size="small" v-show="likeeditid == ''" @click.stop="filterShow">选择创建记录</el-button>
        </div>
        <div class="downselect" v-if="status2">
          <div class="specialselect" v-show="status3" v-Clickoutside="filterHide">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="filterinput">
            </el-input>
            <div class="treebox">
              <div class="treelist">
                <div class="treeline" v-for="(item, index) in targetplanlist" :key="index">
                  <p class="ftree" @click="secondTree(item.id, item.name)">
                    <el-checkbox v-model="item.checked" :indeterminate="item.isIndeterminate" :disabled="item.secondtree" class="treecheck" @change="firstTreeSelect(item.id, item.name)"></el-checkbox>
                    {{item.name}}
                  </p>
                </div>
              </div>
              <div class="ctreelist">
                <p class="ctree" v-for="(item, index) in treesecondlist" :key="index">
                  <el-tooltip class="item" effect="dark" :content="item.campaignName" placement="top-start">
                    <el-checkbox v-model="item.checked" class="treecheck" @change="secondTreeSelect(item.id, item.planId, item.planname)">
                      {{item.campaignName}}
                    </el-checkbox>
                  </el-tooltip>
                </p>
              </div>
            </div>
          </div>
        </div>
        <p class="info">至少拥有100个用户</p>
      </el-form-item>
      <el-form-item label="主页" v-if="liketype == 3">
        <el-select class="search" v-model="form.custom" :disabled="likeeditid != ''" placeholder="请选择主页，可搜索" filterable @change="setName">
          <el-option v-for="(l,index) in allpagelist" :key="index" :label="l.name" :value="l.pageId"></el-option>
        </el-select>
        <p class="info">至少拥有100个用户</p>
      </el-form-item>
      <el-form-item label="国家">
        <el-select class="search" v-model="form.country" :disabled="likeeditid != ''" multiple placeholder="请选择国家，可搜索" filterable @change="setName">
          <el-option v-for="l in othercountries" :key="l.code" :label="l.name + '(' + l.code + ')'" :value="l.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="受众规模">
        <el-slider v-model="form.scale" class="slider" :disabled="likeeditid != ''" range :min="0" :max="20" :format-tooltip="formatTooltip" @change="setName"></el-slider>
        <p class="info">可以选择国家/地区总人口的 0% 到 20% 作为广告受众规模，1% 代表最接近受众来源的规模</p>
      </el-form-item>
      <el-form-item label="受众名称">
        <el-input v-model="form.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.desc" placeholder="请输入描述，选填"></el-input>
      </el-form-item>
      <el-form-item label="已选账户" v-if="selectaccount.length > 0">
        <el-select class="search" v-model="selectid" multiple disabled placeholder="请选择广告账户" filterable>
          <el-option v-for="(l,index) in selectaccount" :key="index" :label="l.name + '('+l.id.split('_')[1]+')'" :value="l.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告账户">
        <el-select class="search" v-model="form.account" collapse-tags multiple placeholder="请选择广告账户" filterable>
          <el-option v-for="(l,index) in applist" :key="index" :label="l.name + '('+l.fbId.split('_')[1]+')'" :value="l.fbId"></el-option>
        </el-select>
      </el-form-item>
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
import Clickoutside from "element-ui/src/utils/clickoutside";
let timeout;
let campaignaccount;
// let treerun;
export default {
  props: ["status", "liketype", "likeeditid"], //liketype
  directives: {
    Clickoutside
  },
  data() {
    return {
      input: "",
      // liketype: 2,
      filterText: "",
      status2: false,
      status3: false,
      // treeshow: true,
      // treeload: false,
      props1: {
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      dialogFormVisible: false,
      relativekey: "或",
      selectaccount: [],
      selectid: [],
      form: {
        custom: "",
        customarr: [],
        customarrfrom: [],
        country: [],
        scale: [0, 20],
        name: "",
        desc: "",
        account: []
      },
      customname: "",
      camppage: 1,
      campkword: ""
      // applist: []
    };
  },
  created() {},
  methods: {
    ...mapMutations([
      "SETSTATE",
      "TARGETLOGOPENCLOSE",
      "TARGETTREE",
      "TARGETTREECHECK",
      "TARGETPLANLISTCHECK"
    ]),
    filterShow() {
      this.status2 = true;
      this.status3 = !this.status3;
    },
    filterHide() {
      this.status3 = false;
    },
    secondTree(id, name) {
      let plan_id = id;
      let planName = name;
      /**
       * 获取campaign列表
       * 如果已经获取
       */
      if (this.treegradeall[`plan_id_${plan_id}`]) this.TARGETTREE(plan_id);
      else this.$store.dispatch("getTargetLog", { plan_id, planName });
    },
    selectCallback(planid, planname) {
      /**
       * form.customarrfrom 用于存储显示已选批次以及广告账户
       * 存放格式 [{name: 推广计划名称, bth: [批次id列表]}]
       * form.customarr 用于存储已选批次
       * 存放格式 [{name: 批次名称, plannam: 推广计划名称, id: 批次id}]
       */
      this.form.customarrfrom = this.form.customarrfrom.filter(
        v => v.name != planname
      );
      this.form.customarr = this.form.customarr.filter(
        v => v.planname != planname
      );

      let obj = {};
      obj.name = planname;
      obj.bth = [];

      this.treegradelist.forEach(v => {
        if (v.checked) {
          obj.bth.push(v.campaignName);

          let ot = {};
          ot.id = v.id;
          ot.planname = planname;
          ot.name = v.campaignName;
          this.form.customarr.push(ot);
        }
      });
      this.form.customarrfrom.push(obj);

      /**
       * 根据批次获取广告账户
       */
      let idarr = [];
      this.form.customarr.forEach(v => {
        idarr.push(v.id);
      });

      clearTimeout(campaignaccount);
      campaignaccount = setTimeout(() => {
        this.$store.dispatch("getTargetCampaignAccount", {
          project_id: this.$route.params.id,
          batch_id: idarr.join(",")
        });
      }, 300);
    },
    firstTreeSelect(id, planname) {
      let check = this.targetplanlist.find(v => v.id == id).checked;
      console.log(id, check);
      // 全选的时候，需要取消当前选项的不确定选择状态，不然会被覆盖
      this.TARGETTREECHECK({ plan_id: id, check });

      this.selectCallback(id, planname);

      this.TARGETPLANLISTCHECK({
        id: id,
        key: "isIndeterminate",
        vl: false
      });
    },
    secondTreeSelect(id, planid, planname) {
      // 子选项有选中
      if (this.treegradeall[`plan_id_${planid}`].find(v => v.checked)) {
        this.TARGETPLANLISTCHECK({
          id: planid,
          key: "isIndeterminate",
          vl: true
        });
        this.TARGETPLANLISTCHECK({ id: planid, key: "checked", vl: false });
        // 子选项全部选中
        if (!this.treegradeall[`plan_id_${planid}`].find(v => !v.checked)) {
          this.TARGETPLANLISTCHECK({
            id: planid,
            key: "isIndeterminate",
            vl: false
          });
          this.TARGETPLANLISTCHECK({ id: planid, key: "checked", vl: true });
        }
      } else {
        this.TARGETPLANLISTCHECK({
          id: planid,
          key: "isIndeterminate",
          vl: false
        });
        this.TARGETPLANLISTCHECK({ id: planid, key: "checked", vl: false });
      }

      this.selectCallback(planid, planname);
    },
    treeFilter(text) {
      if (text == "") {
        for (let g in this.treegradeall) {
          let id = g.split("_")[2];
          this.TARGETPLANLISTCHECK({ id, key: "secondtree", vl: false });
        }
      } else {
        this.TARGETPLANLISTCHECK({ key: "secondtree", vl: true });
      }
    },
    loadMore() {
      if (this.ifmorecampaigns) {
        let k = "ifmorecampaigns";
        let v = false;

        this.SETSTATE({ k, v });

        this.camppage++;

        this.$store.dispatch("targetCampaigns", {
          project_id: this.$route.params.id,
          pageIndex: this.camppage,
          keyword: this.campkword
        });

        console.log(this.camppage);
      }
    },
    // 根据所选自定义受众获取可选广告账户列表
    formTargetName() {
      if (this.form.custom) {
        let targetid = this.form.custom;
        this.$store.dispatch("getTargetAccount", { targetid });
        this.form.account = [];
      }

      this.setName();
    },
    // 根据条件自动生成受众名称
    setName() {
      switch (this.liketype) {
        case 1:
          if (!this.form.custom || this.form.country.length == 0) {
            return;
          }
          this.customname = this.liketarget.find(
            v => v.id == this.form.custom
          ).name;
          this.form.name = `类似受众（${this.form.country.join(",")},${
            this.form.scale[0]
          }%-${this.form.scale[1]}%）- ${this.customname}`;

          break;
        case 2:
          if (this.form.country.length == 0) {
            return;
          }
          this.form.name = `类似受众（${this.form.country.join(",")},${
            this.form.scale[0]
          }%-${this.form.scale[1]}%）- 根据广告`;
          break;
        case 3:
          if (!this.form.custom || this.form.country.length == 0) {
            return;
          }
          this.customname = this.allpagelist.find(
            v => v.pageId == this.form.custom
          ).name;
          this.form.name = `类似受众（${this.form.country.join(",")},${
            this.form.scale[0]
          }%-${this.form.scale[1]}%）- ${this.customname}`;

          break;
      }
    },
    // 受众规模格式化
    formatTooltip(val) {
      return `${val}%`;
    },
    toCancel() {
      this.formReset();
      this.$emit("cancelAddbm", "status2");

      this.status2 = false;
    },
    formCheck() {
      if (this.liketype == 1 && this.form.custom == "")
        return [false, "请选择自定义受众"];
      if (this.liketype == 3 && this.form.custom == "")
        return [false, "请选择主页"];
      if (this.liketype == 2 && this.form.customarr.length == 0)
        return [false, "请选择广告"];
      if (this.form.country.length == 0) return [false, "请选择国家"];
      if (this.form.scale[0] == this.form.scale[1])
        return [false, "受众规模最小值与最大值不能相同"];
      if (this.form.name == "") return [false, "请输入受众名称"];
      if (this.form.name.replace(/[\u0391-\uFFE5]/g, "aa").length > 100) {
        return [false, "受众名称长度不能大于100个字符"];
      }
      if (this.form.desc.replace(/[\u0391-\uFFE5]/g, "aa").length > 200) {
        return [false, "描述长度不能大于200个字符"];
      }
      if (this.form.account.length == 0 && this.selectid.length == 0)
        return [false, "请选择广告账户"];

      return [true];
    },
    toSubmit() {
      console.log(this.form);
      let check = this.formCheck();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }

      let liketp = "";
      let rule = {
        ratio: this.form.scale[1] / 100,
        starting_ratio: this.form.scale[0] / 100
      };

      if (this.liketype == 1) {
        liketp = "custom_audience";
        rule.type = "custom_ratio";
        rule.origin = [
          {
            id: this.form.custom,
            name: this.customname,
            type: "custom_audience"
          }
        ];
      }
      if (this.liketype == 2) {
        liketp = "campaign_conversions";
        rule.origin_ids = [];
        this.form.customarr.forEach(v => {
          // let s = v.substring(0, v.length - 1);
          rule.origin_ids.push(v.id);
        });
        rule.conversion_type = "campaign_conversions";
      }
      if (this.liketype == 3) {
        liketp = "page";
        rule.page_id = this.form.custom;
        rule.conversion_type = "pagelike";
      }

      if (this.form.country.length > 1) {
        rule.target_countries = this.form.country;
      } else {
        rule.country = this.form.country.join(",");
      }

      let option = {
        audienceId: this.likeeditid ? this.likeeditid : "",
        applicationId: this.applicationid,
        audienceType: "lookalike",
        busId: this.form.custom,
        country: this.form.country,
        ratio: this.form.scale[1] / 100 + "",
        startingRatio: this.form.scale[0] / 100 + "",
        description: this.form.desc,
        fbAccountIds: this.selectid.concat(this.form.account),
        name: this.form.name,
        projectId: this.$route.params.id,
        lookalikeType: liketp,
        rule: JSON.stringify(rule)
      };

      if (this.liketype == 2) {
        let idarr = [];
        this.form.customarr.forEach(v => {
          idarr.push(v.id);
        });

        option.batchId = idarr;
      }

      let k = "resultid";
      let v = this.likeeditid;
      this.SETSTATE({ k, v });

      if (this.likeeditid)
        this.$store.dispatch("editTarget", {
          option,
          account: this.form.account
        });
      else this.$store.dispatch("addTarget", { option });

      // let totalcount = this.selectid.concat(this.form.account).length;
      this.$emit("showResult", this.form.account);
      this.formReset();
      this.dialogFormVisible = false;
    },
    formReset() {
      this.form.custom = "";
      this.form.customarr = [];
      this.form.customarrfrom = [];
      this.form.country = [];
      this.form.scale = [0, 20];
      this.form.desc = "";
      this.form.account = [];
      this.selectid = [];
      this.form.name = "";
      this.selectaccount = [];
      this.filterText = "";
      // this.applist = [];

      let k = "targetaccount";
      let v = [];
      this.SETSTATE({ k, v });

      this.SETSTATE({ k: "targetplanlist", v: [] });
      this.SETSTATE({ k: "treegradelist", v: [] });
      this.SETSTATE({ k: "treegradefilter", v: "" });
      this.SETSTATE({ k: "treegradeall", v: {} });
    }
  },
  computed: {
    ...mapState([
      "othercountries",
      "liketarget",
      "allpagelist",
      // "targetcampaigns",
      "ifmorecampaigns",
      "itemlist",
      "liketargetinfo",
      "addliketargetaccount",
      "campainother",
      "targetaccount",
      "targetplanlist",
      "treegradelist",
      "treegradeall",
      "targetcampaignaccount"
    ]),
    ...mapGetters(["setapplist"]),
    treesecondlist() {
      return this.treegradelist.filter(
        v => v.campaignName.indexOf(this.filterText) != -1
      );
    },
    applicationid() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id)
        .applicationId;
    },
    applist() {
      /**
       * 可选择广告账户列表
       * 主要针对编辑情况下
       * 排除已选广告账户
       */
      if (this.liketype == 1) {
        return this.targetaccount.filter(
          v => this.selectid.indexOf(v.fbId) == -1
        );
      } else if (this.liketype == 2) {
        return this.targetcampaignaccount.filter(
          v => this.selectid.indexOf(v.fbId) == -1
        );
      } else {
        return this.setapplist.filter(v => this.selectid.indexOf(v.fbId) == -1);
      }
    }
  },
  watch: {
    filterText(val) {
      // this.$refs.tree2.filter(val);
      this.SETSTATE({ k: "treegradefilter", v: val });
      if (!val) {
        for (let g in this.treegradeall) {
          let id = g.split("_")[2];
          this.TARGETPLANLISTCHECK({ id, key: "secondtree", vl: false });
        }
      } else {
        this.TARGETPLANLISTCHECK({ key: "secondtree", vl: true });
      }
    },
    status(n, v) {
      this.dialogFormVisible = n;

      if (n) {
        // 获取自定义受众列表
        if (this.liketype == 1) {
          this.$store.dispatch("likeTarget", {
            project_id: this.$route.params.id
          });
        }
        //  else {
        //   this.applist = this.setapplist.filter(
        //     v => this.selectid.indexOf(v.fbId) == -1
        //   );
        // }

        // 获取广告系列列表
        if (this.liketype == 2) {
          // 根据广告创建类似受众
          this.$store.dispatch("getTargetPlan", {
            project_id: this.$route.params.id
          });
        }
      }
    },
    // targetaccount(n, v) {
    //   this.applist = this.targetaccount.filter(
    //     v => this.selectid.indexOf(v.fbId) == -1
    //   );
    // },
    likeeditid(n, v) {
      if (n) {
        // 根据受众ID 获取已创建受众信息，包括国家、规模等
        let audience_id = n;
        this.$store.dispatch("getLikeTargetInfo", { audience_id });
      }
    },
    addliketargetaccount(n, v) {
      // 从所获取的受众信息中，提取已选择广告账户列表
      if (n.length > 0) {
        this.selectaccount = [];
        this.selectid = [];

        n.forEach(v => {
          let obj = {
            id: v.fbAccountId,
            name: v.fbAccountName
          };

          this.selectaccount.push(obj);
          this.selectid.push(v.fbAccountId);
        });
      }
    },
    // 已创建受众信息
    liketargetinfo(n, v) {
      if (n) {
        this.form.name = n.name;
        this.form.desc = n.description;

        let rule = eval("(" + n.rule + ")");
        this.form.scale = [rule.starting_ratio * 100, rule.ratio * 100];
        this.form.country = rule.target_countries
          ? rule.target_countries
          : [rule.country];

        if (this.liketype == 1) {
          this.form.custom = rule.origin[0].id;
          /**
           * 编辑的时候，根据自定义受众获取相应广告账户
           * 排除掉已选择广告账户 selectid
           * 等于可选择广告账户列表 applist（见上方computed）
           */
          this.$store.dispatch("getTargetAccount", {
            targetid: rule.origin[0].id
          });
        }
        if (this.liketype == 2) {
          this.form.customarr = [];
          this.campainother.forEach(v => {
            let obj = {};
            obj.name = v.campaignName;
            obj.id = v.id;
            obj.planname = v.planName;

            this.form.customarr.push(obj);
          });

          /**
           * form.customarrfrom 用于存储显示已选批次以及广告账户
           * 存放格式 [{name: 推广计划名称, btn: [批次id列表]}]
           */
          this.form.customarrfrom = [];
          for (let i = 0; i < this.form.customarr.length; i++) {
            let v = this.form.customarr[i];
            if (this.form.customarrfrom.find(l => l.name == v.planname)) {
              continue;
            }
            // this.form.customarr.forEach(v => {
            let obj = {};
            obj.name = v.planname;
            obj.bth = [];
            this.form.customarr.forEach(g => {
              if (g.planname == obj.name) {
                obj.bth.push(g.name);
              }
            });

            this.form.customarrfrom.push(obj);
          }

          // 根据批次获取可选广告账户列表
          let idarr = [];
          this.form.customarr.forEach(v => {
            idarr.push(v.id);
          });
          this.$store.dispatch("getTargetCampaignAccount", {
            project_id: this.$route.params.id,
            batch_id: idarr.join(",")
          });
        }
        if (this.liketype == 3) {
          this.form.custom = rule.page_id;
        }
      }
    }
  }
};
</script>
<style>
/* .campaignselect .el-tag {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 28px;
} */
</style>

<style lang="less" scoped>
.search {
  width: 100%;
}

.cline {
  // width: 50%;
  // float: left;
}
.cpselected {
  margin-bottom: 3px;
}
.cpselectedtitle {
  margin-top: 5px;
  margin-bottom: 5px;
}
.selectinput {
  overflow: hidden;

  .custag {
    float: left;
    margin-right: 10px;
    margin-top: 5px;
  }
  .cusinput {
    float: left;
    width: auto;
    margin-top: 5px;
  }
}
.specialselect {
  position: absolute;
  height: 400px;
  bottom: -366px;
  border-radius: 5px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: block;
  z-index: 1002;
  padding: 10px;
  background-color: #fff;
  width: 800px;
  box-sizing: border-box;
  .filterinput {
    margin-bottom: 10px;
  }
  .treebox {
    height: 330px;
    .treelist {
      float: left;
      width: 40%;
      overflow-y: auto;
      border-right: 1px solid #ebebeb;
      box-sizing: border-box;
      height: 330px;
      .treeline {
        .treecheck {
          margin-right: 5px;
        }
        .ftree {
          line-height: 30px;
          padding-left: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;
          &:hover {
            background-color: #eee;
          }
        }
      }
    }
    .ctreelist {
      padding-left: 15px;
      float: left;
      width: 60%;
      overflow-y: auto;
      box-sizing: border-box;
      height: 330px;
      .ctree {
        line-height: 30px;
        height: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .treecheck {
          margin-right: 5px;
          width: 100%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }
}
.cbutton {
  width: 100%;
  // float: left;
  padding-right: 80px;
  box-sizing: border-box;
  text-align: center;
}
.cform {
  // overflow: hidden;
  .info {
    line-height: 24px;
    color: #666;
    margin-top: 10px;
  }
  .slider {
    margin: 0 30px 0 10px;
  }
}
</style>
