<template>
  <div>
    <p id="writingBox" style="position: absolute;top: -1000px"></p>
    <div class="contain">
      <div class="module moduleline">
        <p class="title">模板设置</p>
        <div class="upload">
          <span class="name">上传logo</span>
          <div class="uploadbtn">
            <templates-upload @imgUploading="tempUploading" :disabled="!islogo"></templates-upload>
            <div slot="tip" class="el-upload__tip">可不上传，建议分辨率{{!islogo ? '--' : logoResolution}}</div>
          </div>
        </div>
        <ul class="imagelist">
          <li class="image" v-for="img in logo" :key="img.imageUrl">
            <p>
              <span class="imgbox">
                <img :src="logourl" alt>
              </span>
            </p>
            <el-progress :percentage="img.process" :status="img.process == 100?'success':''"></el-progress>
          </li>
        </ul>
        <div class="upload" v-if="writingDots.length > 0">
          <span class="name">文案</span>
          <div>
            <p class="writingcontent">
              <el-checkbox
                v-model="commonuse"
                :disabled="writingDots.length == 0"
                @change="writeStatus"
              >文案共用</el-checkbox>
            </p>
            <div class="writeline">
              <span class="font">文案一</span>
              <el-input
                v-model="commonwrite1"
                @input="writingChange(1)"
                :disabled="!commonuse || writingDots.length == 0"
                size="mini"
                placeholder="请填写文案"
              ></el-input>
            </div>
            <div class="writeline" v-show="writingDots.length > 1">
              <span class="font">文案二</span>
              <el-input
                v-model="commonwrite2"
                :disabled="!commonuse"
                @input="writingChange(2)"
                size="mini"
                placeholder="请填写文案"
              ></el-input>
            </div>
          </div>
        </div>
        <div class="upload">
          <span class="name">上传图片</span>
          <div class="uploadbtn">
            <templates-upload @imgUploading="matterUploading" type="MUTIPLE" ref="templatesUpload"></templates-upload>
            <div slot="tip" class="el-upload__tip">建议分辨率{{imageResolution}}</div>
          </div>
        </div>
        <!-- <transition-group type="transition" name="flip-list"> -->
        <div class="matter" v-for="(matter, index) in allImages" :key="index">
          <p class="theme">第{{index + 1}}张</p>
          <draggable tag="ul" class="imagelist" :list="matter" group="people" @change="dragImages">
            <!-- <transition-group type="transition" name="flip-list"> -->
            <li v-for="(m, idx) in matter" :key="m.name">
              <p>
                <span class="imgbox">
                  <img :src="m.imageUrl" alt>
                </span>
                <span
                  class="close"
                  v-show="m.process == 100"
                  @click="deleteImage(index, idx, m.imageUrl)"
                >x</span>
              </p>
              <el-progress :percentage="m.process" :status="m.process == 100?'success':''"></el-progress>
            </li>
            <!-- </transition-group> -->
          </draggable>
          <div class="write" v-if="writelist[index]" v-show="!commonuse">
            <div class="writeline">
              <span class="font">文案一</span>
              <el-input
                v-model="writelist[index].text1"
                @input="ownerWriteChange(index, 1)"
                size="mini"
                placeholder="请填写文案"
              ></el-input>
            </div>
            <div class="writeline" v-show="writingDots.length > 1">
              <span class="font">文案二</span>
              <el-input
                v-model="writelist[index].text2"
                @input="ownerWriteChange(index, 2)"
                size="mini"
                placeholder="请填写文案"
              ></el-input>
            </div>
          </div>
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
            :writingText="writingText1"
            :writingDots="writingDots"
            :writingColor="writingColor"
            :writingSize="writingSize1"
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
            :writingText="writingText2"
            :writingDots="writingDots"
            :writingColor="writingColor"
            :writingSize="writingSize2"
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
  import { clearTimeout, setTimeout } from "timers";

  export default {
    components: {
      ImageTemplate,
      TemplatesUpload,
      draggable
    },
    data() {
      return {
        timer: null,
        tempdetail: null,
        islogo: true,
        logo: [],
        logourl: "",
        images: [],
        imagecount: 0,
        commonuse: true,
        commonwrite1: "",
        commonwrite2: "",
        writelist: [],
        writingbasesize: [],
        writingbasetext: {},

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
        logoImages: [],
        logoResolution: "", // Logo分辨率
        imageResolution: "", // 素材分辨率
        writingText1: {}, // 文案
        writingText2: {}, // 文案
        writingDots: [], // 文案位置
        writingColor: [],
        writingSize1: [],
        writingSize2: []
      };
    },
    async mounted() {
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
        this.logoResolution = res["logoWidthHeight"];
        let logoxy = res["logoLocation"].split(",").map(v => v * 1);
        let logowh = res["logoWidthHeight"].split("x").map(v => v * 1);
        let obj = {
          start: logoxy,
          end: [logoxy[0] + logowh[0], logoxy[1] + logowh[1]]
        };
        this.logoDots.push(obj);
      }

      // 文案
      let writing = res["templateText"] ? JSON.parse(res["templateText"]) : [];
      this.writingDots = [];
      this.writingColor = [];
      this.writingSize1 = [];
      this.writingSize2 = [];
      this.writingbasesize = [];
      writing.forEach((v, i) => {
        let xy = v.location.split(",").map(g => g * 1);
        let wh = v.width_height.split("x").map(g => g * 1);
        this.writingDots.push({
          start: [xy[0], xy[1]],
          size: [wh[0], wh[1]]
        });
        this.writingText1[`text${i + 1}`] = v.text;
        this.writingText2[`text${i + 1}`] = v.text;
        this.writingbasetext[`text${i + 1}`] = v.text;
        this.writingColor.push(v.colour);
        this.writingSize1.push(this.getFontSize(v.text, v.text_size, wh[0]));
        this.writingSize2.push(this.getFontSize(v.text, v.text_size, wh[0]));
        this.writingbasesize.push(v.text_size);
      });

      this.fileDots = [];
      let temp = JSON.parse(res["templateImage"]);
      temp.forEach((v, i) => {
        if (i == 0) {
          this.imageResolution = v.width_height;
        }
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
      ownerWriteChange(index, i) {
        /**
         * v2.2.4
         * 非文案共用情况
         * @case 第三张图片开始，文案改变不影响图片渲染
         * @case 改变某一张图片下的文案，只会重新渲染当前图片
         */
        if (index > 1) return;

        if (this.timer) clearTimeout(this.timer);

        let me = this;
        this.timer = setTimeout(() => {
          let text = Object.assign({}, me[`writingText${index + 1}`]);
          text[`text${i}`] = me.writelist[index][`text${i}`];
          me[`writingSize${index + 1}`][i - 1] = me.getFontSize(
            text[`text${i}`],
            me.writingbasesize[i - 1],
            me.writingDots[i - 1].size[0]
          );
          me[`writingText${index + 1}`] = text;
        }, 300);
      },
      writeStatus() {
        /**
         * v2.2.4
         * 切换文案共用逻辑
         * @case 如果勾选，则获取文案栏文本框内容，空白则显示默认文案
         * @case 如果取消勾选，则统一置空，需填写下发文案文本框
         */
        if (this.commonuse) {
          this.writingChange(1);
          if (this.writingDots.length > 1) {
            this.writingChange(2);
          }
        } else {
          let blankwrite = Object.assign({}, this.writingbasetext);
          for (let i in blankwrite) {
            blankwrite[i] = "";
          }
          this.writingText1 = blankwrite;
          this.writingText2 = blankwrite;

          this.writelist.forEach(v => {
            for (let i in v) {
              v[i] = "";
            }
          });
        }
      },
      getFontSize(text, basesize, maxwidth) {
        /**
         * v2.2.4
         * 根据文字数量获取文字大小
         * @case 文字总宽度大于设定最大宽度，则按比例缩小
         * @case 文字总宽度小于设定最大宽度，则返回原尺寸文字
         */
        let wtbox = document.getElementById("writingBox");
        wtbox.style.fontSize = `${basesize}px`;
        wtbox.innerText = text;
        let wd = wtbox.clientWidth;
        if (wd > maxwidth) {
          return Math.ceil((maxwidth * basesize) / wd);
        } else {
          return basesize;
        }
      },
      writingChange(i) {
        if (this.timer) clearTimeout(this.timer);

        let me = this;
        this.timer = setTimeout(() => {
          let text = Object.assign({}, me.writingText1);
          text[`text${i}`] = me[`commonwrite${i}`]
            ? me[`commonwrite${i}`]
            : me.writingbasetext[`text${i}`];
          me.writingSize1[i - 1] = me.getFontSize(
            me[`commonwrite${i}`],
            me.writingbasesize[i - 1],
            me.writingDots[i - 1].size[0]
          );
          me.writingSize2[i - 1] = me.getFontSize(
            me[`commonwrite${i}`],
            me.writingbasesize[i - 1],
            me.writingDots[i - 1].size[0]
          );
          me.writingText1 = text;
          me.writingText2 = text;
        }, 300);
      },
      deleteImage(index, idx, url) {
        this.allImages[index].splice(idx, 1);
        // 需要在删除图片之后，删除上传队列中对应的文件，防止再次上传重复添加
        this.$refs.templatesUpload.resetUploaded(url);
        // 设置canvas参数
        this.setCanvas();
      },
      setCanvas() {
        if (this.allImages[0])
          this.fileImages1 = this.allImages[0].map(v => v.imageUrl);
        if (this.allImages[1])
          this.fileImages2 = this.allImages[1].map(v => v.imageUrl);
      },
      dragImages() {
        // 设置canvas参数
        this.setCanvas();
      },
      async saveTempImages() {
        // 文案不能为空
        if (this.commonuse) {
          if (
            this.commonwrite1.trim() == "" ||
            (this.writingDots.length > 1 && this.commonwrite2.trim() == "")
          ) {
            Msgwarning(`文案不能为空`);
            return;
          }
        } else {
        }
        // 素材必须上传，并且不能出现素材不全的情况
        let t;
        let spe = this.allImages.find((v, i) => {
          if (v.length != 0 && v.length < this.imagecount) {
            t = i;
            return v;
          }
          if (
            v.length != 0 &&
            (this.writelist[i].text1.trim() == "" ||
              this.writelist[i].text2.trim() == "")
          ) {
            t = i;
            return v;
          }
        });
        if (spe) {
          Msgwarning(`第${t + 1}张图片素材或者文案不全，请补全后再生成图片`);
          return;
        }

        let load = Loading.service({ fullscreen: true });
        let imagesarr = [];
        let me = this;
        // 导出图片
        for (let i = 0; i < this.allImages.length; i++) {
          if (this.allImages[i].length == 0) continue;

          let text = {},
            size = [];
          if (this.commonuse) {
            text = this.writingText1;
            size = this.writingSize1;
          } else {
            text = this.writelist[i];
            for (let l in text) {
              size.push(
                me.getFontSize(
                  text[l],
                  me.writingbasesize[l],
                  me.writingDots[l].size[0]
                )
              );
            }
          }

          let img = await new exportTemplate({
            baseImage: this.baseImage,
            baseWidth: this.baseWidth,
            baseHeight: this.baseHeight,
            // canvasWidth: this.canvasWidth,
            logoDots: this.logoDots,
            logoImages: this.logoImages,
            fileImages: this.allImages[i].map(v => v.imageUrl),
            fileDots: this.fileDots,
            writingColor: this.writingColor,
            writingDots: this.writingDots,
            writingText: text,
            writingSize: size
          });
          imagesarr.push(img);
        }
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
          Msgerror("制作失败");
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

        // // 开发环境用
        // this.allImages.forEach(v => {
        //   if(v.imageUrl.indexOf('http') == -1)
        //     v.imageUrl = 'http://172.31.1.76' + v.imageUrl;
        // })

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

          if (!this.writelist[i]) {
            this.writelist.push({
              text1: "",
              text2: ""
            });
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
        width: 60px;
      }
      .uploadbtn {
      }
      .writingcontent {
        margin-bottom: 10px;
      }
      .writeline {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .font {
          width: 4em;
          margin-right: 10px;
        }
      }
    }
    .matter {
      .write {
        margin-bottom: 30px;
        .writeline {
          width: 200px;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding-left: 75px;
          .font {
            width: 4em;
            margin-right: 10px;
          }
        }
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
          border: 1px solid #ddd;
          width: 100px;
          height: 100px;
          margin-bottom: 3px;
          position: relative;
          // overflow: hidden;
          .imgbox {
            display: block;
            width: 100%;
            height: 100%;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 100%;
            }
          }
          .close {
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
