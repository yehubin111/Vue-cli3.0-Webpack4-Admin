<template>
  <el-form class="form" :model="form" label-width="110px" label-position="left">
    <el-form-item label="当前广告组">
      <p v-if="mutil.adset">多项内容</p>
      <el-select
        class="formselect"
        v-model="form.adset"
        v-show="!mutil.adset"
        :disabled="editId.length > 0"
        filterable
        remote
        :remote-method="remoteMethod"
        placeholder="请选择广告组"
        @change="setFbAccountId"
        :loading="adsetlistload"
        loading-text="加载中..."
      >
        <el-option
          v-for="item in createadsetlist"
          :key="item.adSetId"
          :label="item.adSetName+'('+item.adSetId+')'"
          :value="item.adSetId + '|' + item.fbAccountId"
        ></el-option>
      </el-select>
      <p class="wrongti" v-show="hascreatead">广告组不可用，此动态创意广告组已有广告</p>
    </el-form-item>
    <el-form-item label="广告编号" v-if="editId.length > 0">
      <span class="adnum" id="copyAd">{{editId.length > 1? '多项内容': editId[0]}}</span>
      <el-button
        id="copyButtonAd"
        data-clipboard-action="copy"
        data-clipboard-target="#copyAd"
        type="primary"
        size="mini"
        v-show="editId.length == 1"
      >复制</el-button>
    </el-form-item>
    <el-form-item label="广告名称">
      <p v-if="mutil.name">
        <span v-show="mutilstatus.name">多项内容，
          <el-button type="text" @click="mutilstatus.name = !mutilstatus.name">编辑</el-button>
        </span>
        <span v-show="!mutilstatus.name">多项内容，已编辑，
          <el-button type="text" @click="mutilstatus.name = !mutilstatus.name">撤销编辑</el-button>
        </span>
      </p>
      <el-input
        class="forminput"
        v-model="form.name"
        placeholder="请输入广告名称"
        v-show="!mutilstatus.name"
      ></el-input>
    </el-form-item>
    <!--动态创意-->
    <el-form-item label="创意" v-if="isactive">
      <p v-if="mutil.type">
        <span v-show="mutilstatus.type">
          多项内容，{{activespecial? '不可同时编辑普通创意和动态创意':''}}
          <el-button
            type="text"
            v-show="!activespecial"
            @click="mutilstatus.type = !mutilstatus.type"
          >编辑</el-button>
        </span>
        <span v-show="!mutilstatus.type">多项内容，已编辑，将替换旧创意，
          <el-button type="text" @click="mutilstatus.type = !mutilstatus.type">撤销编辑</el-button>
        </span>
      </p>
      <el-radio-group v-model="form.type" v-show="!mutilstatus.type">
        <el-radio :label="0">图片或视频</el-radio>
        <el-radio :label="1">轮播图片</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label v-if="isactive" v-show="!mutilstatus.type">
      <el-tabs v-model="form.activeName" class="cardtab" type="card" @tab-click="handleClick">
        <el-tab-pane :label="'创建创意'" name="first">
          <active-create :createType="form.type" :createObject="createObject" ref="activeCreate"></active-create>
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
    <!--动态创意-->
    <!--普通创意-->
    <el-form-item label="创意" v-if="!isactive">
      <p v-if="mutil.type">
        <span v-show="mutilstatus.type">多项内容，
          <el-button type="text" @click="mutilstatus.type = !mutilstatus.type">编辑</el-button>
        </span>
        <span v-show="!mutilstatus.type">多项内容，已编辑，将替换旧创意，
          <el-button type="text" @click="mutilstatus.type = !mutilstatus.type">撤销编辑</el-button>
        </span>
      </p>
      <el-radio-group v-model="form.type" v-show="!mutilstatus.type">
        <el-radio :label="0">单图片</el-radio>
        <el-radio :label="1">单视频</el-radio>
        <el-radio :label="2">轮播</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label v-if="!isactive" v-show="!mutilstatus.type">
      <el-tabs v-model="form.activeName" class="cardtab" type="card" @tab-click="handleClick">
        <el-tab-pane :label="editId.length > 0?'编辑创意':'创建创意'" name="first">
          <creativity-carousel
            ref="createCarousel"
            v-if="form.type == 2"
            :createObject="createObject"
            @changeEdit="changeEdit"
          ></creativity-carousel>
          <creativity-normal
            ref="createNormal"
            v-else
            :createType="form.type"
            :createObject="createObject"
            @changeEdit="changeEdit"
          ></creativity-normal>
        </el-tab-pane>
        <el-tab-pane label="选择创意" name="second">
          <div class="createlist">
            <create-list ref="createList" :creativeType="form.type" @selectCreate="selectCreate"></create-list>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form-item>
    <!--普通创意-->
  </el-form>
