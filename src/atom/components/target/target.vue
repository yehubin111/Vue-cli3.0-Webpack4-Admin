<template>
  <div class="plan">
    <p class="title">项目{{projectname}}&nbsp;&nbsp;>&nbsp;&nbsp;受众管理</p>
    <div class="ctrlbutton">
      <el-dropdown class="select" split-button type="primary" @command="handleCommand">
        创建受众
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="tocreate" command="a">自定义受众
          </el-dropdown-item>
          <el-dropdown-item class="tocreate" command="b">类似受众
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input class="search" v-model="state" placeholder="搜索受众名称" suffix-icon="el-icon-search" @input="targetSearch"></el-input>
      <el-select class="selectr" v-model="value" placeholder="类型" @change="toSort">
        <el-option v-for="(item, index) in targettype" :key="index" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="list" id="PlanList">
      <target-list @targetEdit="targetEdit" @likeEdit="likeEdit"></target-list>
    </div>
    <div class="pageswitch">
      <el-pagination background @size-change="pageSizeChange" :page-sizes="[20, 200, 500]" layout="total, sizes, prev, pager, next, jumper" :total="targettotal" :page-size="pagesize" @current-change="pageSwitch">
      </el-pagination>
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
        <!-- <div class="classify" @click="selectCustom(2)">
          <p class="ctitle">客户名单</p>
          <p class="ctip">来自AppsFlyer，可根据多应用多渠道创建受众</p>
        </div> -->
      </div>
    </el-dialog>
    <target-add :status="status" :editid="editid" @showResult="showResult" :customtype="customtype" @cancelAddbm="cancelAddbm"></target-add>
    <target-like :status="status2" :likeeditid="likeeditid" :liketype="liketype" @cancelAddbm="cancelAddbm" @showResult="showResult"></target-like>
    <target-result :status="status3" :newaccount="newaccount" @cancelAddbm="cancelAddbm"></target-result>
  </div>
</template>

<script>
import TargetList from "./target-list";
import TargetAdd from "./target-add";
import TargetLike from "./target-like";
import TargetResult from "./target-result";
import { mapState, mapMutations } from "vuex";
let targetsearch;
export default {
  components: {
    TargetList,
    TargetAdd,
    TargetLike,
    TargetResult
  },
  data() {
    return {
      liketype: 0,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      pagesize: 20,
      value: "",
      state: "",
      status: false,
      status2: false,
      status3: false,
      editid: "",
      likeeditid: "",
      liketype: "",
      customtype: '',
      // totalcount: 0,
      newaccount: [] // 编辑的时候新增的广告账户
    };
  },
  created() {
    let k = "tg_keyword";
    let v = "";

    this.SETSTATE({ k, v });

    k = "tg_audience_type";
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

    this.SETSTATE({ k, v });
    // express
    // this.$store.dispatch('expressLink');

    this.$store.dispatch("getTargetlist");

    this.$store.dispatch("otherCountries");
    this.$store.dispatch("getAllpages");

    // // 根据广告创建类似受众
    // this.$store.dispatch("getTargetPlan", {
    //   project_id: this.$route.params.id
    // });
  },
  computed: {
    ...mapState(["itemlist", "targettotal", "targettype"]),
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
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
    toSort() {
      let k = "tg_audience_type";
      let v = this.value == "-1" ? "" : this.value;
      this.SETSTATE({ k, v });

      k = "tg_pageIndex";
      v = 1;
      this.SETSTATE({ k, v });

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
.tocreate {
  display: block;
  padding: 0 20px;
  color: #333;
}
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
