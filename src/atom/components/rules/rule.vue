<template>
  <div class="rule">
    <p class="title">项目{{projectname}}&nbsp;&nbsp;>&nbsp;&nbsp;规则管理</p>
    <div class="ctrlline">
      <el-select
        class="select"
        v-model="account"
        filterable
        multiple
        collapse-tags
        placeholder="广告账户，可多选，支持编号和名称搜索"
        @change="selectCondition"
      >
        <el-option
          v-for="item in adaccountlist"
          :key="item.fbId"
          :label="item.name + (item.fbId != -1?'('+item.fbId+')':'')"
          :value="item.fbId"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="addStatus = true">创建</el-button>
    </div>
    <div class="rulelist">
      <rule-list @editRule="editRule"></rule-list>
    </div>
    <rule-add ref="ruleAdd" :status.sync="addStatus"></rule-add>
  </div>
</template>

<script>
import RuleAdd from "./rule-add";
import RuleList from "./rule-list";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    RuleList,
    RuleAdd
  },
  data() {
    return {
      value2: true,
      account: [],
      addStatus: false
    };
  },
  mounted() {
    // this.$store.dispatch("getRules", this.$route.params.id);
    this.SETOBJSTATE({
      obj: "ruleoption",
      name: "projectId",
      v: this.$route.params.id
    });
    // 获取规则列表数据
    this.getRuleDate();
    // 获取广告账户数据
    this.$store.dispatch("getAdaccount", this.$route.params.id);
  },
  computed: {
    ...mapState(["itemlist", "adaccountlist"]),
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    }
  },
  methods: {
    ...mapMutations(["SETOBJSTATE"]),
    selectCondition() {
      let account = this.account;
      this.SETOBJSTATE({
        obj: "ruleoption",
        name: "fbAccountIds",
        v: account.join(",")
      });
      this.SETOBJSTATE({
        obj: "ruleoption",
        name: "pageIndex",
        v: 1
      });
      // 获取规则列表数据
      this.getRuleDate();
    },
    editRule(id, fbid) {
      this.addStatus = true;
      this.$refs.ruleAdd.initEdit(id, fbid);
    },
    getRuleDate() {
      this.$store.dispatch("getRuleList");
    },
    switchChange(id) {
      let status = this.rulelist.find(v => v.id == id).status;

      let projid = this.$route.params.id;
      let ruleGroupId = id;

      if (status) this.$store.dispatch("openRule", { projid, ruleGroupId });
      else this.$store.dispatch("closeRule", { projid, ruleGroupId });
    }
  }
};
</script>

<style lang="less" scoped>
.rule {
  flex-grow: 1;
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
    margin-left: 40px;
    .back {
      color: #333;
    }
  }
  .ctrlline {
    margin-left: 40px;
    margin-bottom: 30px;
    .select {
      width: 400px;
      margin-right: 20px;
    }
  }
  .rulelist {
    margin-left: 40px;
  }
}
</style>
