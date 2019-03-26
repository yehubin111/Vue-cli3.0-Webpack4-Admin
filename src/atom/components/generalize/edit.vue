<template>
  <div class="gener">
    <p class="title">项目{{projectname}}&nbsp;&nbsp;>&nbsp;&nbsp;编辑推广计划</p>
    <edit-form v-for="(l, index) in disinfo" :key="index" :createinfo="l" @changeEdit="changeEdit"></edit-form>
  </div>
</template>

<script>
import EditForm from "./edit-form";
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
    EditForm
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

    let plan_id = this.$route.params.pid;
    this.$store.dispatch("getCreateInfo", { plan_id });

    let project_id = this.$route.params.id;
    let audience_ids = this.$route.params.tid ? this.$route.params.tid : "";
    this.$store.dispatch("generAccountList", { audience_ids, project_id });
    // 获取分类
    this.$store.dispatch("getClassifyForPlan", project_id);
  },
  computed: {
    ...mapState(["itemlist", "disinfo"]),
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    }
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
