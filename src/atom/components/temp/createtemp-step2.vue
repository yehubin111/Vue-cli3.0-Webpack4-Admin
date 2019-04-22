<template>
  <div>
    <div class="contain">
      <div class="module moduleline">
        <p class="title">模板设置</p>
        <div class="upload">
          <span class="name">上传logo</span>
          <div class="uploadbtn">
            <templates-upload @imgUploading="tempUploading" :disabled="!islogo"></templates-upload>
            <div slot="tip" class="el-upload__tip">有些模板可上传logo，有些不可上传，具体位置通过后台设定</div>
          </div>
        </div>
        <ul class="imagelist">
          <li class="image" v-for="img in logo" :key="img.imageUrl">
            <p>
              <img :src="logourl" alt>
            </p>
            <el-progress :percentage="img.process" :status="img.process == 100?'success':''"></el-progress>
          </li>
        </ul>
        <div class="upload">
          <span class="name">上传图片</span>
          <div class="uploadbtn">
            <templates-upload @imgUploading="matterUploading" :disabled="!islogo" type="MUTIPLE"></templates-upload>
            <div slot="tip" class="el-upload__tip">可上传多张图片，可调整图片顺序，不支持裁剪</div>
          </div>
        </div>
        <div v-for="(matter, index) in allImages" :key="index">
          <p class="theme">第{{index + 1}}张</p>
          <ul class="imagelist">
            <li v-for="(m, idx) in matter" :key="idx">
              <p>
                <img :src="m.imageUrl" alt>
              </p>
              <el-progress :percentage="m.process" :status="m.process == 100?'success':''"></el-progress>
            </li>
          </ul>
        </div>
      </div>
      <div class="module">
        <p class="title">效果预览</p>
        <p class="restheme">第一张</p>
        <p class="resimage">
          <image-template
            id="myCanvas1"
            :baseImage="baseImage"
            :baseWidth="baseWidth"
            :baseHeight="baseHeight"
            :fileDots="fileDots"
            :fileImages="fileImages1"
            :canvasWidth="canvasWidth"
            :canvasHeight="canvasHeight"
            :logoImages="logoImages"
            :logoDots="logoDots"
            v-if="baseImage"
          ></image-template>
        </p>
        <p class="restheme">第二张</p>
        <p class="resimage">
          <image-template
            id="myCanvas2"
            :baseImage="baseImage"
            :baseWidth="baseWidth"
            :baseHeight="baseHeight"
            :fileDots="fileDots"
            :fileImages="fileImages2"
            :canvasWidth="canvasWidth"
            :canvasHeight="canvasHeight"
            :logoImages="logoImages"
            :logoDots="logoDots"
            v-if="baseImage"
          ></image-template>
        </p>
        <p class="resfont">显示前2张效果预览，共3张</p>
      </div>
    </div>
    <div class="button">
      <el-button @click="goBack">上一步</el-button>
      <el-button type="primary">生成图片</el-button>
    </div>
  </div>
</template>

<script>
import ImageTemplate from "./createtemp-template";
import TemplatesUpload from "../templates/addtemplates-upload";
import { mapState } from "vuex";
export default {
  components: {
    ImageTemplate,
    TemplatesUpload
  },
  data() {
    return {
      tempdetail: null,
      islogo: true,
      logo: [],
      logourl: "",
      images: [],
      imagecount: 0,

      baseImage: "",
      baseWidth: 0,
      baseHeight: 0,
      canvasWidth: 0,
      canvasHeight: 0,
      fileDots: [],
      fileImages1: [],
      fileImages2: [],
      allImages: [],
      logoDots: [],
      logoImages: []
    };
  },
  async mounted() {
    console.log("step 2");
    let res = await this.$store.dispatch("getTempDetail", {
      id: this.$route.params.tempid
    });
    this.baseImage = location.origin + res["designMaterial"];
    this.baseWidth = res["size"].split("x")[0] * 1;
    this.baseHeight = res["size"].split("x")[1] * 1;
    this.canvasWidth = 560;

    // logo
    this.logoDots = [];
    this.islogo = res.isLogo == "1" ? true : false;
    if (this.islogo) {
      let logoxy = res["logoLocation"].split(",").map(v => v * 1);
      let logowh = res["logoWidthHeight"].split("x").map(v => v * 1);
      let obj = {
        start: logoxy,
        end: [logoxy[0] + logowh[0], logoxy[1] + logowh[1]]
      };
      this.logoDots.push(obj);
    }

    this.fileDots = [];
    let temp = JSON.parse(res["templateImage"]);
    temp.forEach(v => {
      let xy = v.location.split(",").map(v => v * 1);
      let wh = v.width_height.split("x").map(v => v * 1);

      let obj = {
        start: xy,
        end: [xy[0] + wh[0], xy[1] + wh[1]]
      };
      this.fileDots.push(obj);
    });
    this.imagecount = this.fileDots.length;
  },
  computed: {
    ...mapState(["templatelist"])
  },
  methods: {
    tempUploading(res) {
      this.logo = res;
      this.logourl = (res[0].imageUrl ? location.origin : "") + res[0].imageUrl;
      if (this.logourl) {
        this.logoImages = [];
        this.logoImages.push(this.logourl);
      }
    },
    matterUploading(res) {
      let arr = [];
      this.allImages.flat().concat(res).forEach(v => {
        if(!arr.find(g => g.imageUrl == v.imageUrl)) {
          arr.push(v);
        }
      })
      this.allImages = [];
      this.allImages = this.allImages.concat(arr);
      this.fileImages1 = this.allImages.slice(0, this.imagecount).map(v => v.imageUrl);
      this.fileImages2 = this.allImages.slice(
        this.imagecount,
        this.imagecount * 2
      ).map(v => v.imageUrl);
    },
    goBack() {
      this.$emit("goBack");
    }
  }
};
</script>

<style lang="less" scoped>
.contain {
  display: flex;
  width: 1200px;
  margin: 0 auto;
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
        width: 153px;
        margin-bottom: 20px;
        p {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ddd;
          width: 100px;
          height: 100px;
          margin-bottom: 3px;
          img {
            width: 100%;
          }
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
.button {
  text-align: center;
  margin: 60px 0;
}
</style>
