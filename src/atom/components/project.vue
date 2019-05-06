<template>
  <el-container>
    <el-header>
      <top-header></top-header>
    </el-header>
    <el-container class="contain">
      <el-aside width="200px" class="aside" v-show="menushow">
        <left-nav></left-nav>
      </el-aside>
      <div class="rightcontent">
        <router-view></router-view>
      </div>
    </el-container>
  </el-container>
</template>
<script>
import TopHeader from "./header";
import LeftNav from "./leftnav";
import { mapState } from "vuex";
export default {
  components: {
    TopHeader,
    LeftNav
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["menushow"])
  }
};
</script>

<style lang="less" scoped>
.el-header {
  padding: 0;
  background: linear-gradient(to right, #445ed2, #3297ff);
  min-width: 1200px;
}
.contain {
  margin: 0 auto;
  display: flex;
  .aside {
    margin-right: 40px;
    text-align: center;
    margin-top: 20px;
    width: 200px;
    flex-basis: 200px;
  }
  .rightcontent{
    flex: 1;
    width: 0;
  }
}
</style>
