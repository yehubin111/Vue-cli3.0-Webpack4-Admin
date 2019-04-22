<template>
  <canvas :id="id"></canvas>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: 'myCanvas'
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
      this.drawImages(n);
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
    async drawImages(images) {
      console.log('draw');
      let me = this;
      // 清空canvas
      this.ctx.clearRect(0, 0, this.canvaswidth, this.canvasheight);
      //   this.exctx.clearRect(0, 0, this.baseWidth, this.baseHeight);
      // 超過位置最大數量，截取前幾張
      let maxcount = this.fileDots.length;
      images = images.slice(0, maxcount);
      // 在指定位置渲染圖片
      for (let i = 0; i < images.length; i++) {
        let start = this.fileDots[i].start;
        let end = this.fileDots[i].end;
        // 計算圖片寬高
        let width = end[0] - start[0];
        let height = end[1] - start[1];

        await (() => {
          return new Promise((resolve, reject) => {
            let img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = images[i];
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
      this.drawBackground();
    },
    drawBackground() {
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = this.baseImage;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.canvaswidth, this.canvasheight);
        // this.exctx.drawImage(img, 0, 0, this.baseWidth, this.baseHeight);
      };
    },
    exportTemplate() {
      let url = this.canvas.toDataURL("image/jpeg");
      let res = new Image();
      res.src = url;
    }
  }
};
</script>

<style lang="less" scoped>
canvas{
  display: block;
}
</style>

