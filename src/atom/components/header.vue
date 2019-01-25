<template>
    <div class="head">
        <p class="logo">
            <router-link to="/pandect"></router-link>
        </p>
        <user-info></user-info>
        <header-message></header-message>
        <import-menu @showAddBox="showAddBox" @showVideoBox="showVideoBox"></import-menu>
        <header-add :status="status" @cancelAddbm="cancelAddbm"></header-add>
        <video-url :status.sync="status2"></video-url>
        <fail-detail></fail-detail>
    </div>
</template>

<script>
import FailDetail from './header-faildetail';
import HeaderMessage from './header-message';
import HeaderAdd from "./header-add";
import UserInfo from "./header-userinfo";
import ImportMenu from "./header-menu";
import VideoUrl from './header-videourl';
export default {
  data() {
    return {
      status: false,
      status2: false
    };
  },
  methods: {
    showVideoBox() {
      this.status2 = true;
    },
    showAddBox() {
      this.status = true;
    },
    cancelAddbm() {
      this.status = false;
    }
  },
  mounted() {
    // this.$store.dispatch('setPermission');
  },
  components: {
    ImportMenu,
    UserInfo,
    HeaderAdd,
    HeaderMessage,
    VideoUrl,
    FailDetail
  }
};
</script>

<style lang="less" scoped>
.head {
  width: 1200px;
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
