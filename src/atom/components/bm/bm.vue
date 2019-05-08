<template>
  <div class="contain">
    <p class="title">BM同步</p>
    <div class="nav" v-if="getbmover && bmlist.length > 0">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelectNav"
      >
        <el-menu-item
          v-for="(l, index) in bmlist"
          :key="index"
          :index="index.toString()"
        >{{l.bmName}}</el-menu-item>
      </el-menu>
      <el-button class="addBM" type="primary" size="small" @click="status1 = true">新增BM</el-button>
    </div>
    <div class="list" v-if="getbmover && bmlist.length > 0">
      <div class="leftnav">
        <p :class="{on: leftnav == 0}" @click="leftTab(0)">广告账户</p>
        <p :class="{on: leftnav == 1}" @click="leftTab(1)">主页管理</p>
      </div>
      <div class="right" v-if="leftnav == 0">
        <div class="ctrl">
          <el-button class="add" type="primary" @click="status2 = true">新增账户</el-button>
          <el-input
            class="search"
            v-model="state4"
            placeholder="搜索账户ID/名称"
            suffix-icon="el-icon-search"
            @input="accountSearch"
          ></el-input>
          <el-button class="deletewrong" type="text" @click="deleteBM">删除异常账户</el-button>
        </div>
        <ad-list></ad-list>
        <div class="pageswitch">
          <el-pagination
            background
            @size-change="pageSizeChange"
            :page-sizes="[20, 200, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="bm_pageIndex"
            :total="accounttotal"
            :page-size="bm_pageSize"
            @current-change="pageSwitch"
          ></el-pagination>
        </div>
      </div>
      <div class="right" v-else>
        <div class="ctrl">
          <el-button class="add" type="primary" @click="status3 = true">新增主页</el-button>
          <el-input
            class="search"
            v-model="state5"
            placeholder="搜索主页ID/名称"
            suffix-icon="el-icon-search"
            @input="pageSearch"
          ></el-input>
        </div>
        <home-page></home-page>
        <div class="pageswitch">
          <el-pagination
            background
            @size-change="pageSizeChange2"
            :page-sizes="[20, 200, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="bmpageindex"
            :total="pagetotal"
            :page-size="bmpg_pageSize"
            @current-change="bmpageSwitch"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="nobm" v-if="getbmover && bmlist.length == 0">
      <p class="info">暂无BM账号 请新增</p>
      <el-button class="addBM2" type="primary" size="small" @click="status1 = true">新增BM</el-button>
    </div>
    <add-bm :status="status1" @cancelAddbm="cancelAddbm"></add-bm>
    <add-account :status="status2" @cancelAddbm="cancelAddbm" @dataChange="dataChange"></add-account>
    <add-page :status="status3" @cancelAddbm="cancelAddbm" @dataChange="dataChange"></add-page>
  </div>
</template>

<script>
import AdList from "./bm-adlist";
import HomePage from "./bm-homepage";
import AddBm from "./bm-addbm";
import AddPage from "./bm-addpage";
import AddAccount from "./bm-addaccount";
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  components: {
    AdList,
    HomePage,
    AddBm,
    AddPage,
    AddAccount
  },
  data() {
    return {
      searchrun: null,
      activeBmid: "",
      activeIndex: "0",
      pageindex: 1,
      bmpageindex: 1,
      status1: false,
      status2: false,
      status3: false,
      state4: "",
      state5: "",
      leftnav: 0
    };
  },
  computed: {
    ...mapState([
      "getbmover",
      "bmlist",
      "addata",
      "accounttotal",
      "pagetotal",
      "bm_pageSize",
      "bm_pageIndex",
      "bmpg_pageSize"
    ])
  },
  created() {
    let k = "pagekwd";
    let v = "";

    this.SETSTATE({ k, v });

    k = "accountkwd";
    v = "";

    this.SETSTATE({ k, v });

    k = "bm_pageSize";
    v = 20;

    this.SETSTATE({ k, v });

    k = "bmpg_pageSize";
    v = 20;

    this.SETSTATE({ k, v });

    k = "bm_pageIndex";
    v = 1;

    this.SETSTATE({ k, v });

    k = "bmpg_pageIndex";
    v = 1;

    this.SETSTATE({ k, v });
  },
  mounted() {
    this.$store.dispatch("getBmlist");
  },
  watch: {},
  methods: {
    ...mapMutations([
      "SETSTATE",
      "SETACCOUNT",
      "ADDACCOUNT",
      "SETPAGE",
      "ADDPAGE"
    ]),
    deleteBM() {
      let bm = this.bmlist[this.activeIndex];
      let bmname = bm.bmName;
      let bmid = bm.bmId;
      this.$confirm(
        `确定删除${bmname}中所有的异常广告账户吗？`,
        "删除异常账户",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$store.dispatch("deleteBM", { bmid });
        })
        .catch(() => {});
    },
    pageSizeChange(size) {
      let v = size;
      let k = "bm_pageSize";

      this.SETSTATE({ k, v });

      this.$store.dispatch("getAccount");
    },
    pageSizeChange2(size) {
      let v = size;
      let k = "bmpg_pageSize";

      this.SETSTATE({ k, v });

      this.$store.dispatch("getPage");
    },
    dataChange(k, v) {
      this[k] = v;
    },
    pageSwitch(page) {
      this.pageindex = page;

      let v = this.pageindex;
      let k = "bm_pageIndex";

      this.SETSTATE({ k, v });

      this.$store.dispatch("getAccount");
    },
    bmpageSwitch(page) {
      this.bmpageindex = page;

      let v = this.bmpageindex;
      let k = "bmpg_pageIndex";

      this.SETSTATE({ k, v });

      this.$store.dispatch("getPage");
    },
    accountSearch() {
      let self = this;
      clearTimeout(this.searchrun);

      this.searchrun = setTimeout(function() {
        let v = self.state4;
        let k = "accountkwd";

        self.SETSTATE({ k, v });
        self.$store.dispatch("getAccount");
      }, 300);
    },
    pageSearch() {
      let self = this;
      clearTimeout(this.searchrun);

      this.searchrun = setTimeout(function() {
        let v = self.state5;
        let k = "pagekwd";

        self.SETSTATE({ k, v });
        self.$store.dispatch("getPage");
      }, 300);
    },
    cancelAddbm(k) {
      this[k] = false;
    },
    leftTab(k) {
      this.leftnav = k;
    },
    handleSelectNav(key, keyPath) {
      if (this.activeIndex != key) {
        this.pageindex = 1;
        this.bmpageindex = 1;

        this.activeIndex = key;
        this.activeBmid = this.bmlist[this.activeIndex].bmId;

        let k = "disbmid";
        let v = this.activeBmid;
        // 改变当前bmid
        this.SETSTATE({ k, v });

        v = 1;
        k = "bm_pageIndex";
        this.SETSTATE({ k, v });

        v = 1;
        k = "bmpg_pageIndex";
        this.SETSTATE({ k, v });

        v = "";
        k = "pagekwd";
        this.SETSTATE({ k, v });

        v = "";
        k = "accountkwd";
        this.SETSTATE({ k, v });

        this.$store.dispatch("getAccount");
        // this.$store.dispatch("getAddAccount", v);
        this.$store.dispatch("getPage");
        // this.$store.dispatch("getAddPage", v);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.contain {
  margin: 0 auto 50px auto;
  .title {
    line-height: 60px;
    font-size: 20px;
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
      overflow: hidden;
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
        .deletewrong {
          float: right;
          margin-right: 20px;
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
