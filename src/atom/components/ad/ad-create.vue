<template>
  <div class="create">
    <select-img :status.sync="selectstatus" @select="selectImage"></select-img>
    <transition name="slide-fade">
      <div class="cr-content" v-show="status">
        <div class="title">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
              v-for="(item, index) in breadcrumb"
              :key="index"
              :class="{tabnav: true, important: item.important}"
              :title="item.name"
            >{{item.name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="infobox" v-show="type == 'campaignName'">
          <create-campaign ref="createCampaign" :editId="editId" @changeEdit="changeEdit"></create-campaign>
        </div>
        <div class="infobox adsetbox" v-show="type == 'adSetName'">
          <create-adset ref="createAdset" :editId="editId" @changeEdit="changeEdit"></create-adset>
        </div>
        <div class="infobox" v-show="type == 'adName'">
          <create-ad ref="createAd" @showTempImages="showTempImages" :editId="editId" @changeEdit="changeEdit"></create-ad>
        </div>
        <div class="buttomctrl">
          <el-button size="medium" @click="hideBox">取消</el-button>
          <el-button type="primary" size="medium" @click="saveInfo" :disabled="hascreatead">保存</el-button>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="cr-shadow" v-show="status" @click="hideBox"></div>
    </transition>
  </div>
</template>

<script>
import SelectImg from "../create/create-selectimg";
import CreateCampaign from "./ad-createcampaign";
import CreateAdset from "./ad-createadset";
import CreateAd from "./ad-createad";
import { mapMutations, mapState } from "vuex";
import { Msgwarning, Msgsuccess, Msgerror } from "../../js/message";
import { Loading } from "element-ui";
export default {
  // props: ["type"],
  components: {
    CreateAdset,
    CreateCampaign,
    CreateAd,
    SelectImg
  },
  data() {
    return {
      selectstatus: false,
      typeName: "",
      status: false,
      breadcrumb: [],
      type: "",
      editId: [],
      editName: [],
      ifEdit: false
    };
  },
  mounted() {},
  methods: {
    ...mapMutations(["SETSTATE"]),
    // 20190507新增，可以直接选择模板制作的图片
    showTempImages() {
      this.selectstatus = true;
    },
    selectImage(img) {
      this.$refs.createAd.selectImage(img);
    },
    async saveInfo() {
      let option, res, msg;
      switch (this.type) {
        case "campaignName":
          // 提取信息
          option = this.$refs.createCampaign.extractInfo();
          if (!option) return;

          // 区分创建与编辑
          if (this.editId && this.editId.length > 0) {
            res = await this.$store.dispatch("editCampaign", option);
            msg = "编辑成功";
          } else {
            res = await this.$store.dispatch("createCampaign", option);
            msg = "创建成功";
          }
          break;
        case "adSetName":
          // 提取信息
          let opt = this.$refs.createAdset.extractInfo();
          if (!opt) return;

          // 区分创建与编辑
          if (this.editId && this.editId.length > 0) {
            res = await this.$store.dispatch("editAdset", opt);
            msg = "编辑成功";
          } else {
            option = {
              adAccount: opt.campaign.split("|")[1],
              // adSet: ["string"],
              adSetName: opt.name,
              applicationId: opt.applicationid,
              bidAmount: opt.maxbid === "" ? null : parseInt(opt.maxbid * 100),
              billingType: opt.bid,
              budgetType: opt.moneytype,
              campaignList: [opt.campaign.split("|")[0]],
              country: opt.country,
              dayBudget: parseInt(opt.money * 100),
              days: opt.rdate,
              device:
                opt.platform == "itunes"
                  ? opt.equip.filter(v => v == "iPhone" || v == "iPad")
                  : opt.equip.filter(v => v == "Android_Smartphone"),
              endMinute: this.$timeFormat(opt.rtime[1], "HH") + ":00",
              dynamicCreative: opt.activecreate,
              endTime: new Date(opt.date[1]).getTime(),
              filteAttentionUser: opt.filtrapage,
              filteInstalledUser: opt.filtra.indexOf("1") != -1 ? "yes" : "",
              gender: opt.sex,
              interest: opt.interest,
              locales: opt.language,
              maxAge: opt.age[1],
              minAge: opt.age[0],
              platform: opt.platform,
              position: opt.auto[0] == "1" ? [] : opt.verpla,
              scheduleType: opt.timerange,
              startMinute: this.$timeFormat(opt.rtime[0], "HH") + ":00",
              startTime: new Date(opt.date[0]).getTime(),
              totalBudget: parseInt(opt.money * 100),
              minVersion: opt.lowversion,
              maxVersion: opt.highversion,
              includeAudience: opt.target,
              excludeAudience: opt.iftarget[0] == "1" ? [] : opt.notarget
            };

            res = await this.$store.dispatch("createAdset", option);
            msg = "创建成功";
          }
          break;
        case "adName":
          // 提取信息
          let adoption = this.$refs.createAd.extractInfo();
          if (!adoption) return;

          // 区分创建与编辑
          if (adoption[1] == "select") {
            if (this.editId && this.editId.length > 0) {
              res = await this.$store.dispatch("editAd", adoption[0]);
              msg = "编辑成功";
            } else {
              res = await this.$store.dispatch("createAd", adoption[0]);
              msg = "创建成功";
            }
          } else {
            let LOAD = Loading.service({ fullscreen: true });
            let asyncres = await this.$store.dispatch(
              "createEditAdAsync",
              adoption[0]
            );
            LOAD.close();

            if (asyncres) {
              // 阻止离开页面事件触发
              this.ifEdit = false;
              this.hideBox();
            }
          }
          break;
      }
      /**
       * 编辑情况下，根据每条返回的结果，如果有错误信息，则提示详细错误情况
       * 创建情况下，失败则返回创建失败
       */
      if (!res) return;
      let errlist = res.data.filter(v => v.status == "failed");
      if (errlist.length == 0) {
        // 创建/编辑成功
        Msgsuccess(msg);
        // 阻止离开页面事件触发
        this.ifEdit = false;

        this.hideBox();
      } else if (this.editId && this.editId.length > 0) {
        // 编辑失败
        this.$alert(
          `${errlist
            .map(
              v =>
                `<b style="color: #409eff">${v[this.typeName]}</b> ${v.errMsg}`
            )
            .join("<br/>")}`,
          "错误信息",
          {
            confirmButtonText: "重新编辑",
            dangerouslyUseHTMLString: true,
            callback: () => {}
          }
        );
      } else {
        // 创建失败
        Msgerror(`创建失败：${errlist[0].errMsg}`);
      }
    },
    hideBox() {
      if (this.ifEdit) {
        this.$confirm("是否确定离开当前页面", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.status = false;
            this.reset();
          })
          .catch(() => {});
      } else {
        this.status = false;
        this.reset();
      }
    },
    reset() {
      this.breadcrumb = [];
      this.editId = [];
      this.editName = [];

      // 重置编辑信息列表
      this.SETSTATE({ k: "editcampaignlist", v: [] });
      this.SETSTATE({ k: "editadsetlist", v: [] });
      this.SETSTATE({ k: "editadlist", v: [] });
      this.SETSTATE({ k: "campaigncount", v: [] });

      // 重置各分组件状态
      this.$refs.createCampaign.reset();
      this.$refs.createAdset.reset();
      this.$refs.createAd.reset();
    },
    showBox({ type, id, name }) {
      this.status = true;

      this.type = type;
      this.editId = id ? id : [];
      if (name) this.editName = name;

      switch (this.type) {
        case "campaignName":
          this.typeName = "campaignId";
          // 区分创建与编辑
          if (this.editId && this.editId.length > 0) {
            // 初始化获取广告系列相关信息
            this.$store.dispatch("getCampaignInfo", {
              campaignId: this.editId
            });
            // 获取编辑数量
            this.$store.dispatch("calcuCount", {
              id: this.editId,
              type: "campaign"
            });
          } else {
            this.breadcrumb = [{ name: "创建广告系列", important: true }];
            // 初始化各组件状态
            this.$refs.createCampaign.initData();
          }
          break;
        case "adSetName":
          this.typeName = "adSetId";
          // 区分创建与编辑
          if (this.editId && this.editId.length > 0) {
            // 初始化获取广告组相关信息
            this.$store.dispatch("getAdsetInfo", {
              adsetId: this.editId,
              applicationid: this.actions
            });
            // 获取编辑数量
            this.$store.dispatch("calcuCount", {
              id: this.editId,
              type: "adset"
            });
          } else {
            this.breadcrumb = [{ name: "创建广告组", important: true }];
            // 初始化各组件状态
            this.$refs.createAdset.initData();
          }
          // 获取各种
          this.$store.dispatch("otherCountries");
          this.$store.dispatch("getLanguage");
          this.$store.dispatch("getInterests");
          this.$store.dispatch("getAdsetCreateApplist", {
            project_id: this.$route.params.id
          });
          this.$store.dispatch("getAdsetCreateAllpages");
          break;
        case "adName":
          this.typeName = "adId";
          // 区分创建与编辑
          if (this.editId && this.editId.length > 0) {
            // 初始化获取广告相关信息
            this.$store.dispatch("getAdInfo", {
              adId: this.editId
            });
            // 获取编辑数量
            this.$store.dispatch("calcuCount", {
              id: this.editId,
              type: "ad"
            });
            // 初始化各组件状态
            // this.$refs.createAd.initData('edit');
          } else {
            this.breadcrumb = [{ name: "创建广告", important: true }];
            // 初始化各组件状态
            this.$refs.createAd.initData();
          }
          // 如果是创建广告，初始化获取可选创意
          this.$store.dispatch("getSelectCreateList", {
            creativityType: 0,
            creativityName: "",
            classify: "",
            pageIndex: 1,
            projectId: this.$route.params.id
          });
          this.$store.dispatch("getClassify", this.$route.params.id);
          break;
      }
    },
    changeEdit(res) {
      this.ifEdit = res;
    }
  },
  computed: {
    ...mapState([
      "adcount",
      "adsetcount",
      "campaigncount",
      "editcampaignlist",
      "itemlist",
      "hascreatead"
    ]),
    actions() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id)
        .applicationId;
    }
  },
  watch: {
    campaigncount(n, o) {
      if (n > 0) {
        this.breadcrumb = [
          {
            name:
              this.campaigncount > 1
                ? `${this.campaigncount}个广告系列`
                : this.editName[0],
            important: this.type == "campaignName" ? true : false
          },
          {
            name:
              (this.type == "adSetName" || this.type == "adName") &&
              this.adsetcount == 1
                ? this.editName[1]
                : `${this.adsetcount}个广告组`,
            important: this.type == "adSetName" ? true : false
          },
          {
            name:
              this.type == "adName" && this.adcount == 1
                ? this.editName[2]
                : `${this.adcount}个广告`,
            important: this.type == "adName" ? true : false
          }
        ];
      }
    }
  }
};
</script>
<style lang="less">
.tabnav {
  display: flex;
  align-items: center;
  .el-breadcrumb__inner {
    max-width: 210px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
}
</style>

<style lang="less" scoped>
.cr-content {
  position: fixed;
  height: 100%;
  //   width: 700px;
  background-color: #fff;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  border-left: 20px solid #409eff;
  box-sizing: border-box;
  .title {
    padding: 25px 0;
    margin-bottom: 20px;
    flex-basis: 14px;
    border-bottom: 1px solid #e5e5e5;
  }
  .buttomctrl {
    height: 70px;
    border-top: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .infobox {
    flex-grow: 1;
    overflow-y: auto;
    position: relative;
    width: 650px;
    &.adsetbox {
      width: 800px;
    }
  }
}
.cr-shadow {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 29;
}
</style>

<style>
.create .slide-fade-enter-active,
.create .slide-fade-leave-active {
  transition: transform 0.5s;
}
.create .slide-fade-enter, .create .slide-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translate(120%, -50%);
}
/* .el-form-item__label {
  text-align: left;
} */
.cr-content .title .important .el-breadcrumb__inner {
  font-weight: bold;
}
</style>