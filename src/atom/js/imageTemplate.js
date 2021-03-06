class exportTemplate {
    constructor({ 
        baseImage = '', 
        baseWidth = 0, 
        baseHeight = 0, 
        canvasWidth = 0, 
        canvasHeight = 0,
        fileImages = [], 
        fileDots = [], 
        logoDots = [], 
        logoImages = [],
        writingColor = [],
        writingDots = [],
        writingText,
        writingSize = [],
        writingFamily = ['黑体']
    }) {
        this.baseImage = baseImage; // 背景图地址
        this.baseWidth = baseWidth; // 背景图宽度
        this.baseHeight = baseHeight; // 背景图高度
        this.canvasWidth = canvasWidth; // canvas宽度
        this.canvasHeight = canvasHeight; // canvas高度
        this.canvaswidth = canvasWidth ? canvasWidth : baseWidth; // canvas实际宽度
        this.ratio = this.canvaswidth / this.baseWidth;
        this.canvasheight = this.baseHeight * this.ratio; // canvas实际高度
        this.fileImages = fileImages; // 所有图片路径
        this.fileDots = fileDots; // 图片空位坐标 [{ left, top }, { left, top }]
        this.logoDots = logoDots; // LOGO图片路径
        this.logoImages = logoImages; // LOGO坐标 [{ left, top }, { left, top }]
        this.writingColor = writingColor, // 文案颜色 ['#000', '#fff']
        this.writingDots = writingDots; // 文案位置 [{start: [left ,top], size: [width, height]}]
        this.writingText = writingText; // 文案内容 {text1: '123', text2: '456'}
        this.writingSize = writingSize; // 文案大小 [20, 30]
        this.writingFamily = writingFamily; // 文案字体 ['黑体']

        return this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvaswidth;
        this.canvas.height = this.canvasheight;
        this.ctx = this.canvas.getContext('2d');

        // 文本信息
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        // 填充图片
        return this.drawImages();
    }

    async drawImages() {
        let me = this;
        // 清空canvas
        this.ctx.clearRect(0, 0, this.canvaswidth, this.canvasheight);
        // 超過位置最大數量，截取前幾張
        let maxcount = this.fileDots.length;
        this.fileImages = this.fileImages.slice(0, maxcount);
        // 在指定位置渲染圖片
        for (let i = 0; i < this.fileImages.length; i++) {
            let start = this.fileDots[i].start;
            let end = this.fileDots[i].end;
            // 計算圖片寬高
            let width = end[0] - start[0];
            let height = end[1] - start[1];

            // 图片在使用之前先进行裁剪
            let origin = await this.imageSnip(this.fileImages[i], width, height);

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
                        resolve();
                    };
                });
            })();
        }
        // 渲染背景
        await this.drawBackground();
        // 渲染LOGO
        if (this.logoDots.length != 0) await this.drawLogo();
        // 渲染文案
        if (this.writingDots && this.writingDots.length != 0) this.drawText();
        // 导出
        return this.exportTemplate();
    }
    async drawLogo() {
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
            
            return new Promise((resolve, reject) => {
                let img = new Image();
                // img.crossOrigin = "Anonymous";
                img.src = images[i];
                img.onload = () => {
                    me.ctx.drawImage(
                        img,
                        start[0] * me.ratio,
                        start[1] * me.ratio,
                        width * me.ratio,
                        height * me.ratio
                    );
                    resolve();
                };
            });
        }
    }
    drawBackground() { 
        let me = this;
        return new Promise((resolve, reject) => {
            let img = new Image();
            // img.crossOrigin = "Anonymous";
            img.src = this.baseImage;
            img.onload = () => {
                me.ctx.drawImage(img, 0, 0, me.canvaswidth, me.canvasheight);
                resolve();
            };
        });
    }
    drawText() {
        let me = this;

        this.writingDots.forEach((g, p) => {
          let maxwidth = g.size[0];
          me.ctx.font = `${me.writingSize[p] * me.ratio}px ${me.writingFamily[p] ? me.writingFamily[p] : me.writingFamily[0]}`;
          me.ctx.fillStyle = me.writingColor[p];
          // 居中显示，起始位置重新计算，取中间点
          let x = g.start[0] + g.size[0] / 2;
          let y = g.start[1] + g.size[1] / 2;
          me.ctx.fillText(
            this.writingText[`text${p + 1}`],
            x * me.ratio,
            y * me.ratio,
            maxwidth * me.ratio
          );
        });
      }

    exportTemplate() {
        let url = this.canvas.toDataURL('image/jpeg');
        return url;
    }

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

export default exportTemplate;