<template>
  <div>
    <div class="contain">
      <div class="module moduleline">
        <p class="title">模板设置</p>
        <div class="upload">
          <span class="name">上传logo</span>
          <div class="uploadbtn">
            <el-button size="small" type="primary">上传</el-button>
            <div slot="tip" class="el-upload__tip">有些模板可上传logo，有些不可上传，具体位置通过后台设定</div>
          </div>
        </div>
        <ul class="imagelist">
          <li>
            <img
              src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
              alt
            >
          </li>
        </ul>
        <div class="upload">
          <span class="name">上传图片</span>
          <div class="uploadbtn">
            <el-button size="small" type="primary">上传</el-button>
            <div slot="tip" class="el-upload__tip">可上传多张图片，可调整图片顺序，不支持裁剪</div>
          </div>
        </div>
        <p class="theme">第一张</p>
        <ul class="imagelist">
          <li>
            <img
              src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
              alt
            >
          </li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <p class="theme">第二张</p>
        <ul class="imagelist">
          <li>
            <img
              src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
              alt
            >
          </li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="module">
        <p class="title">效果预览</p>
        <p class="restheme">第一张</p>
        <p class="resimage">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <p class="restheme">第二张</p>
        <p class="resimage">
          <img
            src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
            alt
          >
        </p>
        <p class="resfont">显示前2张效果预览，共3张</p>
      </div>
    </div>
    <div class="button">
      <el-button>上一步</el-button>
      <el-button type="primary">生成图片</el-button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.contain {
  display: flex;
  .module {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 0;
    padding-left: 40px;
    overflow: hidden;
    .title {
      font-size: 26px;
      margin-bottom: 30px;
    }
    .upload {
      display: flex;
      margin-bottom: 20px;
      .name {
        font-size: 14px;
        margin-right: 20px;
      }
      .uploadbtn {
      }
    }
    .theme {
      padding-left: 75px;
      margin-bottom: 10px;
      color: #999;
    }
    .restheme {
      margin-bottom: 10px;
      color: #999;
    }
    .imagelist {
      overflow: hidden;
      padding-left: 75px;
      li {
        float: left;
        width: 100px;
        height: 100px;
        border: 1px solid #ddd;
        margin-right: 20px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 100%;
        }
      }
    }
    &.moduleline {
      border-right: 1px solid #ddd;
    }
    .resimage {
      width: 100%;
      margin-bottom: 20px;
      img {
        width: 100%;
        display: block;
      }
    }
    .resfont {
      font-size: 14px;
    }
  }
}
.button{
    text-align: center;
    margin: 60px 0;
}
</style>
