<template>
  <canvas :id="id"></canvas>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "myCanvas"
    },
    // 背景圖url
    baseImage: {
      type: String,
      required: true
    },
    // 背景圖寬度
    baseWidth: {
      type: Number,
      required: true
    },
    // 背景圖高度
    baseHeight: {
      type: Number,
      required: true
    },
    // 模板寬度，用於展示，默認等於背景圖寬度
    canvasWidth: {
      type: Number
    },
    // 模板高度，用於展示，默認等於背景圖高度
    canvasHeight: {
      type: Number
    },
    // 填充的圖片列表
    fileImages: {
      type: Array,
      required: true
    },
    // 填充的圖片位置列表 [{start: [], end: {}}]
    fileDots: {
      type: Array,
      required: true
    },
    // logo
    logoImages: {
      type: Array
    },
    // logo位置
    logoDots: {
      type: Array
    }
  },
  data() {
    return {
      canvas: null,
      //   excanvas: null,
      ctx: null,
      //   exctx: null,
      canvaswidth: 0,
      canvasheight: 0,
      ratio: 1
    };
  },
  watch: {
    fileImages(n, o) {
      this.drawImages();
    },
    logoImages(n, o) {
      this.drawImages();
    }
  },
  mounted() {
    this.canvaswidth = this.canvasWidth ? this.canvasWidth : this.baseWidth;
    // 获取比例系数
    this.ratio = this.canvaswidth / this.baseWidth;
    this.canvasheight = this.baseHeight * this.ratio;
    // 显示用的canvas
    this.canvas = document.getElementById(this.id);
    this.canvas.width = this.canvaswidth;
    this.canvas.height = this.canvasheight;
    // 导出用的canvas
    // this.excanvas = document.createElement('canvas');
    // this.excanvas.width = this.baseWidth;
    // this.excanvas.height = this.baseHeight;

    this.ctx = this.canvas.getContext("2d");
    // this.exctx = this.excanvas.getContext("2d");

    // 背景色
    this.ctx.fillStyle = "#f4f4f4";
    this.ctx.fillRect(0, 0, this.canvaswidth, this.canvasheight);
    // 渲染背景
    this.drawBackground();
  },
  methods: {
    async drawImages() {
      console.log("draw images");
      let me = this;
      // 清空canvas
      this.ctx.clearRect(0, 0, this.canvaswidth, this.canvasheight);
      //   this.exctx.clearRect(0, 0, this.baseWidth, this.baseHeight);
      // 超過位置最大數量，截取前幾張
      let maxcount = this.fileDots.length;
      let images = this.fileImages.slice(0, maxcount);
      // 在指定位置渲染圖片
      for (let i = 0; i < images.length; i++) {
        let start = this.fileDots[i].start;
        let end = this.fileDots[i].end;
        // 計算圖片寬高
        let width = end[0] - start[0];
        let height = end[1] - start[1];

        // 图片在使用之前先进行裁剪
        let origin = await this.imageSnip(images[i], width, height);

        await (() => {
          return new Promise((resolve, reject) => {
            let img = new Image();
            // img.crossOrigin = "Anonymous";
            img.src = origin;
            img.onload = () => {
              me.ctx.drawImage(
                img,
                start[0] * me.ratio,
                start[1] * me.ratio,
                width * me.ratio,
                height * me.ratio
              );
              //   me.exctx.drawImage(img, start[0], start[1], width, height);
              resolve();
            };
          });
        })();
      }
      // 渲染背景
      await this.drawBackground();
      // 渲染logo
      if (this.logoDots.length != 0) this.drawLogo();
    },
    drawLogo() {
      // 超過位置最大數量，截取前幾張
      let me = this;
      let maxcount = this.logoDots.length;
      let images = this.logoImages.slice(0, maxcount);

      for (let i = 0; i < images.length; i++) {
        let start = this.logoDots[i].start;
        let end = this.logoDots[i].end;
        // 計算圖片寬高
        let width = end[0] - start[0];
        let height = end[1] - start[1];

        // 图片在使用之前先进行裁剪
        let origin = await this.imageSnip(images[i], width, height);

        let img = new Image();
        // img.crossOrigin = "Anonymous";
        img.src = origin;
        img.onload = () => {
          me.ctx.drawImage(
            img,
            start[0] * me.ratio,
            start[1] * me.ratio,
            width * me.ratio,
            height * me.ratio
          );
        };
      }
    },
    drawBackground() {
      console.log("draw background");
      let me = this;
      let img = new Image();
      // img.crossOrigin = "Anonymous";
      img.src = this.baseImage;
      return new Promise((resolve, reject) => {
        img.onload = () => {
          me.ctx.drawImage(img, 0, 0, this.canvaswidth, this.canvasheight);
          resolve();
        };
      });
    },
    exportTemplate() {
      let url = this.canvas.toDataURL("image/jpeg");
      let res = new Image();
      res.src = url;
    },
    async imageSnip(url, width, height) {
      /**
       * 图片裁剪逻辑
       * 1.按照短边比例缩放图片
       * 2.把图片合适位置渲染到画布上
       * 3.导出图片url
       */
      return await new Promise((resolve, reject) => {
        let img = new Image();
        // img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
          if (img.width == width && img.height == height) {
            resolve(url);
          }
          /**
           * 判断短边
           * 如果计算出的等比高度，大于图片实际高度，则表示高是短边，反之则宽是短边
           * 然后按照短边的比例缩放图片
           */
          let scaleheight = img.width * (height / width);
          let ratio = 1;
          if (scaleheight > img.height) {
            ratio = img.height / height;
          } else {
            ratio = img.width / width;
          }
          let realwidth = img.width / ratio;
          let realheight = img.height / ratio;
          /**
           * 先缩放图片
           */
          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");
          canvas.width = realwidth;
          canvas.height = realheight;
          ctx.drawImage(img, 0, 0, realwidth, realheight );
          let scaleurl = canvas.toDataURL("image/jpeg");
          /**
           * 使用缩放后的图片截取合适内容
           */
          let img2 = new Image();
          img2.src = scaleurl;
          img2.onload = () => {
            ctx.clearRect(0, 0, realwidth, realheight);

            let destx = realwidth / 2 - width / 2;
            let desty = realheight / 2 - height / 2;
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img2, destx, desty, width, height, 0, 0, width, height );

            url = canvas.toDataURL("image/jpeg");
            resolve(url);
          }
        };
      });
    }
  }
};
</script>

<style lang="less" scoped>
canvas {
  display: block;
}
</style>

