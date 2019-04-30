<template>
  <div class="gener">
    <bread-crumb pageName="复制推广计划"></bread-crumb>
    <copy-form v-for="(l, index) in disinfo" :key="index" :createinfo="l" @changeEdit="changeEdit"></copy-form>
  </div>
</template>

<script>
import CopyForm from "./copy-form";
import BreadCrumb from '@/atom/components/project-breadcrumb';
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  beforeRouteLeave(to, from, next) {
    // console.log(to, from, next);
    if (!this.ifedit) {
      this.$confirm("是否确定离开当前页面", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          next();
        })
        .catch(() => {});
    } else {
      next();
    }
  },
  data() {
    return {
      status: false,
      status1: false,
      ifedit: true
    };
  },
  components: {
    CopyForm,
    BreadCrumb
    // SelectCreate,
    // SelectAccount
  },
  created() {
    this.SETSTATE({ k: "classifyfiltercount", v: 0 });
  },
  mounted() {
    this.$store.dispatch("otherCountries");
    this.$store.dispatch("getLanguage");
    this.$store.dispatch("getInterests");
    // 获取主页列表
    let projectId = this.$route.params.id;
    this.$store.dispatch("commonPage", { project_id: projectId });
    // 获取应用列表
    this.$store.dispatch('commonApp', { project_id: projectId });

    let plan_id = this.$route.params.pid;
    this.$store.dispatch("getCreateInfo", { plan_id });

    let project_id = this.$route.params.id;
    this.$store.dispatch("commonAccount", { project_id })
    // 获取分类
    this.$store.dispatch("getClassifyForPlan", project_id);
  },
  computed: {
    ...mapState(["disinfo"])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    changeEdit(res) {
      this.ifedit = res;
    },
    cancelAddbm(k) {
      this[k] = false;
    }
  }
};
</script>

<style lang="less" scoped>
.gener {
  flex-grow: 1;
}
</style>
