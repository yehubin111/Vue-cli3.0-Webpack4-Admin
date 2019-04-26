<template>
  <div class="contain">
    <p class="title">
      <router-link to="/manage" class="back">管理项目</router-link>&nbsp;&nbsp;>&nbsp;&nbsp;已归档项目</p>
    <div class="list">
      <div class="right">
        <div class="ctrl">
          <el-input class="search2" v-model="state4" placeholder="搜索项目ID/名称" suffix-icon="el-icon-search" @input="projectSearch"></el-input>
        </div>
        <notmanage-list @beginProject="beginProject"></notmanage-list>
        <manage-begin :id="beginid" :status="status2" @cancelAddbm="cancelAddbm"></manage-begin>
        <div class="pageswitch">
          <el-pagination background @size-change="pageSizeChange" :page-sizes="[20, 200, 500]" layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="pagesize" @current-change="pageSwitch">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ManageBegin from "./notmanage-begin";
import NotmanageList from "./notmanage-list";
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  components: {
    NotmanageList,
    ManageBegin
  },
  data() {
    return {
      size: 20,
      status: false,
      status2: "",
      state4: "",
      beginid: ""
    };
  },
  computed: {
    ...mapGetters(["dismanage"]),
    ...mapState(["total", "pagesize"])
  },
  mounted() {
    this.SETSTATE({k: 'managelist', v: []});
  },
  watch: {},
  methods: {
    ...mapMutations(["SETSTATE"]),
    pageSizeChange(size) {
      let pageSize = size;
      this.size = size;
      let status = 0;
      this.$store.dispatch("getManageOffList", { pageSize, status });
    },
    pageSwitch(page) {
      let pageIndex = page;
      let pageSize = this.size;
      let status = 0;
      this.$store.dispatch("getManageOffList", { pageIndex, pageSize, status });
    },
    projectSearch() {
      let v = this.state4;
      let k = "projectkwd";
      let status = 0;

      this.SETSTATE({ k, v });
      let pageSize = this.size;
      this.$store.dispatch("getManageOffList", { pageSize, status });
    },
    cancelAddbm(k) {
      this[k] = false;
      // this.editid = "";
    },
    beginProject(id) {
      this.status2 = true;
      this.beginid = id;
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
    .back {
      color: #333;
    }
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
        margin-bottom: 10px;
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
