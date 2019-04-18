<template>
  <div class="contain">
    <el-breadcrumb class="title" separator=">">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>模板制图</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ctrl">
      <el-button class="add" type="primary" @click="status1 = true">制作图片</el-button>
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
    <!-- <div class="canvas">
      <image-template
        :baseImage="baseImage"
        :baseWidth="baseWidth"
        :baseHeight="baseHeight"
        :fileDots="fileDots"
        :fileImages="fileImages"
        :canvasWidth="canvasWidth"
        :canvasHeight="canvasHeight"
      ></image-template>
    </div>
    <el-button type="primary" @click="setTemplate">click</el-button>
    <el-button type="primary" @click="templateExport">export</el-button> -->
  </div>
</template>

<script>
import TempList from './temp-templist';
import ImageTemplate from "./temp-template";
import exportTemplate from "@/atom/js/imageTemplate";
export default {
  components: {
    ImageTemplate,
    TempList
  },
  data() {
    return {
      baseImage:
        "http://172.31.1.45/file/image/2019/04/17/2050c4b8-1d64-4b63-9705-767068f68016.png",
      baseWidth: 1200,
      baseHeight: 628,
      canvasWidth: 600,
      canvasHeight: 314,
      fileDots: [
        { start: [0, 0], end: [405, 628] },
        { start: [411, 0], end: [795, 628] },
        { start: [801, 0], end: [1200, 628] }
      ],
      fileImages: []
    };
  },
  methods: {
    templateCtrl() {

    },
    setTemplate() {
      let images = [
        "http://172.31.1.45/file/image/2019/01/21/e9903413-1837-4a21-b15c-2885679dbf14.jpg",
        "http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg",
        "http://172.31.1.45/file/image/2019/04/17/81928349-a23c-4c85-9803-e9fdbcc566e7.jpg"
      ];

      this.fileImages = images;
    },
    templateExport() {
      new exportTemplate({
        baseImage: this.baseImage,
        baseWidth: this.baseWidth,
        baseHeight: this.baseHeight,
        fileImages: this.fileImages,
        fileDots: this.fileDots
      }).then(res => {
        let img = new Image();
        img.src = res;
      });
    }
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


