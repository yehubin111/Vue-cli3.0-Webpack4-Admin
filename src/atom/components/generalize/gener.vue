<template>
  <div class="gener">
    <el-breadcrumb class="title" separator=">">
      <el-breadcrumb-item>项目{{projectname}}</el-breadcrumb-item>
      <el-breadcrumb-item>创建推广计划</el-breadcrumb-item>
    </el-breadcrumb>
    <gener-form @changeEdit="changeEdit" :targetid="targetid"></gener-form>
  </div>
</template>

<script>
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
      ifcreate: true,
      targetid: this.$route.params.tid
    };
  },
  components: {
    GenerForm
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
    this.$store.dispatch("getApplist");
    this.$store.dispatch("getAllpages");
    // 创建推广计划受众列表
    let project_id = this.$route.params.id;
    let audience_ids = this.$route.params.tid ? this.$route.params.tid : "";
    this.$store.dispatch("generAccountList", { audience_ids, project_id });
    // 获取分类
    this.$store.dispatch("getClassifyForPlan", project_id);
  },
  computed: {
    ...mapState(["itemlist"]),
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    }
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
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
    margin-left: 40px;
    .back {
      color: #333;
    }
  }
}
</style>
