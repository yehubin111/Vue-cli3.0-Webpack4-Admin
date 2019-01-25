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
    <el-form-item label="创意">
      <p v-if="mutil.type">
        <span v-show="mutilstatus.type">多项内容，
          <el-button type="text" @click="mutilstatus.type = !mutilstatus.type">编辑</el-button>
        </span>
        <span v-show="!mutilstatus.type">多项内容，已编辑，将替换旧创意，
          <el-button type="text" @click="mutilstatus.type = !mutilstatus.type">撤销编辑</el-button>
        </span>
      </p>
      <p v-if="isdynamic" class="dynamic">暂不支持动态创意</p>
      <el-radio-group v-model="form.type" v-show="!mutilstatus.type">
        <el-radio :label="0">单图片</el-radio>
        <el-radio :label="1">单视频</el-radio>
        <el-radio :label="2">轮播</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label v-show="!mutilstatus.type">
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
  </el-form>
</template>

<script>
import CreateList from "./ad-createlist";
import CreativityNormal from "./ad-creativitynormal";
import CreativityCarousel from "./ad-creativitycarousel";
import { mapState, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
import { Loading } from 'element-ui';

export default {
  props: ["editId"],
  components: {
    CreateList,
    CreativityNormal,
    CreativityCarousel
  },
  data() {
    return {
      editArray: [],
      createObject: null, // 创意
      fbAccountId: "",
      form: {
        adset: "",
        name: "",
        type: 0,
        activeName: "first",
        checkcreate: null
      },
      // createSpecial: "",
      mutilstatus: {},
      mutil: {
        adset: false,
        name: false,
        type: false
      }
    };
  },
  computed: {
    ...mapState(["createadsetlist", "setsortlist", "editadlist", "isdynamic", "adsetlistload"])
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
        this.SETSTATE({k:'adsetlistload',v: true});
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
      this.SETSTATE({ k: "isdynamic", v: false });
      // 轮播页面和单视频创意会因为类型重置而重置数据，所以只需要重置单图片创意页面
      if (this.form.type == 0) this.$refs.createNormal.reset();

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

      this.$refs.createList.reset();
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
      } else {
        // 多个未点开编辑
        return [true];
      }
    },
    setFbAccountId() {
      this.fbAccountId = this.form.adset.split("|")[1];
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
          creativeType: this.form.type,
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
    initData() {
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
        // 初始化获取广告系列列表
        this.$store.dispatch("getCreateAdsetlist", {
          keyword: this.setsortlist[0].adsetId,
          projectId: this.$route.params.id
        });
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

        this.form.adset =
          [...new Set(n.map(v => v.adsetId))].length > 1
            ? ""
            : n[0].adsetId + "|act_" + n[0].accountId;
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

        if (this.form.adset) {
          // 初始化获取广告系列列表
          this.$store.dispatch("getCreateAdsetlist", {
            keyword: n[0].adsetId,
            projectId: this.$route.params.id
          });
        }
        // 判断是否动态创意
        let creativearr = n.map(v => v.creativeId);
        let creativeids = [...new Set(creativearr)].join(",");
        this.$store.dispatch("isDynamicCreate", creativeids);
        /**
         * 如果所编辑的广告只有相同的一个创意（包含单个广告和多个创意相同的广告两种情况）
         * 则需要获取该创意详情，用于展示
         * 否则不需要，因为多个不同的创意不需要展示，也无法提交
         */
        if (creativearr.length == 1) {
          let LOAD = Loading.service({ fullscreen: true });
          let res = await this.$store.dispatch("creativeDetail", {
            creativeId: creativeids
          });
          LOAD.close();

          this.createObject = res.data[0];
          if (this.createObject.cards) {
            this.form.type = 2;
          } else if (this.createObject.videoId) {
            this.form.type = 1;
          } else {
            this.form.type = 0;
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