</template>

<script>
import CreateList from "./ad-createlist";
import CreativityNormal from "./ad-creativitynormal";
import CreativityCarousel from "./ad-creativitycarousel";
import ActiveCreate from "./ad-activecreate";
import { mapState, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
import { Loading } from "element-ui";

export default {
  props: ["editId"],
  components: {
    CreateList,
    CreativityNormal,
    CreativityCarousel,
    ActiveCreate
  },
  data() {
    return {
      editArray: [],
      createObject: null, // 创意
      fbAccountId: "",
      isactive: false, // 是否为动态创意广告
      activespecial: false, // 同时编辑动态创意广告和非动态创意广告
      form: {
        adset: "",
        name: "",
        type: 0,
        activeName: "first",
        checkcreate: null
      },
      mutilstatus: {},
      mutil: {
        adset: false,
        name: false,
        type: false
      }
    };
  },
  computed: {
    ...mapState([
      "createadsetlist",
      "setsortlist",
      "editadlist",
      "adsetlistload",
      "hascreatead"
    ])
  },
  mounted() {
    // 新建编辑实例，绑定到操作按钮上
    this.$textCopy("#copyButtonAd");

    // 新增创意用
    this.$store.dispatch("getAllpages");
    this.$store.dispatch("getAllactions");
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    selectCreate(create) {
      // console.log(create);
      this.form.checkcreate = create ? create.id : null;
    },
    remoteMethod(query) {
      if (query !== "") {
        this.SETSTATE({ k: "adsetlistload", v: true });
        this.$store.dispatch("getCreateAdsetlist", {
          keyword: query,
          projectId: this.$route.params.id
        });
      } else {
        this.SETSTATE({ k: "createadsetlist", v: [] });
      }
    },
    reset() {
      this.SETSTATE({ k: "createadsetlist", v: [] });
      this.SETSTATE({ k: "hascreatead", v: false });
      // 轮播页面和单视频创意会因为类型重置而重置数据，所以只需要重置单图片创意页面
      if (this.isactive) {
        if (this.form.type == 0) this.$refs.activeCreate.reset();
      } else {
        if (this.form.type == 0) this.$refs.createNormal.reset();
        this.$refs.createList.reset();
      }

      this.editArray = [];
      this.fbAccountId = "";
      this.form = {
        adset: "",
        name: "",
        type: 0,
        activeName: "first",
        checkcreate: null
      };
      this.createObject = null;
      // this.createSpecial = "";
      this.mutilstatus = {};
      this.mutil = {
        adset: false,
        name: false,
        type: false
      };
      this.isactive = false;
      this.activespecial = false;
    },
    dataChecked() {
      if (!this.form.adset && !this.mutilstatus.adset) {
        return [false, "请选择广告组"];
      }
      if (!this.form.name.trim() && !this.mutilstatus.name) {
        return [false, "请输入广告名称"];
      }
      return [true];
    },
    createChecked() {
      /**
       * 区分创建/编辑创意和选择创意
       */
      if (!this.mutilstatus.type) {
        // 单个或者多个点开编辑
        // 区分是否是动态创意
        if (this.isactive) {
          return this.$refs.activeCreate.getCheckData();
        } else {
          if (this.form.activeName == "first") {
            if (this.form.type == 2) {
              return this.$refs.createCarousel.getCheckData();
            } else {
              return this.$refs.createNormal.getCheckData();
            }
          } else {
            if (!this.form.checkcreate) return [false, "请选择创意"];
            else return [true];
          }
        }
      } else {
        // 多个未点开编辑
        return [true];
      }
    },
    setFbAccountId() {
      this.fbAccountId = this.form.adset.split("|")[1];
      /**
       * 20190129新增
       * 选择广告组之后，如果为动态创意广告组，则去判断是否包含广告
       */
      this.adsetIfdynamicCreative();

      this.form.type = 0;
    },
    adsetIfdynamicCreative() {
      let adset = this.createadsetlist.find(
        v => v.adSetId == this.form.adset.split("|")[0]
      );

      this.isactive = adset.isDynamicCreative;
      if (adset.isDynamicCreative) {
        this.$store.dispatch("isActiveAd", adset.adSetId);
      }
    },
    extractInfo() {
      let msg = "";
      let check = this.dataChecked();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }
      let createcheck = this.createChecked();
      let createdata;
      if (!createcheck[0]) {
        Msgwarning(createcheck[1]);
        return;
      } else {
        createdata = createcheck[1];
      }
      /**
       * 组合数据
       * 如果是多项已编辑状态，或者单项情况，则获取form中已编辑数据
       * 如果是多项未编辑状态，则获取各自原始数据
       * 20180116新增，如果createdata存在，则表示是通过创建创意创建/编辑广告
       */

      if (createdata) {
        createdata.fbAccountId = this.fbAccountId;
        let cobj = {
          adName: this.mutilstatus.name ? null : this.form.name,
          creativeVO: createdata,
          creativeType: this.isactive ? "3" : this.form.type,
          projectId: this.$route.params.id
        };
        if (this.editArray.length > 0) {
          cobj.adIds = this.editArray.map(v => v.adId);
          cobj.adSetId = null;
        } else {
          cobj.adIds = [];
          cobj.adSetId = this.form.adset.split("|")[0];
        }
        return [cobj, "create"];
      } else {
        if (this.editArray.length > 0) {
          let opt = [];
          this.editArray.forEach(v => {
            let obj = {};
            obj.adId = v.adId;
            obj.fbCreativeId = this.mutilstatus.type ? v.creativeId : null;
            obj.adName = this.mutilstatus.name ? v.name : this.form.name;
            obj.creativeId = this.mutilstatus.type
              ? null
              : this.form.checkcreate;
            obj.adSetId = this.mutilstatus.adset
              ? v.adsetId
              : this.form.adset.split("|")[0];

            opt.push(obj);
          });

          return [opt, "select"];
        } else {
          let option = {
            adId: null,
            fbCreativeId: null,
            adName: this.form.name,
            creativeId: this.form.checkcreate,
            adSetId: this.form.adset.split("|")[0]
          };
          return [[option], "select"];
        }
      }
    },
    async initData() {
      /**
       * 创建初始化获取已选广告组
       * 如果已选多个，则显示为空，当前只能单选
       * 如果只选了一个，则默认当前选择广告组
       */
      if (this.setsortlist.length > 1) {
        this.form.adset = "";
      } else {
        this.form.adset =
          this.setsortlist.length == 0
            ? ""
            : this.setsortlist[0].adsetId +
              "|act_" +
              this.setsortlist[0].accountId;
      }
      if (this.form.adset) {
        this.fbAccountId = this.form.adset.split("|")[1];
        // 初始化获取广告组列表
        await this.$store.dispatch("getCreateAdsetlist", {
          keyword: this.setsortlist[0].adsetId,
          projectId: this.$route.params.id
        });
        /**
         * 20190129新增
         * 初始化判断当前广告组是否允许创建广告
         * 选择广告组之后，如果为动态创意广告组，则去判断是否包含广告
         */
        this.adsetIfdynamicCreative();
      }
      this.$refs.createNormal.initData();
      // 初始化重置是否已改动状态
      setTimeout(() => {
        this.$emit("changeEdit", false);
      }, 100);
    },
    changeEdit(vl) {
      this.$emit("changeEdit", vl);
    },
    handleClick() {}
  },
  watch: {
    async editadlist(n, o) {
      // console.log(n);
      if (n.length > 0) {
        // 保存原始编辑数据
        this.editArray = n;
        //当前广告账户
        this.fbAccountId = "act_" + n[0].accountId;

        let adsetId = [...new Set(n.map(v => v.adsetId))];
        this.form.adset =
          adsetId.length > 1 ? "" : n[0].adsetId + "|act_" + n[0].accountId;
        this.form.name =
          [...new Set(n.map(v => v.name))].length > 1 ? "" : n[0].name;

        // 创意编辑特殊情况
        // this.createSpecial = n.length > 1 ? "多项" : "";
        this.mutil = {
          adset: !this.form.adset ? true : false,
          name: !this.form.name ? true : false,
          type: n.length > 1 ? true : false
        };

        this.mutilstatus = Object.assign({}, this.mutil);

        if (n.length == 1) {
          this.$store.dispatch("getCreateAdsetlist", {
            keyword: n[0].adsetId,
            projectId: this.$route.params.id
          });
        }

        let creativearr = n.map(v => v.creativeId);
        let creativeids = [...new Set(creativearr)].join(",");
        // this.$store.dispatch("isDynamicCreate", creativeids);

        let LOAD = Loading.service({ fullscreen: true });
        let res = await this.$store.dispatch("creativeDetail", {
          creativeId: creativeids
        });
        LOAD.close();

        /**
         * 20190220新增，初始化判断广告创意类型
         * @case1 多个动态+普通创意情况
         * @case2 单个动态创意情况 or 多个动态创意情况
         * @case2 单个普通创意情况 or 多个普通创意情况
         */
        let activecreateArr = res.data.find(v => v.assetFeedSpec);
        let normalArr = res.data.find(v => !v.assetFeedSpec);

        // let adsetArr = adsetId.map(g => {
        //   let adset = this.createadsetlist.find(v => v.adSetId == g);
        //   return adset ? adset.isDynamicCreative : "";
        // });
        // console.log(adsetArr);
        // adsetArr = [...new Set(adsetArr)];
        switch (true) {
          case Boolean(activecreateArr) && Boolean(normalArr):
            this.isactive = true;
            this.activespecial = true;
            break;
          case Boolean(activecreateArr):
            this.isactive = true;
            break;
          default:
            this.isactive = false;
            break;
        }
        /** end */

        /**
         * 如果所编辑的广告只有相同的一个创意（包含单个广告和多个创意相同的广告两种情况）
         * 则需要获取该创意详情，用于展示
         * 否则不需要，因为多个不同的创意不需要展示，也无法提交
         */
        if (creativearr.length == 1) {
          this.createObject = res.data[0];
          /**
           * 20190219新增，动态创意判断依据
           * 有assetFeedSpec的为动态创意
           */
          if (
            this.createObject.assetFeedSpec &&
            this.createObject.assetFeedSpec != "null"
          ) {
            // 动态创意
            let activecreate = JSON.parse(this.createObject.assetFeedSpec);
            switch (activecreate.ad_formats[0]) {
              case "AUTOMATIC_FORMAT":
                this.form.type = 0;
                break;
              case "CAROUSEL_IMAGE":
                this.form.type = 1;
                break;
            }
          } else {
            // 普通创意
            if (this.createObject.cards) {
              this.form.type = 2;
            } else if (this.createObject.videoId) {
              this.form.type = 1;
            } else {
              this.form.type = 0;
            }
          }
        }

        // 初始化重置是否已改动状态
        setTimeout(() => {
          this.$emit("changeEdit", false);
        }, 200);
      }
    },
    "form.adset": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.name": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.type": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.checkcreate": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    }
  }
};
</script>
<style lang="less">
.dynamic {
  color: red;
}
.fileinput {
  position: absolute;
  left: 0;
  top: 4px;
  width: 80px;
  height: 32px;
  // cursor: pointer;
  input[name="file"] {
    width: 80px;
    height: 32px;
    background-color: #000;
    position: absolute;
    top: 0;
    opacity: 0;
    // cursor: pointer;
  }
}
.uploadFmbox {
  position: absolute;
  left: 160px;
  top: 16px;
  width: 80px;
  height: 16px;
}
.fileinputfm {
  width: 80px;
  height: 16px;
  display: block;
  // cursor: pointer;
  input[name="file"] {
    width: 80px;
    height: 16px;
    background-color: #000;
    position: absolute;
    top: 0;
    opacity: 0;
    // cursor: pointer;
  }
}
.adnum {
  margin-right: 10px;
}
</style>

<style lang="less" scoped>
.form {
  width: 100%;
  .wrongti {
    color: red;
  }
  .formselect {
    width: 360px;
  }
  .forminput {
    width: 360px;
  }
  .moneyinput {
    position: relative;
    overflow: hidden;
    .moneyus {
      position: absolute;
      z-index: 9;
      left: 8px;
      font-size: 18px;
    }
    .minput {
      // width: 200px;
    }
  }
}
.cardtab {
  padding-right: 20px;
  .createlist {
    // height: 534px;
    width: 100%;
    box-sizing: border-box;
    // overflow-y: auto;
    .checkline {
      display: block;
      margin-left: 0;
    }
  }
}
</style>
