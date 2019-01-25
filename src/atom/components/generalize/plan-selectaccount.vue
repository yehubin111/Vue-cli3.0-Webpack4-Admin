<template>
  <el-dialog title="选择广告账户" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <div class="set">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelectNav">
        <el-menu-item index="1">加入</el-menu-item>
        <el-menu-item index="2">未加入</el-menu-item>
      </el-menu>
      <el-input class="search" v-model="state" placeholder="搜索广告账户ID/名称" suffix-icon="el-icon-search" @input="createSearch"></el-input>
      <div class="sortline">
        <p class="total">已选
          <span>{{selectaccountlength}}</span> 个广告账户，其中
          <span>{{canselectaccountlength}}</span> 个不可用(不生成广告)，
          <span>{{badselectaccountlength}}</span> 个异常(不生成广告)</p>

        <el-select class="select" v-if="activeIndex == 1" v-model="value2" placeholder="启用/停用" @change="statusChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-button class="obutton" type="text" v-if="activeIndex == 1" @click="cancelAll">删除全部</el-button>
        <el-button class="obutton" type="text" v-if="activeIndex == 2" @click="selectAll">选择全部</el-button>
      </div>
    </div>
    <!--  -->
    <account-on v-if="activeIndex == 1" :pid="id" id="accountOn"></account-on>
    <account-off v-if="activeIndex == 2" :pid="id"></account-off>
  </el-dialog>
</template>

<script>
import AccountOn from "./plan-accounton.vue";
import AccountOff from "./plan-accountoff.vue";
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
let search;
export default {
  props: ["status", "id"],
  components: {
    AccountOn,
    AccountOff
  },
  data() {
    return {
      state: "",
      activeIndex: "1",
      dialogFormVisible: false,
      title: "",
      options: [
        {
          value: "1",
          label: "已启用"
        },
        {
          value: "0",
          label: "未启用"
        }
      ],
      value: "",
      value2: ""
    };
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;

      let plan_id = this.id;
      let loadDom = "accountOn";
      if (n == true) {
        this.$store.dispatch("getAccountList", { plan_id, loadDom });
      } else {
        this.state = '';
        let k = "accountkeyword";
        let v = '';

        this.SETSTATE({ k, v });
      }
    },
    id(n, v) {
      if (n) {
        let plan_id = n;
        // this.$store.dispatch("getAccountList", { plan_id });
      }
    }
  },
  computed: {
    ...mapState(["inuseaccount", "nouseaccount"]),
    ...mapGetters([
      "selectaccountlength",
      "canselectaccountlength",
      "badselectaccountlength"
    ])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    toAutoSelect() {
      this.$emit("showCreatebox", "status2", this.id);
      this.dialogFormVisible = false;
    },
    selectAll() {
      let self = this;
      let option = [];
      this.nouseaccount.forEach(v => {
        let obj = {
          fbAccountId: v.fbId,
          planId: self.id,
          accountStatus: v.status
        };

        option.push(obj);
      });

      this.$store.dispatch("addAccount", { option });
    },
    cancelAll() {
      let self = this;
      let option = [];
      this.inuseaccount.forEach(v => {
        let obj = {
          fbAccountId: v.fbId,
          planId: self.id
        };

        option.push(obj);
      });

      this.$store.dispatch("delAccount", { option });
    },
    statusChange() {
      let k = "accountstatus";
      let v = this.value2;

      this.SETSTATE({ k, v });
    },
    createSearch() {
      let k = "accountkeyword";
      let v = this.state;

      this.SETSTATE({ k, v });
    },
    handleSelectNav(idx) {
      if (idx == this.activeIndex) return;
      console.log(idx);
      this.activeIndex = idx;
    },
    toCancel() {
      this.$emit("cancelAddbm", "status3");
    },
    selectChange() {}
  }
};
</script>

<style lang="less" scoped>
.el-menu-demo {
  margin-bottom: 20px;
}
.set {
  position: relative;
  .search {
    position: absolute;
    right: 0;
    top: 10px;
    width: 200px;
  }
  .button {
    position: absolute;
    right: 220px;
    top: 10px;
  }
}

.sortline {
  overflow: hidden;
  margin-bottom: 20px;
  .obutton {
    float: right;
  }
  .total {
    float: left;
    line-height: 40px;
    span {
      color: #409eff;
    }
  }
  .select {
    width: 120px;
    float: right;
    margin-left: 10px;
  }
}
</style>
