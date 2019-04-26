<template>
  <div class="contain">
    <p class="title">管理项目</p>
    <div class="list">
      <div class="right">
        <div class="ctrl">
          <el-button class="add" type="primary" @click="status = true">创建项目</el-button>
          <router-link class="cantmanage" to="/notmanage">已归档项目</router-link>
          <el-input
            class="search"
            v-model="state4"
            placeholder="搜索项目ID/名称"
            suffix-icon="el-icon-search"
            @input="projectSearch"
          ></el-input>
        </div>
        <manage-list :allotStatus.sync="allotstatus" @editProject="editProject" @overProject="overProject" @deleteProject="deleteProject"></manage-list>
        <manage-over :id="overid" :status.sync="status2" @cancelAddbm="cancelAddbm" @resetList="resetList"></manage-over>
        <manage-delete :id="deleteid" :status.sync="status3" @cancelAddbm="cancelAddbm" @resetList="resetList"></manage-delete>
        <div class="pageswitch">
          <el-pagination
            background
            @size-change="pageSizeChange"
            :page-sizes="[20, 200, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-size="pagesize"
            :current-page.sync="pageindex"
            @current-change="pageSwitch"
          ></el-pagination>
        </div>
      </div>
    </div>
    <manage-add :status.sync="status" :allotStatus.sync="allotstatus" :id.sync="editid"></manage-add>
    <allot-account :status.sync="status" :allotStatus.sync="allotstatus" @resetList="resetList"></allot-account>
  </div>
</template>

<script>
import ManageList from "./manage-list";
import ManageAdd from "./manage-add";
import ManageOver from "./manage-over";
import ManageDelete from './manage-delete';
import AllotAccount from "./manage-allotaccount";
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  components: {
    ManageList,
    ManageAdd,
    ManageOver,
    AllotAccount,
    ManageDelete
  },
  data() {
    return {
      pageindex: 1,
      size: 20,
      status: false,
      status2: false,
      status3: false,
      allotstatus: false,
      state4: "",
      editid: "",
      overid: "",
      deleteid: ''
    };
  },
  computed: {
    ...mapGetters(["dismanage"]),
    ...mapState(["total", "pagesize"])
  },
  created() {},
  mounted() {
    this.SETSTATE({ k: "managelist", v: [] });
    this.getData();
  },
  watch: {},
  methods: {
    ...mapMutations(["SETSTATE"]),
    resetList() {
      this.pageindex = 1;
      this.getData();
      // 重新获取头部项目列表
      this.$store.dispatch("getItemList");
    },
    pageSizeChange(size) {
      this.pageindex = 1;
      this.size = size;
      this.getData();
    },
    pageSwitch(page) {
      this.pageindex = page;
      this.getData();
    },
    getData() {
      let pageIndex = this.pageindex;
      let pageSize = this.size;
      this.$store.dispatch("getManagelist", { pageIndex, pageSize });
    },
    projectSearch() {
      this.SETSTATE({ k: "projectkwd", v: this.state4 });
      this.pageindex = 1;
      this.getData();
    },
    cancelAddbm(k) {
      this[k] = false;
    },
    editProject(id) {
      this.status = true;
      this.editid = id;
    },
    overProject(id) {
      this.status2 = true;
      this.overid = id;
    },
    deleteProject(id) {
      this.status3 = true;
      this.deleteid = id;
    }
  }
};
</script>

<style lang="less" scoped>
.contain {
  width: 1200px;
  margin: 0 auto 50px auto;
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
  }
  .nav {
    position: relative;
    .addBM {
      position: absolute;
      right: 0;
      bottom: 15px;
    }
  }
  .el-menu-demo {
    margin-bottom: 20px;
  }
  .list {
    display: flex;
    .leftnav {
      flex-basis: 60px;
      border-right: 1px solid #e6e6e6;
      margin-right: 20px;
      p {
        width: 60px;
        line-height: 40px;
        padding: 10px 60px 10px 20px;
        font-size: 14px;
        cursor: pointer;
        &.on {
          color: #3297ff;
          font-weight: bold;
        }
      }
    }
    .right {
      flex-grow: 1;
      float: left;
      .ctrl {
        overflow: hidden;
        margin-bottom: 20px;
        .add {
          float: left;
        }
        .cantmanage {
          line-height: 40px;
          color: #409eff;
          margin-left: 20px;
          padding: 0 10px;
          font-size: 14px;
        }
        .search {
          float: right;
          width: 250px;
        }
        .search2 {
          width: 250px;
        }
      }
      .pageswitch {
        text-align: center;
        margin-top: 20px;
      }
    }
  }
  .nobm {
    text-align: center;
    margin-top: 100px;
    .info {
      font-size: 16px;
      left: 40px;
    }
    .addBM2 {
      padding: 10px 40px;
      margin-top: 15px;
      border-radius: 18px;
      font-size: 14px;
    }
  }
}
</style>
