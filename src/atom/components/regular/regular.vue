<template>
  <div class="contain">
    <p class="title">规则列表</p>
    <div class="list">
      <div class="right">
        <div class="ctrl">
          <el-select class="select" v-model="status" filterable collapse-tags placeholder="状态" @change="toSort">
            <el-option v-for="(item, index) in statuslist" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-input class="search" v-model="state" placeholder="搜索规则ID/名称" suffix-icon="el-icon-search" @input="reguSearch"></el-input>
        </div>
        <regular-list></regular-list>
        <div class="pageswitch">
          <el-pagination background @size-change="pageSizeChange" :page-sizes="[20, 200, 500]" layout="total, sizes, prev, pager, next, jumper" :current-page="rg_pageNo" :total="regulartotal" :page-size="rg_pageSize" @current-change="pageSwitch">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import RegularList from "./regular-list";
let reg = null;
export default {
  components: {
    RegularList
  },
  data() {
    return {
      status: "",
      state: "",
      statuslist: [
        {
          name: "不限",
          id: "-1"
        },
        {
          name: "测试",
          id: "0"
        },
        {
          name: "已上架",
          id: "1"
        },
        {
          name: "已下架",
          id: "2"
        }
      ]
    };
  },
  mounted() {
    this.$store.dispatch("getRegular");
  },
  computed: {
    ...mapState(["regulartotal", "rg_pageSize", "rg_pageNo"])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    pageSwitch(page) {
      let k = 'rg_pageNo';
      let v = page;
      this.SETSTATE({ k, v });

      this.toGetRegular();
    },
    pageSizeChange(size) {
      let k = 'rg_pageSize';
      let v = size;
      this.SETSTATE({ k, v });

      k = 'rg_pageNo';
      v = 1;
      this.SETSTATE({ k, v });

      this.toGetRegular();
    },
    toSort() {
      let k = "rg_ruleStatus";
      let v = this.status == "-1" ? "" : this.status;
      this.SETSTATE({ k, v });

      k = 'rg_pageNo';
      v = 1;
      this.SETSTATE({ k, v });

      this.toGetRegular();
    },
    toGetRegular() {
      this.$store.dispatch("getRegular");
    },
    reguSearch() {
      let k = "rg_keyword";
      let v = this.state;
      this.SETSTATE({ k, v });

      k = 'rg_pageNo';
      v = 1;
      this.SETSTATE({ k, v });

      clearTimeout(reg);
      reg = setTimeout(() => {
        this.toGetRegular();
      }, 300);
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
  .list {
    display: flex;
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
      .pageswitch {
        text-align: center;
        margin-top: 20px;
      }
    }
  }
}
</style>
