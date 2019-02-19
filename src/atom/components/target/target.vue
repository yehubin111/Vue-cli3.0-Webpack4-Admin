<template>
  <div class="plan">
    <p class="title">项目{{projectname}}&nbsp;&nbsp;>&nbsp;&nbsp;受众管理</p>
    <div class="ctrlbutton">
      <el-select
        class="selectl"
        v-model="adaccounts"
        collapse-tags
        filterable
        multiple
        placeholder="请选择广告账户，支持名称/编号搜索"
        @change="toSetAccount"
      >
        <el-option
          v-for="(item, index) in adaccountlist"
          :key="index"
          :label="item.name + (item.fbId?'('+item.fbId+')':'')"
          :value="item.fbId"
        ></el-option>
      </el-select>
    </div>
    <div class="ctrlbutton">
      <el-dropdown class="select" split-button type="primary" @command="handleCommand">创建
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="tocreate" command="a">自定义受众</el-dropdown-item>
          <el-dropdown-item class="tocreate" command="b">类似受众</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="select" split-button type="primary" @command="handleCommandMutil">批量
        <el-dropdown-menu slot="dropdown">
          <el-tooltip
            class="item"
            effect="dark"
            :disabled="!ifdeletetip"
            content="一个或多个受众已被用于创建类似受众，请先删除类似受众"
            placement="right"
          >
            <span>
              <el-dropdown-item
                class="tocreate"
                command="a"
                :disabled="selectlist.length == 0 || ifdeletetip"
              >删除</el-dropdown-item>
            </span>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            :disabled="!ifsharetip"
            content="一个或多个受众是他人与你共享的受众，不可再次共享"
            placement="right"
          >
            <span>
              <el-dropdown-item
                class="tocreate"
                command="b"
                :disabled="selectlist.length == 0 || ifsharetip"
              >共享</el-dropdown-item>
            </span>
          </el-tooltip>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input
        class="search"
        v-model="state"
        placeholder="搜索受众编号/名称"
        suffix-icon="el-icon-search"
        @input="targetSearch"
      ></el-input>
      <el-select class="selectr" v-model="value" placeholder="类型" @change="toSort">
        <el-option
          v-for="(item, index) in targettype"
          :key="index"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="list" id="PlanList">
      <target-list
        @targetEdit="targetEdit"
        @likeEdit="likeEdit"
        @specialEdit="specialEdit"
        @toDelete="toDelete"
        @toShare="toShare"
        @listSelect="listSelect"
      ></target-list>
    </div>
    <div class="pageswitch">
      <el-pagination
        background
        @size-change="pageSizeChange"
        :page-sizes="[20, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="targettotal"
        :page-size="pagesize"
        @current-change="pageSwitch"
      ></el-pagination>
    </div>
    <el-dialog title="创建类似受众" :visible.sync="dialogFormVisible" class="dialog">
      <div class="likeclassify">
        <div class="classify" @click="selectLike(1)">
          <p class="ctitle">根据自定义受众</p>
          <p class="ctip">把自定义受众里的用户作为来源</p>
        </div>
        <div class="classify" @click="selectLike(2)">
          <p class="ctitle">根据广告</p>
          <p class="ctip">广告系列或广告组触达用户作为来源</p>
        </div>
        <div class="classify" @click="selectLike(3)">
          <p class="ctitle">根据主页粉丝</p>
          <p class="ctip">把关注主页的粉丝作为来源</p>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="创建自定义受众" :visible.sync="dialogFormVisible2" class="dialog">
      <div class="likeclassify">
        <div class="classify" @click="selectCustom(1)">
          <p class="ctitle">应用事件</p>
          <p class="ctip">来自Facebook，只根据单一应用创建受众</p>
        </div>
      </div>
    </el-dialog>
    <target-add
      :status="status"
      :editid="editid"
      @showResult="showResult"
      :customtype="customtype"
      @cancelAddbm="cancelAddbm"
    ></target-add>
    <target-like
      :status="status2"
      :likeeditid="likeeditid"
      :liketype="liketype"
      @cancelAddbm="cancelAddbm"
      @showResult="showResult"
    ></target-like>
    <!-- <target-result :status="status3" :newaccount="newaccount" @cancelAddbm="cancelAddbm"></target-result> -->
    <target-delete :status.sync="deletestatus" :deleteids="deleteids" @hideBox="hideDeletebox"></target-delete>
    <target-share :status.sync="sharestatus" :shareids="shareids" @hideBox="hideSharebox"></target-share>
    <target-special :status.sync="specialstatus" :editid="specialeditid" @hideBox="hideSpecialbox"></target-special>
  </div>
</template>

