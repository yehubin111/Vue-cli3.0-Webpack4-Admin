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
            <el-option :label="sz.name" :value="sz.name" v-for="sz in tempsize" :key="sz.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业">
          <el-select class="select" v-model="form.trade" placeholder="请选择行业">
            <el-option :label="td.name" :value="td.name" v-for="td in temptrade" :key="td.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面">
          <div class="upbox">
            <templates-upload @imgUploading="imgUploading" class="uploadline"></templates-upload>
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
          <div class="upbox">
            <templates-upload @imgUploading="tempUploading" class="uploadline"></templates-upload>
            <span class="size">{{form.size}}</span>
            <div slot="tip" class="el-upload__tip">素材放好位置后，会将模板覆盖在上面</div>
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
              <el-input-number
                class="smallinput"
                size="mini"
                v-model="form.logo['x']"
                :min="0"
                placeholder="x"
              ></el-input-number>
              <span class="between">,</span>
              <el-input-number
                class="smallinput"
                size="mini"
                v-model="form.logo['y']"
                :min="0"
                placeholder="y"
              ></el-input-number>
            </div>
            <div class="sizeinput" v-show="form.logo['with']">
              <span class="font">宽高</span>
              <el-input-number
                class="smallinput"
                size="mini"
                v-model="form.logo['w']"
                :min="0"
                placeholder="宽"
              ></el-input-number>
              <span class="between">x</span>
              <el-input-number
                class="smallinput"
                size="mini"
                v-model="form.logo['h']"
                :min="0"
                placeholder="高"
              ></el-input-number>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="素材">
          <div>
            <div class="matter" v-for="(mt, index) in form.matter" :key="index">
              <div class="sizeinput">
                <span class="font">位置</span>
                <el-input-number
                  class="smallinput"
                  size="mini"
                  v-model="mt['x']"
                  :min="0"
                  placeholder="x"
                ></el-input-number>
                <span class="between">,</span>
                <el-input-number
                  class="smallinput"
                  size="mini"
                  v-model="mt['y']"
                  :min="0"
                  placeholder="y"
                ></el-input-number>
                <el-button
                  class="close"
                  type="text"
                  icon="el-icon-close"
                  v-show="form.matter.length > 1"
                  @click="deleteMatter(index)"
                ></el-button>
              </div>
              <div class="sizeinput">
                <span class="font">宽高</span>
                <el-input-number
                  class="smallinput"
                  size="mini"
                  v-model="mt['w']"
                  :min="0"
                  placeholder="宽"
                ></el-input-number>
                <span class="between">x</span>
                <el-input-number
                  class="smallinput"
                  size="mini"
                  v-model="mt['h']"
                  :min="0"
                  placeholder="高"
                ></el-input-number>
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
import { mapState } from "vuex";
export default {
  components: {
    TemplatesUpload
  },
  data() {
    return {
      editid: "",
      form: {
        size: "",
        trade: "",
        face: [],
        faceurl: "",
        facewidth: 0,
        faceheight: 0,
        temp: [],
        tempurl: "",
        tempwidth: 0,
        tempheight: 0,
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
  mounted() {
    console.log(this.$route.params);
    this.editid = this.$route.params.eid;
    if (this.editid) this.$store.dispatch("getTempDetail", { id: this.editid });
    // 获取尺寸列表
    this.$store.dispatch("getSizeTrade", "template_size");
    // 获取行业列表
    this.$store.dispatch("getSizeTrade", "template_business");
  },
  computed: {
    ...mapState(["tempsize", "temptrade", "tempdetail"])
  },
  watch: {
    tempdetail(n, v) {
      if (n) {
        this.form.size = n.size;
        this.form.trade = n.business;
        this.form.face = [
          {
            process: 100,
            imageUrl: n.coverImage
          }
        ];
        this.form.faceurl = n.coverImage;
        this.form.temp = [
          {
            process: 100,
            imageUrl: n.designMaterial
          }
        ];
        this.form.tempurl = n.designMaterial;
        this.form.logo["with"] = n.isLogo == 1 ? true : false;
        if (n.isLogo == 1) {
          let xy = n.logoLocation.split(",");
          this.form.logo["x"] = xy[0];
          this.form.logo["y"] = xy[1];
          let wh = n.logoWidthHeight.split("x");
          this.form.logo["w"] = wh[0];
          this.form.logo["h"] = wh[1];
        }
        let temp = JSON.parse(n.templateImage);
        this.form.matter = [];
        temp.forEach(v => {
          let xy = v.location.split(",");
          let wh = v.width_height.split("x");
          let obj = {
            x: xy[0],
            y: xy[1],
            w: wh[0],
            h: wh[1]
          };
          this.form.matter.push(obj);
        });
        this.form.tags = n.label.split(",");
      }
    }
  },
  methods: {
    deleteMatter(idx) {
      this.form.matter.splice(idx, 1);
    },
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
      this.form.tempwidth = res[0].imageWidth;
      this.form.tempheight = res[0].imageHeight;
    },
    imgUploading(res) {
      this.form.face = res;
      this.form.faceurl = res[0].imageUrl;
      this.form.facewidth = res[0].imageWidth;
      this.form.faceheight = res[0].imageHeight;
    },
    dataCheck() {
      if (!this.form.size) return [false, "请选择尺寸"];
      if (!this.form.trade) return [false, "请选择行业"];
      if (!this.form.faceurl) return [false, "请上传封面"];
      let size = this.form.size.split("x");
      if (this.form.facewidth != size[0] || this.form.faceheight != size[1])
        return [false, "封面图尺寸与所选尺寸不一致，请重新上传"];
      if (!this.form.tempurl) return [false, "请上传模板"];
      if (this.form.tempwidth != size[0] || this.form.tempheight != size[1])
        return [false, "模板尺寸与所选尺寸不一致，请重新上传"];
      if (
        this.form.logo["with"] &&
        (this.form.logo["x"] === undefined ||
          this.form.logo["y"] === undefined ||
          this.form.logo["w"] === undefined ||
          this.form.logo["h"] === undefined)
      )
        return [false, "logo位置或者宽高不能为空"];
      if (
        this.form.matter.find(
          v =>
            v["x"] === undefined ||
            v["y"] === undefined ||
            v["w"] === undefined ||
            v["h"] === undefined
        )
      )
        return [false, "素材位置或者宽高不能为空"];
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
          location: v.x * 1 + "," + v.y * 1,
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
        templateImage: JSON.stringify(temparr)
      };
      if (this.editid) {
        option.id = this.editid;
        this.$store.dispatch("editTemplate", { option, route: this.$router });
      } else {
        this.$store.dispatch("addTemplate", { option, route: this.$router });
      }
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
    .upbox {
      // overflow: hidden;
    }
    .upload {
      // margin-top: 5px;
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
        width: 100px;
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
