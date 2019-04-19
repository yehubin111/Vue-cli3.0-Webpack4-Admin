<template>
  <div>
    <div class="sort">
      <p>
        <span class="title">尺寸</span>
        <span class="sel on">1200x628</span>
        <span class="sel">1080x1080</span>
        <span class="sel">320x480</span>
        <span class="sel">300x250</span>
        <span class="sel">300x50</span>
      </p>
      <p>
        <span class="title">行业</span>
        <span class="sel">电商</span>
        <span class="sel">短视频</span>
        <span class="sel">社交</span>
        <span class="sel">工具</span>
      </p>
    </div>
    <ul class="templatelist">
      <li>
        <p class="image">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <p class="tip">
          <el-tag class="tag" size="medium">浪漫</el-tag>
          <el-tag class="tag" size="medium">多图</el-tag>
        </p>
      </li>
      <li>
        <p class="image">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <p class="tip">
          <el-tag class="tag" size="medium">浪漫</el-tag>
          <el-tag class="tag" size="medium">多图</el-tag>
        </p>
      </li>
      <li>
        <p class="image">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <p class="tip">
          <el-tag class="tag" size="medium">浪漫</el-tag>
          <el-tag class="tag" size="medium">多图</el-tag>
        </p>
      </li>
      <li>
        <p class="image">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <p class="tip">
          <el-tag class="tag" size="medium">浪漫</el-tag>
          <el-tag class="tag" size="medium">多图</el-tag>
        </p>
      </li>
      <li>
        <p class="image">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <p class="tip">
          <el-tag class="tag" size="medium">浪漫</el-tag>
          <el-tag class="tag" size="medium">多图</el-tag>
        </p>
      </li>
    </ul>
    <div class="pageswitch">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageSwitch"
        :current-page="pageindex"
        :page-sizes="[20, 50, 80]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageindex: 1,
      pagesize: 20,
      total: 30
    };
  },
  methods: {
    pageSizeChange() {},
    pageSwitch() {}
  }
};
</script>

<style lang='less' scoped>
.sort {
  margin-bottom: 20px;
  overflow: hidden;
  p {
    margin-bottom: 20px;
    span {
      font-size: 14px;
      color: #999;
      margin-right: 30px;
      line-height: 30px;
      padding: 0 10px;
      &.title {
        color: #000;
        margin-right: 30px;
      }
      &.sel {
        cursor: pointer;
      }
      &.on {
        color: #409eff;
      }
    }
  }
}
.templatelist {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  height: 1200px;
  li {
    border: 1px solid #ddd;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    .image {
      flex-grow: 1;
      width: 100%;
      height: 100%;
      background-color: #f4f4f4;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        display: block;
      }
    }
    .tip {
      flex-basis: 60px;
      display: flex;
      align-items: center;
      .tag {
        margin-left: 10px;
      }
    }
  }
}
.pageswitch {
  text-align: center;
  margin-bottom: 100px;
}
</style>
