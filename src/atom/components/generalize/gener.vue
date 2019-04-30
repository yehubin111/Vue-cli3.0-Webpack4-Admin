<template>
  <div class="gener">
    <bread-crumb pageName="创建推广计划"></bread-crumb>
    <gener-form @changeEdit="changeEdit"></gener-form>
  </div>
</template>

<script>
import BreadCrumb from '@/atom/components/project-breadcrumb';
import GenerForm from "./gener-form";
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  beforeRouteLeave(to, from, next) {
    // console.log(to, from, next);
    if (!this.ifcreate) {
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
      ifcreate: true
    };
  },
  components: {
    GenerForm,
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
    // 创建推广计划受众列表
    let project_id = this.$route.params.id;
    // 获取广告账户列表
    this.$store.dispatch("commonAccount", { project_id })
    // 获取分类
    this.$store.dispatch("getClassifyForPlan", project_id);
  },
  computed: {
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    changeEdit(res) {
      this.ifcreate = res;
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
  position: relative;
  .bidguide {
    position: absolute;
    top: 100px;
    right: 0;
  }
}
</style>
