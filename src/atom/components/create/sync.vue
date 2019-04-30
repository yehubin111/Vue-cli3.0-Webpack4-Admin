<template>
  <div class="sync">
    <bread-crumb pageName="同步记录"></bread-crumb>
    <div class="ctrl">
      <el-select class="selectr" v-model="value" filterable placeholder="广告账户" @change="filterList">
        <el-option
          v-for="item in commonaccount"
          :key="item.fbId"
          :label="item.name + (item.fbId != -1?'('+item.fbAccountId+')':'')"
          :value="item.fbId"
          :disabled="item.accountStatus != 1"
        ></el-option>
      </el-select>
      <el-select class="selectr" v-model="value2" placeholder="状态" @change="filterList">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button class="add" @click="syncAll">同步</el-button>
      <el-input
        class="search"
        v-model="state"
        placeholder="搜索创意编号"
        suffix-icon="el-icon-search"
        @input="createSearch"
      ></el-input>
    </div>
    <div class="list" id="syncList">
      <sync-list @multiSelect="multiSelect"></sync-list>
    </div>
    <div class="pageswitch">
      <el-pagination
        background
        @size-change="pageSizeChange"
        :page-sizes="[20, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="synctotal"
        :page-size="20"
        @current-change="pageSwitch"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import SyncList from "./sync-list";
import BreadCrumb from '@/atom/components/project-breadcrumb';
import { mapState, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
let tosearch;
export default {
  data() {
    return {
      value: "",
      value2: "",
      state: "",
      pageindex: 1,
      pagesize: 20,
      idlist: [],
      options: [
        {
          value: "-1",
          label: "不限"
        },
        {
          value: "1",
          label: "同步成功"
        },
        {
          value: "0",
          label: "同步失败"
        },
        {
          value: "2",
          label: "同步中"
        }
      ]
    };
  },
  components: {
    SyncList,
    BreadCrumb
  },
  created() {
    let option = {
      status: "",
      fbAccountId: "",
      pageSize: 20,
      pageIndex: 1,
      projectId: ""
    };

    for (let i in option) {
      var k = "sync_" + i;
      var v = option[i];

      this.SETSTATE({ k, v });
    }
  },
  mounted() {
    let k = "sync_projectId";
    let v = this.$route.params.id;
    this.SETSTATE({ k, v });

    this.SETSTATE({ k: "synclist", v: [] });

    this.$store.dispatch("syncList", { loading: "syncList" });

    // 获取广告账户
    this.$store.dispatch("commonAccount", {
      project_id: this.$route.params.id
    });
  },
  watch: {
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    createSearch() {
      clearTimeout(tosearch);

      tosearch = setTimeout(() => {
        this.toSort();
      }, 300);
    },
    pageSizeChange(size) {
      this.pagesize = size;
      this.toSort();
    },
    pageSwitch(page) {
      this.pageindex = page;

      this.toSort();
    },
    multiSelect(sel) {
      let ar = [];
      sel.forEach(v => {
        ar.push(v.id);
      });

      this.idlist = ar.join(",");
    },
    syncAll() {
      if (this.idlist == "") {
        Msgwarning("请先选择需要同步的记录");
        return;
      }
      let ids = this.idlist;

      this.idlist = "";
      this.$store.dispatch("synclistall", { ids });
    },
    filterList() {
      this.pageindex = 1;

      this.toSort();
    },
    toSort() {
      let option = {
        keyWords: encodeURIComponent(this.state),
        status: this.value2 == "-1" ? "" : this.value2,
        fbAccountId: this.value == "-1" ? "" : this.value,
        pageSize: this.pagesize,
        pageIndex: this.pageindex,
        projectId: this.$route.params.id
      };

      for (let i in option) {
        var k = "sync_" + i;
        var v = option[i];

        this.SETSTATE({ k, v });
      }

      this.$store.dispatch("syncList");
    }
  },
  computed: {
    ...mapState(["commonaccount", "synctotal"]),
  }
};
</script>

<style lang="less" scoped>
.sync {
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
    .back {
      color: #333;
    }
  }
  .ctrl {
    margin-bottom: 20px;
    overflow: hidden;
    .selectr {
      width: 150px;
      margin-right: 20px;
      float: left;
    }
    .add {
      float: left;
    }
    .search {
      float: right;
      width: 300px;
    }
  }
  .list {
    min-height: 400px;
  }
  .pageswitch {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 50px;
  }
}
</style>
