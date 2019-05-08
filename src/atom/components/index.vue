<template>
  <el-container>
    <el-header class="elheader">
      <top-header></top-header>
    </el-header>
    <router-view></router-view>
  </el-container>
</template>
<script>
import TopHeader from "./header";

export default {
  components: {
    TopHeader
  },
  data() {
    return {};
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
