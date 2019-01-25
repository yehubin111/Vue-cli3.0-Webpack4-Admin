<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <div class="set">
      <el-input class="search" v-model="state" placeholder="搜索广告账户ID/名称" suffix-icon="el-icon-search"></el-input>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelectNav">
        <el-menu-item index="0">已加入</el-menu-item>
        <el-menu-item index="1">未加入</el-menu-item>
      </el-menu>
      <p class="allctrl" v-if="activeIndex == '0'" @click="delAll">删除全部</p>
      <p class="allctrl" v-else @click="selAll">选择全部</p>
      <el-select class="select" v-model="value" placeholder="请选择" @change="selectChange">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <set-list v-if="activeIndex == 0" :id="id" :keyword="state"></set-list>
      <can-set v-if="activeIndex == 1" :id="id" :keyword="state"></can-set>
    </div>
  </el-dialog>
</template>

<script>
import SetList from "./app-setlist";
import CanSet from "./app-canset";
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status", "id"],
  components: {
    SetList,
    CanSet
  },
  data() {
    return {
      activeIndex: "0",
      dialogFormVisible: false,
      title: "",
      state: "",
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
      value: ""
    };
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;

      let loadDom = "setList";
      let id = this.id;
      if (n == true) {
        this.$store.dispatch("setApp", { id, loading: "setList" });
        this.$store.dispatch("canSetapp", { id });
      }
    },
    id(n, v) {
      if (n != "") {
        let proj = this.disapp.find(v => v.applicationId == n);

        this.title = "设置" + proj.name + "的广告账户";

        // this.form.projectname = proj.projectName;
        // this.form.region = proj.applicationId;
      }
    }
  },
  computed: {
    // ...mapState(["addapplist", "disbmid"]),
    ...mapGetters(["disapp", "setapplist", "cansetapplist"])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    createSearch() {},
    delAll() {
      let ar = [];
      this.setapplist.forEach(v => {
        let obj = {};
        obj.fbAccountId = v.fbId;
        obj.applicationId = this.id;

        ar.push(obj);
      });
      this.$store.dispatch("delSet", { option: ar });
    },
    selAll() {
      let ar = [];
      this.cansetapplist.forEach(v => {
        let obj = {};
        obj.fbAccountId = v.fbId;
        obj.applicationId = this.id;

        ar.push(obj);
      });
      this.$store.dispatch("saveSet", { option: ar });
    },
    handleSelectNav(idx) {
      if (idx != this.activeIndex) this.activeIndex = idx;
    },
    toCancel() {
      this.activeIndex = "0";
      this.value = "";
      this.$emit("cancelAddapp", "status2");

      let k = "setappstatus";
      let v = this.value;
      this.SETSTATE({ k, v });

      this.state = '';
    },
    selectChange() {
      let k = "setappstatus";
      let v = this.value;
      this.SETSTATE({ k, v });
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-demo {
  margin-bottom: 20px;
}
.search {
  width: 180px;
  position: absolute;
  top: 10px;
  right: 0px;
  z-index: 11;
}
.set {
  position: relative;
  .allctrl {
    color: #409eff;
    position: absolute;
    right: 340px;
    line-height: 40px;
    top: 10px;
    // display: none;
    cursor: pointer;
  }
  .select {
    position: absolute;
    right: 190px;
    top: 10px;
    width: 140px;
  }
}
</style>
