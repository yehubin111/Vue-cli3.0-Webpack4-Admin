<template>
  <div class="contain">
    <el-breadcrumb class="title" separator=">">
      <el-breadcrumb-item>模板管理</el-breadcrumb-item>
      <el-breadcrumb-item>上传模板</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="form">
      <el-form ref="form" :model="form" label-width="60px" label-position="left">
        <el-form-item label="尺寸">
          <el-select class="select" v-model="form.size" placeholder="请选择尺寸">
            <el-option :label="sz" :value="sz" v-for="sz in sizes" :key="sz"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业">
          <el-select class="select" v-model="form.trade" placeholder="请选择行业">
            <el-option :label="td" :value="td" v-for="td in trades" :key="td"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面">
          <div>
            <templates-upload @imgUploading="imgUploading" type="SINGLE"></templates-upload>
            <span class="size">{{form.size}}</span>
            <div slot="tip" class="el-upload__tip">建议上传模板的成品，吸引用户使用</div>
            <p class="image" v-for="img in form.face" :key="img.imageUrl">
              <span class="box">
                <img :src="form.faceurl" alt>
              </span>
              <el-progress :percentage="img.process" :status="img.process == 100?'success':''"></el-progress>
            </p>
          </div>
        </el-form-item>
        <el-form-item label="模板">
          <div>
            <templates-upload @imgUploading="tempUploading"></templates-upload>
            <span class="size">{{form.size}}</span>
            <div slot="tip" class="el-upload__tip">素材放好位置后，会讲模板覆盖在上面</div>
            <p class="image" v-for="img in form.temp" :key="img.imageUrl">
              <span class="box">
                <img :src="form.tempurl" alt>
              </span>
              <el-progress :percentage="img.process" :status="img.process == 100?'success':''"></el-progress>
            </p>
          </div>
        </el-form-item>
        <el-form-item label="logo">
          <div>
            <el-checkbox v-model="form.logo['with']">支持放置logo</el-checkbox>
            <div class="sizeinput" v-show="form.logo['with']">
              <span class="font">位置</span>
              <el-input class="smallinput" v-model="form.logo['x']" size="mini" placeholder="x"></el-input>
              <span class="between">,</span>
              <el-input class="smallinput" v-model="form.logo['y']" size="mini" placeholder="y"></el-input>
            </div>
            <div class="sizeinput" v-show="form.logo['with']">
              <span class="font">宽高</span>
              <el-input class="smallinput" v-model="form.logo['w']" size="mini" placeholder="宽"></el-input>
              <span class="between">x</span>
              <el-input class="smallinput" v-model="form.logo['h']" size="mini" placeholder="高"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="素材">
          <div>
            <div class="matter" v-for="(mt, index) in form.matter" :key="index">
              <div class="sizeinput">
                <span class="font">位置</span>
                <el-input class="smallinput" v-model="mt['x']" size="mini" placeholder="x"></el-input>
                <span class="between">,</span>
                <el-input class="smallinput" v-model="mt['y']" size="mini" placeholder="y"></el-input>
                <el-button
                  class="close"
                  type="text"
                  icon="el-icon-close"
                  v-show="form.matter.length > 1"
                ></el-button>
              </div>
              <div class="sizeinput">
                <span class="font">宽高</span>
                <el-input class="smallinput" v-model="mt['w']" size="mini" placeholder="宽"></el-input>
                <span class="between">x</span>
                <el-input class="smallinput" v-model="mt['h']" size="mini" placeholder="高"></el-input>
              </div>
            </div>
            <el-button type="primary" size="mini" @click="moreMatter">新增</el-button>
          </div>
        </el-form-item>
        <el-form-item label="标签">
          <div>
            <el-tag
              :key="tag"
              v-for="tag in form.tags"
              class="tags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >{{tag}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            ></el-input>
            <el-button
              v-if="!inputVisible && form.tags.length < 2"
              class="button-new-tag"
              size="small"
              @click="showInput"
            >新增标签</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import TemplatesUpload from "./addtemplates-upload";
import { Msgwarning } from "../../js/message";
export default {
  components: {
    TemplatesUpload
  },
  data() {
    return {
      sizes: ["1200x628", "1080x1080", "320x480", "300x250", "300x50"],
      trades: ["电商", "短视频", "社交", "工具"],
      form: {
        size: "",
        trade: "",
        face: [],
        faceurl: "",
        temp: [],
        tempurl: "",
        logo: {
          with: true,
          x: 0,
          y: 0,
          w: 0,
          h: 0
        },
        matter: [{ x: 0, y: 0, w: 0, h: 0 }],
        tags: []
      },
      inputVisible: false,
      inputValue: ""
    };
  },
  methods: {
    moreMatter() {
      this.form.matter.push({
        x: 0,
        y: 0,
        w: 0,
        h: 0
      });
    },
    tempUploading(res) {
      this.form.temp = res;
      this.form.tempurl = res[0].imageUrl;
    },
    imgUploading(res) {
      this.form.face = res;
      this.form.faceurl = res[0].imageUrl;
    },
    dataCheck() {
      if (!this.form.size) return [false, "请选择尺寸"];
      if (!this.form.trade) return [false, "请选择行业"];
      if (!this.form.faceurl) return [false, "请上传封面"];
      if (!this.form.tempurl) return [false, "请上传模板"];

      if (this.form.tags.length == 0) return [false, "请设置标签"];

      return [true];
    },
    onSubmit() {
      let check = this.dataCheck();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }

      let temparr = [];
      this.form.matter.forEach(v => {
        let obj = {
          size: v.x * 1 + "," + v.y * 1,
          width_height: v.w * 1 + "x" + v.h * 1
        };
        temparr.push(obj);
      });
      let option = {
        business: this.form.trade,
        coverImage: this.form.faceurl,
        designMaterial: this.form.tempurl,
        isLogo: this.form.logo.with * 1,
        label: this.form.tags.join(","),
        logoLocation: this.form.logo.x * 1 + "," + this.form.logo.y * 1,
        logoWidthHeight: this.form.logo.w * 1 + "x" + this.form.logo.h * 1,
        size: this.form.size,
        templateImage: JSON.parse(temparr)
      };

      this.$store.dispatch('addTemplate', option);
    },
    handleClose(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
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
  .form {
    padding-left: 300px;
    .select {
      width: 300px;
    }
    .el-upload__tip {
      line-height: 30px;
      margin-top: 0;
      color: #999;
    }
    .size {
      font-size: 12px;
      color: #999;
      margin-left: 5px;
    }
    .image {
      width: 153px;
      .box {
        width: 100px;
        height: 100px;
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
        img {
          width: 100%;
        }
      }
    }
    .sizeinput {
      .font {
        margin-right: 10px;
        font-size: 12px;
      }
      .smallinput {
        display: inline-block;
        width: 80px;
      }
      .between {
        width: 10px;
        text-align: center;
        margin: 0 5px;
        display: inline-block;
        font-size: 12px;
      }
      .close {
        margin-left: 30px;
      }
    }
    .matter {
      margin-bottom: 20px;
    }
    .tags {
      margin-right: 10px;
    }
    .input-new-tag {
      width: 100px;
    }
  }
}
</style>
