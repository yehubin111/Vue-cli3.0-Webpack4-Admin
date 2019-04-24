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
            <templates-upload @imgUploading="matterUploading" type="MUTIPLE" ref="templatesUpload"></templates-upload>
            <div slot="tip" class="el-upload__tip">可上传多张图片，可调整图片顺序，不支持裁剪</div>
          </div>
        </div>
        <!-- <transition-group type="transition" name="flip-list"> -->
        <div v-for="(matter, index) in allImages" :key="index">
          <p class="theme">第{{index + 1}}张</p>
          <draggable tag="ul" class="imagelist" :list="matter" group="people" @change="dragImages">
            <!-- <transition-group type="transition" name="flip-list"> -->
            <li v-for="(m, idx) in matter" :key="m.name">
              <p>
                <img :src="m.imageUrl" alt>
                <span class="close" v-show="m.process == 100" @click="deleteImage(index, idx, m.imageUrl)">x</span>
              </p>
              <el-progress :percentage="m.process" :status="m.process == 100?'success':''"></el-progress>
            </li>
            <!-- </transition-group> -->
          </draggable>
        </div>
        <!-- </transition-group> -->
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
        <p class="resfont">显示前2张效果预览，共{{allImages.length}}张</p>
      </div>
    </div>
    <div class="button">
      <el-button @click="goBack">上一步</el-button>
      <el-button type="primary" @click="saveTempImages">生成图片</el-button>
    </div>
  </div>
</template>

<script>
import ImageTemplate from "./createtemp-template";
import TemplatesUpload from "../templates/addtemplates-upload";
import exportTemplate from "@/atom/js/imageTemplate";

import { mapState } from "vuex";
import { Loading } from "element-ui";
import { Msgsuccess, Msgwarning } from "../../js/message";
import draggable from "vuedraggable/src/vuedraggable";
export default {
  components: {
    ImageTemplate,
    TemplatesUpload,
    draggable
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
    this.baseImage = location.origin + res["designMaterial"]; // location.origin
    this.baseWidth = res["size"].split("x")[0] * 1;
    this.baseHeight = res["size"].split("x")[1] * 1;
    this.canvasWidth = 560; // 560 是当前位置宽度

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
    deleteImage(index, idx, url) {
      console.log(index, idx);
      this.allImages[index].splice(idx, 1);
      // 需要在删除图片之后，删除上传队列中对应的文件，防止再次上传重复添加
      this.$refs.templatesUpload.resetUploaded(url);
      // 设置canvas参数
      this.setCanvas();
    },
    setCanvas() {
      if(this.allImages[0])
        this.fileImages1 = this.allImages[0].map(v => v.imageUrl);
      if(this.allImages[1])
        this.fileImages2 = this.allImages[1].map(v => v.imageUrl);
    },
    dragImages() {
      // 设置canvas参数
      this.setCanvas();
    },
    async saveTempImages() {
      // 素材必须上传，并且不能出现素材不全的情况
      let t;
      let spe = this.allImages.find((v, i) => {
        if (v.length != 0 && v.length < this.imagecount) {
          t = i;
          return v;
        }
      });
      if (spe) {
        Msgwarning(`第${t + 1}张图片素材不全，请不全后再生成图片`);
        return;
      }

      let load = Loading.service({ fullscreen: true });
      let imagesarr = [];
      // 导出图片
      for (let i = 0; i < this.allImages.length; i++) {
        if (this.allImages[i].length == 0) continue;
        let img = await new exportTemplate({
          baseImage: this.baseImage,
          baseWidth: this.baseWidth,
          baseHeight: this.baseHeight,
          // canvasWidth: this.canvasWidth,
          logoDots: this.logoDots,
          logoImages: this.logoImages,
          fileImages: this.allImages[i].map(v => v.imageUrl),
          fileDots: this.fileDots
        });
        imagesarr.push(img);
      }
      console.log(imagesarr);
      let images = new FormData();
      imagesarr.forEach(v => {
        let bl = this.convertBase64UrlToBlob(v);
        images.append("file", bl, "file_" + Date.parse(new Date()) + ".jpg");
      });

      let res = await this.$store.dispatch("saveTempImages", { images });
      if (load) load.close();
      if (res.data) {
        Msgsuccess("制作成功");
        setTimeout(() => {
          this.$router.push({
            name: "temp"
          });
        }, 500);
      } else {
        Msgsuccess("制作失败");
      }
    },
    convertBase64UrlToBlob(urlData) {
      var arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    tempUploading(res) {
      this.logo = res;
      this.logourl = (res[0].imageUrl ? location.origin : "") + res[0].imageUrl; // location.origin
      if (this.logourl) {
        this.logoImages = [];
        this.logoImages.push(this.logourl);
      }
    },
    matterUploading(res) {
      let arr = [];
      this.allImages
        .flat()
        .concat(res)
        .forEach(v => {
          if (!arr.find(g => g.imageUrl == v.imageUrl)) {
            arr.push(v);
          }
        });
      this.allImages = arr;
      // 设置canvas参数
      this.fileImages1 = this.allImages
        .slice(0, this.imagecount)
        .map(v => v.imageUrl);
      this.fileImages2 = this.allImages
        .slice(this.imagecount, this.imagecount * 2)
        .map(v => v.imageUrl);
      // 左侧分组显示
      let list = [];
      let i = 0;
      list[i] = [];
      this.allImages.forEach(v => {
        if (list[i].length < this.imagecount) {
          list[i].push(v);
        } else {
          i++;
          list[i] = [];
          list[i].push(v);
        }
      });
      this.allImages = list;
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
          position: relative;
          img {
            width: 100%;
          }
          .close{
            width: 16px;
            height: 16px;
            background-color: #666;
            position: absolute;
            right: -16px;
            top: -1px;
            color: #fff;
            text-align: center;
            line-height: 16px;
            cursor: pointer;
            border-top-right-radius: 50%;
            border-bottom-right-radius: 50%;
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