<script>
import TargetShare from "./target-share";
import TargetDelete from "./target-delete";
import TargetList from "./target-list";
import TargetAdd from "./target-add";
import TargetLike from "./target-newlike";
import TargetSpecial from "./target-special";
// import TargetResult from "./target-result";
import { mapState, mapMutations } from "vuex";
let targetsearch;
export default {
  components: {
    TargetList,
    TargetAdd,
    TargetLike,
    // TargetResult,
    TargetDelete,
    TargetShare,
    TargetSpecial
  },
  data() {
    return {
      liketype: 0,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      deletestatus: false,
      specialstatus: false,
      deleteids: [], // 删除ids
      ifdeletetip: false, // 是否显示无法删除提醒文字
      sharestatus: false,
      shareids: [], // 共享ids
      ifsharetip: false, // 是否显示无法共享的提醒文字
      selectlist: [], // 已选受众列表
      pagesize: 20,
      adaccounts: [],
      value: "",
      state: "",
      status: false,
      status2: false,
      status3: false,
      editid: "",
      specialeditid: "",
      likeeditid: "",
      liketype: "",
      customtype: "",
      // totalcount: 0,
      newaccount: [] // 编辑的时候新增的广告账户
    };
  },
  created() {
    let k = "tg_keyword";
    let v = "";

    this.SETSTATE({ k, v });

    k = "tg_type";
    v = "";

    this.SETSTATE({ k, v });

    k = "tg_pageSize";
    v = 20;

    this.SETSTATE({ k, v });

    k = "tg_pageIndex";
    v = 1;

    this.SETSTATE({ k, v });
  },
  mounted() {
    let k = "tg_project_id";
    let v = this.$route.params.id;

    this.SETSTATE({ k: "tg_projectId", v });
    // express
    // this.$store.dispatch('expressLink');

    this.$store.dispatch("getTargetlist");

    this.$store.dispatch("otherCountries");
    this.$store.dispatch("getAllpages");
    // 获取广告账户
    this.$store.dispatch("getAdaccount", v);
  },
  computed: {
    ...mapState(["itemlist", "targettotal", "targettype", "adaccountlist"]),
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    specialEdit(id) {
      this.specialeditid = id;
      this.specialstatus = true;
    },
    hideSpecialbox() {
      this.specialstatus = false;
    },
    handleCommandMutil(command) {
      let ids = this.selectlist.map(v => v.id);
      // 批量新增为特殊情况
      switch (command) {
        case "a":
          this.toDelete(ids);
          break;
        case "b":
          this.toShare(ids);
          break;
      }
    },
    listSelect(list) {
      this.selectlist = list;
      this.ifdeletetip = list.find(v => v.lookalikeAudienceIds) ? true : false;
      this.ifsharetip = list.find(
        v => v.ownAccountId.split("_")[1] != v.accountId
      )
        ? true
        : false;
    },
    hideSharebox() {
      this.sharestatus = false;
    },
    showSharebox() {
      this.sharestatus = true;
    },
    toShare(ids) {
      this.shareids = ids.slice(0);
      this.showSharebox();
    },
    toDelete(ids) {
      this.deleteids = ids.slice(0);
      this.showDeletebox();
    },
    hideDeletebox() {
      this.deletestatus = false;
    },
    showDeletebox() {
      this.deletestatus = true;
    },
    showResult(account) {
      this.status3 = true;
      // this.totalcount = total;
      this.newaccount = account;
    },
    likeEdit(id, ltype) {
      this.likeeditid = id;
      this.status2 = true;
      this.liketype = ltype;
    },
    targetEdit(id) {
      this.editid = id;
      this.status = true;
    },
    selectCustom(key) {
      this.customtype = key;
      this.status = true;
      this.dialogFormVisible2 = false;
    },
    selectLike(key) {
      this.liketype = key;
      this.status2 = true;
      this.dialogFormVisible = false;
    },
    cancelAddbm(key) {
      this[key] = false;
      if (key == "status") {
        this.editid = "";
      }
      if (key == "status2") {
        this.likeeditid = "";
      }
    },
    handleCommand(command) {
      // 批量新增为特殊情况
      switch (command) {
        case "a":
          this.dialogFormVisible2 = true;
          break;
        case "b":
          this.dialogFormVisible = true;
          break;
      }
    },
    pageSwitch(idx) {
      let k = "tg_pageIndex";
      let v = idx;

      this.SETSTATE({ k, v });

      this.getData();
    },
    targetSearch() {
      let k = "tg_keyword";
      let v = this.state;
      let self = this;
      this.SETSTATE({ k, v });

      k = "tg_pageIndex";
      v = 1;
      this.SETSTATE({ k, v });

      clearTimeout(targetsearch);
      targetsearch = setTimeout(() => {
        self.getData();
      }, 300);
    },
    getData() {
      this.$store.dispatch("getTargetlist");
    },
    toSetAccount() {
      this.SETSTATE({
        k: "tg_adaccounts",
        v: this.adaccounts.map(v => `act_${v}`).join(",")
      });
      this.SETSTATE({ k: "tg_pageIndex", v: 1 });
      this.getData();
    },
    toSort() {
      this.SETSTATE({ k: "tg_type", v: this.value == "-1" ? "" : this.value });
      this.SETSTATE({ k: "tg_pageIndex", v: 1 });

      this.getData();
    },
    pageSizeChange(size) {
      this.pagesize = size;
      let k = "tg_pageSize";
      let v = size;
      this.SETSTATE({ k, v });

      k = "tg_pageIndex";
      v = 1;
      this.SETSTATE({ k, v });

      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
.createdialog {
}
.likeclassify {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 30px;
  .classify {
    width: 180px;
    padding: 5px 10px 15px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin: 0 10px;
    cursor: pointer;
    .ctitle {
      font-size: 18px;
      line-height: 44px;
    }
    .ctip {
    }
    &:hover {
      border-color: #409eff;
      .ctitle {
        color: #409eff;
      }
      .ctip {
        color: #409eff;
      }
    }
  }
}
// .tocreate {
//   display: block;
//   padding: 0 20px;
//   color: #333;
// }
.plan {
  flex-grow: 1;
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
    margin-left: 40px;
    .back {
      color: #333;
    }
  }
  .ctrlbutton {
    margin-left: 40px;
    overflow: hidden;
    margin-bottom: 10px;
    .select {
      float: left;
      margin-right: 20px;
    }
    .selectl {
      float: left;
      width: 400px;
    }
    .search {
      float: right;
      width: 250px;
      margin-left: 20px;
    }
    .selectr {
      width: 150px;
      margin-left: 20px;
      float: right;
    }
  }
  .list {
    margin-left: 40px;
    min-height: 400px;
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 50px;
  }
}
</style>
