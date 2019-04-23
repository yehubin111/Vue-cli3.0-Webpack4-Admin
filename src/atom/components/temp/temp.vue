<template>
  <div class="contain">
    <el-breadcrumb class="title" separator=">">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>模板制图</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ctrl">
      <el-button class="add" type="primary" @click="toCreateImage">制作图片</el-button>
      <el-dropdown class="add" split-button type="primary" @command="templateCtrl">
        批量
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">下载</el-dropdown-item>
          <el-dropdown-item command="b">删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="text" class="add">全选</el-button>
    </div>
    <temp-list></temp-list>
  </div>
</template>

<script>
import TempList from "./temp-templist";

import exportTemplate from "@/atom/js/imageTemplate";
export default {
  components: {
    TempList
  },
  data() {
    return {
      createstatus: true
    };
  },
  mounted() {
    this.$store.dispatch("getTempImages");
  },
  methods: {
    toCreateImage() {
      this.$router.push({
        name: "createtemp"
      });
    },
    templateCtrl() {},
  }
};
</script>
<style lang="less" scoped>
.contain {
  width: 1200px;
  margin: 0 auto 50px auto;
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
  }
  .ctrl {
    overflow: hidden;
    margin-bottom: 30px;
    .add {
      float: left;
      margin-right: 20px;
    }
    .search {
      float: right;
      width: 250px;
    }
  }
}
</style>


