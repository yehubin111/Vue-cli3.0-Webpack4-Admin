<template>
  <div class="contain">
    <p class="title">APP同步</p>
    <div class="list">
      <div class="right">
        <div class="ctrl">
          <el-button class="add" type="primary" @click="status1 = true">新增应用</el-button>
          <el-input class="search" v-model="state4" placeholder="搜索应用ID/名称" suffix-icon="el-icon-search" @input="appSearch"></el-input>
        </div>
        <app-list @editApp="editApp"></app-list>
      </div>
    </div>
    <add-app :status="status1" @cancelAddapp="cancelAddapp"></add-app>
    <set-app :status="status2" :id="id" @cancelAddapp="cancelAddapp"></set-app>
    <!-- <app-detection :status="status3" :platform="platform" :id="id" @cancelAddapp="cancelAddapp"></app-detection> -->
  </div>
</template>

<script>
import AppList from "./app-list";
import AddApp from "./app-addapp";
import SetApp from "./app-setapp";
// import AppDetection from "./app-detection";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  components: {
    AppList,
    AddApp,
    SetApp,
    // AppDetection
  },
  data() {
    return {
      status1: false,
      status2: false,
      status3: false,
      state4: "",
      platform: [],
      id: ""
    };
  },
  computed: {
    ...mapState(["bmlist", "addata"])
  },
  created() {
    let k = "appkwd";
    let v = "";

    this.SETSTATE({ k, v });
  },
  mounted() {
    this.$store.dispatch("getApplist");
  },
  watch: {},
  methods: {
    ...mapMutations(["SETSTATE"]),
    // setDetection(id, platform) {
    //   this.status3 = true;
    //   this.platform = platform;
    //   this.id = id;
    // },
    appSearch() {
      let v = this.state4.toLowerCase();
      let k = "appkwd";

      this.SETSTATE({ k, v });
    },
    cancelAddapp(k) {
      this[k] = false;
    },
    editApp(id) {
      this.status2 = true;
      this.id = id;
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
        margin-bottom: 10px;
        .add {
          float: left;
        }
        .search {
          float: right;
          width: 250px;
        }
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
