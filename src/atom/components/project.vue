<template>
  <el-container>
    <el-header>
      <top-header></top-header>
    </el-header>
    <el-container class="contain">
      <el-aside width="200px" class="aside">
        <left-nav></left-nav>
      </el-aside>
      <transition name="slide-left">
        <router-view></router-view>
      </transition>
    </el-container>
  </el-container>
</template>
<script>
import TopHeader from "./header";
import LeftNav from "./leftnav";
export default {
  components: {
    TopHeader,
    LeftNav
  },
  data() {
    return {};
  }
};
</script>
<style>
.slide-right-enter-active,
/* .slide-right-leave-active, */
.slide-left-enter-active
/* .slide-left-leave-active */
 {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(0, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(0, 0, 0);
}
</style>

<style lang="less" scoped>
.el-header {
  padding: 0;
  background: linear-gradient(to right, #445ed2, #3297ff);
  min-width: 1200px;
}
.contain {
  width: 1200px;
  margin: 0 auto;
  .aside {
    margin-right: 0;
    text-align: center;
    margin-top: 20px;
  }
}
</style>
