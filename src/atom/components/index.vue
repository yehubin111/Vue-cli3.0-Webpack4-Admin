<template>

<el-container>
  <el-header>
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
<style lang="less" scoped>
.el-header {
  padding: 0;
  background: linear-gradient(to right, #445ed2, #3297ff);
  min-width: 1200px;
}
</style>
