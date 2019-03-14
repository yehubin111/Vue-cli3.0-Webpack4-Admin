<template>
  <el-dialog title="选择创意" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <div class="set">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelectNav"
      >
        <el-menu-item index="1">已选</el-menu-item>
        <el-menu-item index="2">未选</el-menu-item>
      </el-menu>
      <el-button class="button" type="text" @click="toAutoSelect">智能选择</el-button>
      <el-input
        class="search"
        v-model="state"
        placeholder="搜索创意ID"
        suffix-icon="el-icon-search"
        @input="createSearch"
      ></el-input>
      <div class="sortline">
        <p class="total">
          已选
          <span>{{inusetotal}}</span> 个创意，其中
          <span>{{canselectcreatelength}}</span> 个不可用（不生成广告）
        </p>

        <el-select
          class="select"
          v-if="activeIndex == 1"
          v-model="value2"
          placeholder="启用/停用"
          @change="statusChange"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select class="select" v-model="value" placeholder="分类" @change="classifyChange">
          <el-option v-for="item in classify" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-button class="obutton" type="text" v-if="activeIndex == 1" @click="cancelAll">删除全部</el-button>
        <el-button class="obutton" type="text" v-if="activeIndex == 2" @click="selectAll">选择全部</el-button>
      </div>
    </div>
    <!--  -->
    <plan-on v-if="activeIndex == 1" id="planon" :pid="id"></plan-on>
    <plan-off v-if="activeIndex == 2" :pid="id"></plan-off>
  </el-dialog>
</template>

<script>
import PlanOn from "./plan-createon.vue";
import PlanOff from "./plan-createoff.vue";
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
import { Loading } from "element-ui";
let search;
export default {
  props: ["status", "id"],
  components: {
    PlanOn,
    PlanOff
  },
  data() {
    return {
      // load1: false,
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
      let loadDom = "planon";
      if (n == true) {
        this.$store.dispatch("getInuseCreate", { plan_id, loadDom });
        this.$store.dispatch("getNouseCreate", { plan_id });
      }
    },
    id(n, v) {
      if (n) {
        let plan_id = n;
      }
    }
  },
  computed: {
    ...mapState(["classify", "nousecreate", "inusecreate", "inusetotal"]),
    ...mapGetters(["selectcreatelength", "canselectcreatelength"])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    toAutoSelect() {
      this.dialogFormVisible = false;

      setTimeout(v => {
        this.$emit("showCreatebox", "status2", this.id);
      }, 300);
    },
    selectAll() {
      this.$store.dispatch("addAllCreate", { planId: this.id });
    },
    cancelAll() {
      this.$store.dispatch("delAllCreate", { planId: this.id });
    },
    statusChange() {
      let k = "plcreatestatus";
      let v = this.value2;

      this.SETSTATE({ k, v });
      this.toGetlist();
    },
    classifyChange() {
      let k = "plcreateclassify";
      let v = this.value == "不限" ? "" : this.value;

      this.SETSTATE({ k, v });
      this.toGetlist();
    },
    createSearch() {
      let k = "plcreatekeyword";
      let v = this.state;
      let self = this;

      this.SETSTATE({ k, v });

      clearTimeout(search);
      search = setTimeout(function() {
        self.toGetlist();
      }, 300);
    },
    toGetlist() {
      let plan_id = this.id;
      this.$store.dispatch("getInuseCreate", { plan_id });
      this.$store.dispatch("getNouseCreate", { plan_id });
    },
    handleSelectNav(idx) {
      if (idx == this.activeIndex) return;
      console.log(idx);
      this.activeIndex = idx;
    },
    toCancel() {
      this.reset();

      this.$emit("cancelAddbm", "status1");
    },
    reset() {
      this.state = "";
      this.value = "";
      this.value2 = "";
      this.activeIndex = "1";
      this.SETSTATE({ k: "plcreatestatus", v: "" });
      this.SETSTATE({ k: "plcreateclassify", v: "" });
      this.SETSTATE({ k: "plcreatekeyword", v: "" });
    }
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
