<template>
  <div class="head">
    <p class="logo">
      <router-link to="/pandect"></router-link>
    </p>
    <user-info></user-info>
    <header-message></header-message>
    <import-menu @showAddBox="showAddBox" @showVideoBox="showVideoBox"></import-menu>
    <!-- <header-add :status="status" @cancelAddbm="cancelAddbm"></header-add> -->
    <video-url :status.sync="status2"></video-url>
    <fail-detail></fail-detail>
    <manage-add :status.sync="addstatus" :allotStatus.sync="allotstatus"></manage-add>
    <allot-account :status.sync="addstatus" :allotStatus.sync="allotstatus" @resetList="resetList"></allot-account>
  </div>
</template>

<script>
import FailDetail from "./header-faildetail";
import HeaderMessage from "./header-message";
// import HeaderAdd from "./header-add";
import ManageAdd from "./manage/manage-add";
import AllotAccount from "./manage/manage-allotaccount";
import UserInfo from "./header-userinfo";
import ImportMenu from "./header-menu";
import VideoUrl from "./header-videourl";
export default {
  data() {
    return {
      // status: false,
      status2: false,
      addstatus: false,
      allotstatus: false
    };
  },
  components: {
    ImportMenu,
    UserInfo,
    // HeaderAdd,
    ManageAdd,
    AllotAccount,
    HeaderMessage,
    VideoUrl,
    FailDetail
  },
  methods: {
    showVideoBox() {
      this.status2 = true;
    },
    showAddBox() {
      this.addstatus = true;
    },
    resetList() {
      if (this.$route.name != "manage") {
        this.$router.push({
          name: "manage"
        });
      }
    }
    // cancelAddbm() {
    //   this.status = false;
    // }
  },
  mounted() {
    // this.$store.dispatch('setPermission');
  }
};
</script>

<style lang="less" scoped>
.head {
  width: 1440px;
  margin: 0 auto;
  height: 60px;
  .logo {
    width: 235px;
    height: 60px;
    float: left;
    background: url("../assets/logo.png") 0 center no-repeat;
    background-size: 200px auto;
    a {
      display: block;
      width: 235px;
      height: 60px;
    }
  }
}
</style>
