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
        <manage-list @editProject="editProject" @overProject="overProject"></manage-list>
        <manage-over :id="overid" :status="status2" @cancelAddbm="cancelAddbm"></manage-over>
        <div class="pageswitch">
          <el-pagination
            background
            @size-change="pageSizeChange"
            :page-sizes="[20, 200, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-size="pagesize"
            @current-change="pageSwitch"
          ></el-pagination>
        </div>
      </div>
    </div>
    <manage-add :status="status" :title="title" :id="editid" @cancelAddbm="cancelAddbm"></manage-add>
  </div>
</template>

<script>
import ManageList from "./manage-list";
import ManageAdd from "./manage-add";
import ManageOver from "./manage-over";
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  components: {
    ManageList,
    ManageAdd,
    ManageOver
  },
  data() {
    return {
      size: 20,
      status: false,
      status2: false,
      state4: "",
      editid: "",
      overid: "",
      title: "创建项目"
    };
  },
  computed: {
    ...mapGetters(["dismanage"]),
    ...mapState(["total", "pagesize"])
  },
  created() {},
  mounted() {
    this.SETSTATE({ k: "managelist", v: [] });
  },
  watch: {},
  methods: {
    ...mapMutations(["SETSTATE"]),
    pageSizeChange(size) {
      let pageSize = size;
      this.size = size;
      this.$store.dispatch("getManagelist", { pageSize });
    },
    pageSwitch(page) {
      let pageIndex = page;
      let pageSize = this.size;
      this.$store.dispatch("getManagelist", { pageIndex, pageSize });
    },
    projectSearch() {
      let v = this.state4;
      let k = "projectkwd";

      this.SETSTATE({ k, v });

      let pageSize = this.size;
      this.$store.dispatch("getManagelist", { pageSize });
    },
    cancelAddbm(k) {
      this[k] = false;
      this.editid = "";
      this.title = "创建项目";
    },
    editProject(id) {
      this.status = true;
      this.editid = id;
      this.title = "编辑项目";
    },
    overProject(id) {
      this.status2 = true;
      this.overid = id;
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
