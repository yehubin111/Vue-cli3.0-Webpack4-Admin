<template>
  <div class="rule">
    <bread-crumb pageName="规则管理"></bread-crumb>
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
          v-for="item in commonaccount"
          :key="item.fbAccountId"
          :label="item.name + (item.fbAccountId != -1?'('+item.fbAccountId+')':'')"
          :value="item.fbAccountId"
          :disabled="item.accountStatus != 1"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="addStatus = true">创建</el-button>
      <el-input
        v-model="keyword"
        placeholder="请输入规则名称"
        class="keyword"
        @input="toSort"
        suffix-icon="el-icon-search"
      ></el-input>
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
import BreadCrumb from '@/atom/components/project-breadcrumb';
import { mapState, mapMutations } from "vuex";
import { clearTimeout, setTimeout } from "timers";
let keywordsearch;
export default {
  components: {
    RuleList,
    RuleAdd,
    BreadCrumb
  },
  data() {
    return {
      value2: true,
      account: [],
      addStatus: false,
      keyword: ""
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
    // 获取广告账户
    this.$store.dispatch("commonAccount", { project_id: this.$route.params.id });
  },
  computed: {
    ...mapState(["commonaccount"])
  },
  methods: {
    ...mapMutations(["SETOBJSTATE"]),
    toSort() {
      clearTimeout(keywordsearch);
      keywordsearch = setTimeout(() => {
        this.SETOBJSTATE({
          obj: "ruleoption",
          name: "pageIndex",
          v: 1
        });
        this.SETOBJSTATE({
          obj: "ruleoption",
          name: "name",
          v: encodeURIComponent(this.keyword.trim())
        });
        this.getRuleDate();
      }, 300);
    },
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
  .ctrlline {
    margin-bottom: 30px;
    .select {
      width: 400px;
      margin-right: 20px;
    }
    .keyword {
      width: 300px;
      float: right;
    }
  }
  .rulelist {
  }
}
</style>
