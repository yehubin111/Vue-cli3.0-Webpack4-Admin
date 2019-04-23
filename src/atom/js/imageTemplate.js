class exportTemplate {
    constructor({ baseImage = '', baseWidth = 0, baseHeight = 0, canvasWidth = 0, canvasHeight = 0, fileImages = [], fileDots = [], logoDots = [], logoImages = [] }) {
        this.baseImage = baseImage; // 背景图地址
        this.baseWidth = baseWidth; // 背景图宽度
        this.baseHeight = baseHeight; // 背景图高度
        this.canvasWidth = canvasWidth; // canvas宽度
        this.canvasHeight = canvasHeight; // canvas高度
        this.canvaswidth = canvasWidth ? canvasWidth : baseWidth; // canvas实际宽度
        this.canvasheight = canvasHeight ? canvasHeight : baseHeight; // canvas实际高度
        this.ratio = this.canvaswidth / this.baseWidth;
        this.fileImages = fileImages; // 所有图片路径
        this.fileDots = fileDots; // 图片空位坐标 [{ left, top }, { left, top }]
        this.logoDots = logoDots; // LOGO图片路径
        this.logoImages = logoImages; // LOGO坐标 [{ left, top }, { left, top }]

        return this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvaswidth;
        this.canvas.height = this.canvasheight;
        this.ctx = this.canvas.getContext('2d');
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

            await (() => {
                return new Promise((resolve, reject) => {
                    let img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.src = this.fileImages[i];
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
        // 导出
        return this.exportTemplate();
    }
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
                    resolve();
                };
            });
        }
    }
    drawBackground() {
        let me = this;
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = this.baseImage;
            img.onload = () => {
                me.ctx.drawImage(img, 0, 0, me.canvaswidth, me.canvasheight);
                resolve();
            };
        });
    }

    exportTemplate() {
        let url = this.canvas.toDataURL('image/jpeg');
        return url;
    }
}

export default exportTemplate;