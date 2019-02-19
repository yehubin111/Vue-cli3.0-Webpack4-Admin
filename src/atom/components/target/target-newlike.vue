<template>
  <el-dialog
    :title="`${likeeditid?'编辑':'创建'}类似受众`"
    :visible.sync="dialogFormVisible"
    class="dialog likedialog"
    @close="toCancel"
  >
    <el-form ref="form" :model="form" label-width="90px" class="cform">
      <el-form-item label="广告账户">
        <el-select
          class="search"
          v-model="form.account"
          :disabled="likeeditid != ''"
          placeholder="请选择广告账户，可搜索"
          filterable
          @change="selectAccount"
        >
          <el-option
            v-for="(l,index) in setapplist"
            :key="index"
            :label="l.name + '('+l.fbId.split('_')[1]+')'"
            :value="l.fbId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自定义受众" v-show="liketype == 1">
        <el-select
          class="search"
          v-model="form.custom"
          :disabled="likeeditid != ''"
          placeholder="请选择自定义受众，可搜索"
          filterable
          @change="setName"
        >
          <el-option
            v-for="(l,index) in liketarget"
            :key="index"
            :label="l.name + '('+l.audienceId+')'"
            :value="l.audienceId"
          ></el-option>
        </el-select>
        <p class="info">至少拥有100个用户</p>
      </el-form-item>
      <el-form-item label="选择广告" v-show="liketype == 2">
        <el-select
          class="search"
          v-model="form.adset"
          :disabled="likeeditid != ''"
          placeholder="请选择广告组，支持编号搜索"
          multiple
          filterable
          collapse-tags
          remote
          :remote-method="searchAdset"
        >
          <el-option
            v-for="(item,index) in targetadsetlist"
            :key="index"
            :label="`${item.adSetName}(${item.adsetId})`"
            :value="item.adsetId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主页" v-show="liketype == 3">
        <el-select
          class="search"
          v-model="form.custom"
          :disabled="likeeditid != ''"
          placeholder="请选择主页，可搜索"
          filterable
          @change="setName"
        >
          <el-option
            v-for="(l,index) in allpagelist"
            :key="index"
            :label="l.name"
            :value="l.pageId"
          ></el-option>
        </el-select>
        <p class="info">至少拥有100个用户</p>
      </el-form-item>
      <el-form-item label="国家">
        <el-select
          class="search"
          v-model="form.country"
          :disabled="likeeditid != ''"
          multiple
          placeholder="请选择国家，可搜索"
          filterable
          collapse-tags
          @change="setName"
        >
          <el-option
            v-for="l in othercountries"
            :key="l.code"
            :label="l.name + '(' + l.code + ')'"
            :value="l.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="受众规模">
        <el-slider
          v-model="form.scale"
          class="slider"
          :disabled="likeeditid != ''"
          range
          :min="0"
          :max="20"
          :format-tooltip="formatTooltip"
          @change="setName"
        ></el-slider>
        <p class="info">可以选择国家/地区总人口的 0% 到 20% 作为广告受众规模，1% 代表最接近受众来源的规模</p>
      </el-form-item>
      <el-form-item label="受众名称">
        <el-input v-model="form.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.desc" placeholder="请输入描述，选填"></el-input>
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
export default {
  props: ["status", "liketype", "likeeditid"], //liketype
  directives: {
    Clickoutside
  },
  data() {
    return {
      input: "",
      filterText: "",
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
        adset: [],
        custom: "",
        country: [],
        scale: [0, 20],
        name: "",
        desc: "",
        account: ""
      },
      customname: "",
      camppage: 1,
      campkword: ""
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
    searchAdset(query) {
      this.getCampaignAdset({
        type: "adset",
        key: "fbAdSetId",
        keyword: query
      });
    },
    // 选择广告账户之后
    selectAccount() {
      // 获取该广告账户下的自定义受众
      if (this.liketype == 1) {
        let account = this.form.account;
        this.$store.dispatch("likeTarget", { adaccount: account });
        this.form.custom = '';
      }
      // 获取广告系列列表，广告管理相同接口
      if (this.liketype == 2) {
        this.getCampaignAdset({ type: "adset" });
        this.form.adset = [];
      }
    },
    // 根据条件自动生成受众名称
    setName() {
      switch (this.liketype) {
        case 1:
          if (!this.form.custom || this.form.country.length == 0) {
            return;
          }
          this.customname = this.liketarget.find(
            v => v.audienceId == this.form.custom
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
      if (!this.form.account) return [false, "请选择广告账户"];
      if (this.liketype == 1 && this.form.custom == "")
        return [false, "请选择自定义受众"];
      if (this.liketype == 3 && this.form.custom == "")
        return [false, "请选择主页"];
      if (this.liketype == 2 && this.form.adset.length == 0)
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

      return [true];
    },
    async toSubmit() {
      let check = this.formCheck();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }

      let type = "";
      let rule = {
        ratio: this.form.scale[1] / 100,
        starting_ratio: this.form.scale[0] / 100
      };

      if (this.form.country.length > 1) {
        rule.location_spec = {
          geo_locations: {
            countries: this.form.country
          }
        };
      } else {
        rule.country = this.form.country.join(",");
      }

      let option = {
        adaccountId: this.form.account,
        description: this.form.desc,
        fbAudienceId: this.likeeditid ? this.likeeditid : "",
        name: this.form.name
      };
      if (this.liketype == 1) {
        type = "auto";
        option["originAudienceId"] = this.form.custom;
      }
      if (this.liketype == 2) {
        type = "ad";
        rule["origin_ids"] = this.form.adset;
        rule["conversion_type"] = "campaign_conversions";
      }
      if (this.liketype == 3) {
        type = "page";
        option["pageId"] = this.form.custom;
        rule["page_id"] = this.form.custom;
        rule["conversion_type"] = "page_like";
      }
      option["lookalikeSpec"] = JSON.stringify(rule);

      let res = await this.$store.dispatch("addTarget", { option, type });

      if (res.data.status != "failed") {
        this.dialogFormVisible = false;
      }
    },
    getCampaignAdset({ type, key = "", keyword = "", adaccount }) {
      if (!this.form.account) {
        this.SETSTATE({ k: "targetadsetlist", v: [] });
        return;
      }
      let option = {
        groupByClause: type == "campaignName" ? "campaign_id" : "adset_id",
        pageNo: 1,
        pageSize: 1000,
        accountIdStr: this.form.account.split("_")[1],
        projectId: this.$route.params.id,
        endDate: this.$timeFormat(new Date(), "yyyy-MM-dd"),
        startDate: this.$timeFormat(
          new Date().getTime() - 10 * 24 * 3600 * 1000,
          "yyyy-MM-dd"
        )
      };
      if (key && keyword) {
        option[key] = keyword;
      }
      this.$store.dispatch("targetAdlist", { option, type });
    },
    formReset() {
      this.form.custom = "";
      this.form.country = [];
      this.form.scale = [0, 20];
      this.form.desc = "";
      this.form.account = "";
      this.form.name = "";
      this.form.adset = [];
      this.selectaccount = [];
      this.filterText = "";

      // this.SETSTATE({ k: "targetaccount", v: [] });
      this.SETSTATE({ k: "targetadsetlist", v: [] });
      this.SETSTATE({ k: "liketarget", v: [] });
    }
  },
  computed: {
    ...mapState([
      "othercountries",
      "liketarget",
      "allpagelist",
      "ifmorecampaigns",
      "itemlist",
      "liketargetinfo",
      // "targetaccount",
      "targetadsetlist"
    ]),
    ...mapGetters(["setapplist"]),
    applicationid() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id)
        .applicationId;
    }
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;

      if (n) {
        // 获取自定义受众列表
        if (this.liketype == 1) {
        }

        // 获取广告系列列表，广告管理相同接口
        if (this.liketype == 2) {
        }
      }
    },
    likeeditid(n, v) {
      if (n) {
        // 根据受众ID 获取已创建受众信息，包括国家、规模等
        let id = n;
        this.$store.dispatch("getTargetInfo", {
          id,
          type: "lookalike"
        });
      }
    },
    // 已创建受众信息
    liketargetinfo(n, v) {
      if (n) {
        this.form.name = n.name;
        this.form.desc = n.description;
        this.form.account = n.ownAccountId;

        let rule = JSON.parse(n.lookalikeSpec);
        this.form.scale = [rule.starting_ratio?rule.starting_ratio * 100:0, rule.ratio * 100];
        this.form.country = rule.target_countries
          ? rule.target_countries
          : [rule.country];

        if (this.liketype == 1) {
          this.form.custom = rule.origin[0].id;

          // 根据广告账户获取自定义受众列表
          let account = this.form.account;
          this.$store.dispatch("likeTarget", { adaccount: account });
        }
        if (this.liketype == 2) {
          this.form.adset = rule.origin.map(v => v.id);

          this.searchAdset(this.form.custom);
        }
        if (this.liketype == 3) {
          this.form.custom = rule.origin[0].id;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  width: 100%;
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
