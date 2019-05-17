<template>
  <el-container>
    <el-header class="elheader">
      <top-header></top-header>
    </el-header>
    <router-view></router-view>
    <!-- <pig-module></pig-module> -->
  </el-container>
</template>
<script>
import TopHeader from "./header";
// import PigModule from './ummodule/pigmodule';

export default {
  components: {
    TopHeader,
    // PigModule
  }
};
</script>
<style lang="less">
@import "../../common/less/media.less";
</style>

<style lang="less" scoped>
.elheader {
  padding: 0;
  background: linear-gradient(to right, #445ed2, #3297ff);
}
</style>
