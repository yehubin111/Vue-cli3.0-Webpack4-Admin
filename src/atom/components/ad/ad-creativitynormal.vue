<template>
  <el-form ref="form" :model="form" label-width="80px" class="cform" label-position="left">
    <el-form-item label="主页" class="cline">
      <el-select v-model="form.homepage" placeholder="请选择主页" filterable @change="selectHomepage">
        <el-option v-if="otherpageid" :label="otherpagename" :value="otherpageid"></el-option>
        <el-option v-for="(l,index) in allpagelist" :key="index" :label="l.name" :value="l.pageId"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-show="createType == 0" label="图片" class="cline uploadfile">
      <el-button v-show="processIMG.length == 0" class="moreInfo" type="primary" size="small">上传图片</el-button>
      <vue-file-upload
        v-show="processIMG.length == 0"
        ref="vueFileUploaderSINGER"
        @matchMD5="matchMD5"
        @onAdd="onAddItem"
        @uploadPic="uploadPic"
        @uploadRes="uploadRes"
        @uploadError="uploadError"
        name="file"
        class="fileinput"
        :url="uploadFileUrl"
        :events="eventsIMG"
        :requestOptions="fileOption"
        :filters="imgfilters"
      >
        <span slot="label"></span>
      </vue-file-upload>
      <ul class="reslist">
        <li v-for="(item, index) in processIMG" :key="index">
          <div class="image">
            <p class="processname">
              <span class="el-icon-picture-outline"></span>
              <span class="name" :title="item.name">{{item.name}}</span>
              <transition name="fade">
                <span class="el-icon-check" v-show="item.process == 100"></span>
              </transition>
            </p>
            <p class="processline">
              <i class="line">
                <em :style="'width:' + item.process + '%' "></em>
              </i>
              <span>{{item.process}}%</span>
            </p>
          </div>
          <i class="el-icon-error processclose" @click="delIMG(item.file, item.name)"></i>
        </li>
      </ul>
    </el-form-item>
    <el-form-item v-show="createType == 1" label="视频" class="cline uploadfile">
      <el-button v-show="processVIO.length == 0" class="moreInfo" type="primary" size="small">上传视频</el-button>
      <vue-file-upload
        v-show="processVIO.length == 0"
        ref="vueFileUploaderVioSINGER"
        @matchMD5="matchMD5"
        @onAdd="onAddItem"
        @uploadVio="uploadVio"
        @uploadVioRes="uploadVioRes"
        @uploadVioError="uploadVioError"
        name="file"
        class="fileinput"
        :url="uploadFileUrl"
        :events="eventsVIO"
        :requestOptions="fileOption"
        :filters="videofilters"
      >
        <span slot="label"></span>
      </vue-file-upload>
      <ul class="reslist">
        <li v-for="(item, index) in processVIO" :key="index" @mouseover="fmvideoname = item.name">
          <div class="video">
            <p class="processname">
              <span class="el-icon-document"></span>
              <span class="name" :title="item.name">{{item.name}}</span>
              <transition name="fade">
                <span class="el-icon-check" v-show="item.process == 100"></span>
              </transition>
            </p>
            <p class="processline">
              <i class="line">
                <em :style="'width:' + item.process + '%' "></em>
              </i>
              <span>{{item.process}}%</span>
            </p>
          </div>
          <el-button type="text" class="fmbutton" v-show="!item.fmname">上传封面图</el-button>
          <div class="uploadFmbox">
            <vue-file-upload
              v-show="!item.fmname"
              @matchMD5="matchMD5"
              @uploadFm="uploadFm"
              @uploadFmRes="uploadFmRes"
              @uploadFmError="uploadFmError"
              name="file"
              class="fileinputfm"
              :url="uploadFileUrl"
              :events="eventsFM"
              :requestOptions="fileOptionFM"
              :filters="imgfilters"
            >
              <span slot="label"></span>
            </vue-file-upload>
          </div>
          <div class="videofm" v-show="item.fmname">
            <p class="processname">
              <span class="el-icon-picture-outline"></span>
              <span class="name" :title="item.fmname">{{item.fmname}}</span>
              <transition name="fade">
                <span class="el-icon-check" v-show="item.fmprocess == 100"></span>
              </transition>
            </p>
            <p class="processline">
              <i class="line">
                <em :style="'width:' + item.fmprocess + '%' "></em>
              </i>
              <span>{{item.fmprocess}}%</span>
            </p>
          </div>
          <i class="el-icon-error processclose processvideo" @click="delVIO(item.file, item.name)"></i>
        </li>
      </ul>
    </el-form-item>
    <el-form-item label="文本" class="cline">
      <el-input
        type="textarea"
        v-model="form.desc"
        class="textarea"
        placeholder="请输入文字说明，介绍推广内容"
        :autosize="{ minRows: 3.5, maxRows: 3.5 }"
      ></el-input>
    </el-form-item>
    <el-form-item label="标题" class="cline">
      <el-input v-model="form.title" placeholder="请输入标题"></el-input>
    </el-form-item>
    <el-form-item label="行动号召" class="cline">
      <el-select v-model="form.actions" placeholder="行动号召">
        <el-option v-for="(l, index) in allactions" :key="index" :label="l.name" :value="l.code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="deeplink" class="cline">
      <el-input v-model="form.deeplink" placeholder="可跳转到APP指定页面，选填，为空则仅下载APP"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import VueFileUpload from "vue-file-upload";
import BMF from "browser-md5-file";
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning, Msgerror } from "../../js/message";
import baseurl from "../../js/baseurl";
let bmf = new BMF();
export default {
  props: ["createType", "createObject"],
  components: {
    VueFileUpload
  },
  data() {
    return {
      form: {
        homepage: "",
        deeplink: "",
        desc: "",
        title: "",
        actions: ""
      },
      otherpageid: "",
      otherpagename: "",
      msg: {
        homepage: "请选择主页",
        desc: "请输入文本",
        title: "请输入标题",
        actions: "请选择行动号召",
        deeplink: "",
        imginfo: "请上传图片",
        videoinfo: "请上传视频",
        fminfo: "请上传封面图"
      },
      processIMG: [],
      processVIO: [],
      disfile: null, // 正在上传的file
      xtoken: localStorage.getItem("atom_token"),
      fileOption: {
        headers: {
          "X-Token": localStorage.getItem("atom_token")
        }
      },
      fileOptionFM: {
        headers: {
          "X-Token": localStorage.getItem("atom_token")
        },
        formData: {
          type: "2"
        }
      },
      imgfilters: [
        {
          name: "imageFilter",
          fn(file) {
            var type =
              "|" + file.type.slice(file.type.lastIndexOf("/") + 1) + "|";
            return "|jpg|png|jpeg|bmp|gif|".indexOf(type) !== -1;
          }
        }
      ],
      videofilters: [
        {
          name: "videoFilter",
          fn(file) {
            var type =
              "|" + file.type.slice(file.type.lastIndexOf("/") + 1) + "|";
            return (
              "|vob|ifo|mpg|mpeg|dat|mp4|3gp|mov|rm|ram|rmvb|wmv|asf|avi|asx|".indexOf(
                type
              ) !== -1
            );
          }
        }
      ],
      eventsIMG: {
        onAddFileSuccess(file) {
          let fl = file.file;
          let md5 = bmf.md5(
            fl,
            (err, md5) => {
              // console.log("md5:", md5);
              this.vm.$emit("matchMD5", md5, file, "img");
            },
            progress => {
              // console.log("progress number:", progress);
            }
          );
        },
        onProgressUpload(file, process) {
          this.vm.$emit("uploadPic", file, process);
        },
        onSuccessUpload(file, response, status, headers) {
          file.remove();

          if (response.code != 0) {
            Msgerror(response.msg);
            this.vm.$emit("uploadError", response, file);
            return;
          }
          this.vm.$emit("uploadRes", response);
        }
      },
      eventsVIO: {
        onAddFileSuccess(file) {
          let fl = file.file;
          let md5 = bmf.md5(
            fl,
            (err, md5) => {
              // console.log("md5:", md5);
              this.vm.$emit("matchMD5", md5, file, "video");
            },
            progress => {
              // console.log("progress number:", progress);
            }
          );
        },
        onProgressUpload(file, process) {
          this.vm.$emit("uploadVio", file, process);
        },
        onSuccessUpload(file, response, status, headers) {
          file.remove();

          if (response.code != 0) {
            Msgerror(response.msg);
            this.vm.$emit("uploadVioError", response, file);
            return;
          }
          this.vm.$emit("uploadVioRes", response);
        }
      },
      fmvideoname: "",
      eventsFM: {
        onAddFileSuccess(file) {
          let fl = file.file;
          let md5 = bmf.md5(
            fl,
            (err, md5) => {
              // console.log("md5:", md5);
              this.vm.$emit("matchMD5", md5, file, "fm");
            },
            progress => {
              // console.log("progress number:", progress);
            }
          );
        },
        onProgressUpload(file, process) {
          this.vm.$emit("uploadFm", file, process);
        },
        onSuccessUpload(file, response, status, headers) {
          if (response.code != 0) {
            Msgerror(response.msg);
            this.vm.$emit("uploadFmError", response, file);
            return;
          }
          this.vm.$emit("uploadFmRes", response);
        }
      }
    };
  },
  computed: {
    ...mapState(["allpagelist", "adcreateadd", "wantupload", "edittype"]),
    ...mapGetters(["allactions"]),
    uploadFileUrl() {
      return `${baseurl[process.env.VUE_APP_URLBASE].UPLOAD_URL}/file/`;
    }
  },
  mounted() {
    let n = this.createObject;
    if (n) {
      if (!this.allpagelist.find(v => v.pageId == n.pageId)) {
        this.otherpagename = n.pageName ? n.pageName : "";
        this.otherpageid = n.pageId ? n.pageId : "";
      }

      if (this.edittype == this.createType) {
        this.dataSet(n);
      }
    }
  },
  watch: {
    async createObject(n, o) {
      console.log(n);
      // 阻塞 100ms
      await this.$barrageTime(100);

      // 初始化
      this.reset();

      if (n && !n.cards && !n.assetFeedSpec) {
        if (!this.allpagelist.find(v => v.pageId == n.pageId)) {
          this.otherpageid = n.pageId ? n.pageId : "";
          this.otherpagename = n.pageName ? n.pageName : "";
        }
        // 20190130新增逻辑，编辑单个广告组，初始化保存该创意类型，切换的时候数据填充
        this.SETSTATE({ k: "edittype", v: this.createType });
        this.dataSet(n);
      }
    },
    createType(n, o) {
      // 初始化
      this.reset();
      // 20190130新增逻辑，如果切回该广告创意原来的类型，则数据继续填充
      if (this.edittype == n && this.createObject) {
        this.dataSet(this.createObject);
      }
    },
    "form.homepage": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.deeplink": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.desc": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.title": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.actions": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    processIMG() {
      this.$emit("changeEdit", true);
    },
    processVIO() {
      this.$emit("changeEdit", true);
    },
    wantupload(n, v) {
      console.log("create-add wantupload:", n);
      if (n != 0 && n == this.uploadsize) {
        console.log("%ccreate-add all ready", "color: red");
        this.$refs[this.dom].uploadAll();
      }
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    dataSet(n) {
      this.form.homepage = n.pageId ? n.pageId : "";
      this.form.deeplink = n.deeplink ? n.deeplink : "";
      this.form.desc = n.creativityText ? n.creativityText : "";
      this.form.title = n.creativityTitle ? n.creativityTitle : "";
      this.form.actions = n.actionCallOn ? n.actionCallOn : "";

      if (n.videoId) {
        // 单视频创意
        this.processVIO.push({
          name: n.videoName ? n.videoName : n.videoId,
          process: 100,
          file: null,
          size: 0,
          videoUrl: "",
          videoHash: "",
          videoId: n.videoId,
          fmname: n.imageName ? n.imageName : n.imageHash,
          fmprocess: 100,
          fmUrl: n.imageUrl,
          fmHash: n.imageHash
        });
      } else {
        // 单图片创意
        this.processIMG.push({
          name: n.imageName ? n.imageName : n.imageHash,
          process: 100,
          size: 0,
          file: null,
          imageUrl: "",
          imageHash: n.imageHash
        });
      }
    },
    reset() {
      // 初始化
      // 如果当前file存在且未成功上传且未取消
      if (this.disfile && !this.disfile.isSuccess && !this.disfile.isCancel)
        this.disfile.cancel();

      this.processIMG = [];
      this.processVIO = [];
      this.form = {
        homepage: "",
        deeplink: "",
        desc: "",
        title: "",
        actions: ""
      };

      this.SETSTATE({ k: "adcreateadd", v: true });
    },
    initData() {
      this.otherpageid = "";
      this.otherpagename = "";
    },
    getCheckData() {
      let data = this.form;

      if (!this.adcreateadd) return [false, "图片/视频正在上传中..."];
      if (data["homepage"] == "") return [false, this.msg["homepage"]];
      if (this.createType == 0 && this.processIMG.length == 0)
        return [false, this.msg["imginfo"]];
      if (this.createType == 1 && this.processVIO.length == 0)
        return [false, this.msg["videoinfo"]];
      if (this.createType == 1 && !this.processVIO[0].fmname)
        return [false, this.msg["fminfo"]];
      if (data["desc"] == "") return [false, this.msg["desc"]];
      if (data["title"] == "") return [false, this.msg["title"]];
      if (data["actions"] === "") return [false, this.msg["actions"]];

      let creative = this.createObject
        ? this.createObject
        : {
            actionCallOn: 0,
            actionCallOnName: "",
            card: "",
            cards: "",
            classify: "",
            countryId: "",
            countryName: "",
            createTime: "",
            creater: "",
            creativityName: "",
            creativityText: "",
            creativityTitle: "",
            creativityType: 0,
            deeplink: "",
            fbAccountId: "",
            fbAdId: "",
            fbCreativeId: "",
            id: 0,
            image: "",
            imageHash: "",
            imageName: "",
            imageUrl: "",
            pageId: "",
            pageLogo: "",
            pageName: "",
            platFromUrl: "",
            projectId: 0,
            sex: "",
            status: 0,
            token: "",
            videoId: "",
            videoName: "",
            videoUrl: ""
          };
      let homepage = this.allpagelist.filter(
        v => v.pageId == this.form.homepage
      )[0];
      let action = this.allactions.filter(v => v.code == this.form.actions)[0];
      creative.pageId = homepage ? homepage.pageId : this.otherpageid;
      creative.pageLogo = homepage ? homepage.picture : "";
      creative.pageName = homepage ? homepage.name : this.otherpagename;
      creative.actionCallOn = action.code;
      creative.actionCallOnName = action.name;
      creative.creativityText = this.form.desc;
      creative.creativityTitle = this.form.title;
      creative.token = this.xtoken;
      creative.deeplink = this.form.deeplink;
      let imgobj, vioobj;

      // 创建的时候无需传imagehash videoid，编辑的时候无需传imageurl videourl

      creative.imageUrl =
        this.createType == 1
          ? this.processVIO[0].fmUrl
          : this.processIMG[0].imageUrl;
      creative.videoUrl =
        this.createType == 1 ? this.processVIO[0].videoUrl : "";
      if (!creative.videoUrl) {
        creative.videoId =
          this.createType == 1 ? this.processVIO[0].videoId : "";
      } else {
        creative.videoId = "";
      }
      if (!creative.imageUrl) {
        creative.imageHash =
          this.createType == 1
            ? this.processVIO[0].fmHash
            : this.processIMG[0].imageHash;
      } else {
        creative.imageHash = "";
      }

      return [true, creative];
    },
    onAddItem(files) {
      console.log(files);
      this.SETSTATE({ k: "wantupload", v: 0 });
      this.uploadsize = files.length;
      console.log("create-add this.uploadsize:", this.uploadsize);
    },
    /**
     * 20181107新增，图片视频素材库
     * 选择文件之后，JS获取MD5值（brower-file-md5），传到后台，如果已上传过，则进度直接为100%
     */
    matchMD5(md5, file, type) {
      this.dom =
        type == "img" ? "vueFileUploaderSINGER" : "vueFileUploaderVioSINGER";

      this.$store.dispatch("matchMutiFileMD5", {
        md5: [md5],
        file,
        list: type == "img" ? this.processIMG : this.processVIO,
        type,
        on: "adcreateadd",
        vdname: this.fmvideoname
      });
    },
    // 封面图上传错误回调
    uploadFmError(res, file) {
      this.SETSTATE({ k: "adcreateadd", v: true });
      this.processVIO.forEach(v => {
        if (v.fmname == file.name) {
          v.fmname = "";
          v.fmprocess = "";
        }
      });
    },
    // 封面图上传完成回调
    uploadFmRes(res) {
      this.SETSTATE({ k: "adcreateadd", v: true });

      this.processVIO.forEach(v => {
        if (v.fmname == res.data[0].originName) {
          v.fmUrl = res.data[0].targetName;
          v.fmHash = res.data[0].md5;
        }
      });
    },
    // 封面图上传中回调
    uploadFm(file, process) {
      this.disfile = file;

      let self = this;
      this.SETSTATE({ k: "adcreateadd", v: false });

      /**
       * 匹配视频文件名称，找到对应封面图存放位置
       * 实现process进度条效果
       * fmvideoname值在点击打开文件上传窗口时获取
       */
      let obj = null;
      let oj = null;
      this.processVIO.forEach((v, i) => {
        if (v.name == this.fmvideoname) {
          // idx = i;
          obj = this.processVIO[i];
          oj = {
            ...obj,
            fmname: file.name,
            fmprocess: process
          };

          this.processVIO.splice(i, 1);
          this.processVIO.splice(i, 0, oj);
        }
      });
    },
    uploadVioError(res, file) {
      this.SETSTATE({ k: "adcreateadd", v: true });
      this.processVIO = this.processVIO.filter(v => v.name != file.name);
    },
    uploadVioRes(res) {
      this.SETSTATE({ k: "adcreateadd", v: true });

      this.processVIO.forEach(v => {
        if (v.name == res.data[0].originName) {
          v.videoUrl = res.data[0].targetName;
          v.videoHash = res.data[0].md5;
        }
      });
    },
    uploadVio(file, process) {
      this.disfile = file;
      this.SETSTATE({ k: "adcreateadd", v: false });

      let obj = {};
      obj.name = file.name;
      obj.process = process;
      obj.file = file;
      obj.size = file.size;
      obj.fmname = "";
      obj.fmprocess = 0;
      obj.videoId = "";
      /**
       * 对应数组中 不存在当前文件名字的数据，则添加对象
       * 已存在则动态改变process值
       * 实现process进度条效果
       */
      this.processVIO.forEach(v => {
        if (v.name == file.name) {
          v.process = process;
        }
      });
      if (!this.processVIO.find(v => v.name == file.name)) {
        this.processVIO.push(obj);
      }
    },
    delVIO(file, name) {
      if (file && file.isUploading) {
        file.cancel();
        file.remove();
      }
      this.processVIO = this.processVIO.filter(v => v.name != name);

      this.SETSTATE({ k: "adcreateadd", v: true });
    },
    uploadRes(res) {
      this.SETSTATE({ k: "adcreateadd", v: true });

      this.processIMG.forEach(v => {
        if (v.name == res.data[0].originName) {
          v.imageUrl = res.data[0].targetName;
          v.imageHash = res.data[0].md5;
        }
      });
    },
    uploadError(res, file) {
      this.SETSTATE({ k: "adcreateadd", v: true });
      this.processIMG = this.processIMG.filter(v => v.name != file.name);
    },
    uploadPic(file, process) {
      this.disfile = file;
      this.SETSTATE({ k: "adcreateadd", v: false });

      let obj = {};
      obj.name = file.name;
      obj.process = process;
      obj.size = file.size;
      obj.file = file;

      this.processIMG.forEach(v => {
        if (v.name == file.name) {
          v.process = process;
        }
      });
      if (!this.processIMG.find(v => v.name == file.name)) {
        this.processIMG.push(obj);
      }
    },
    delIMG(file, name) {
      if (file && file.isUploading) {
        file.cancel();
        file.remove();
      }
      this.processIMG = this.processIMG.filter(v => v.name != name);

      this.SETSTATE({ k: "adcreateadd", v: true });
    },
    selectHomepage() {
      let h = this.allpagelist.filter(v => v.pageId == this.form.homepage)[0];
      if (h && !h.insId) {
        this.form.homepage = "";
        Msgwarning("此主页无PBIA，请先同步");
      }
    }
  }
};
</script>
<style lang="less">
.el-form-item .cform .el-form-item {
  margin-bottom: 22px;
}
</style>

<style lang="less" scoped>
.reslist {
  // width: 150px;
  li {
    margin-top: 10px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    .processname {
      font-size: 14px;
      line-height: 24px;
      padding-left: 7px;
      overflow: hidden;
      .el-icon-picture-outline,
      .el-icon-document {
        float: left;
        line-height: 24px;
        margin-right: 5px;
      }
      .el-icon-check {
        color: #67c23a;
        font-size: 14px;
        text-align: center;
        font-weight: bold;
        float: left;
        line-height: 24px;
      }
      .name {
        max-width: 100px;
        height: 24px;
        overflow: hidden;
        display: inline-block;
        float: left;
        margin-right: 5px;
        text-overflow: ellipsis;
      }
    }
    .processline {
      font-size: 12px;
      padding: 0 7px;
      overflow: hidden;
      line-height: 18px;
      i {
        width: 100px;
        height: 4px;
        display: block;
        float: left;
        margin-top: 7px;
        em {
          background-color: #67c23a;
          display: block;
          height: 100%;
        }
      }
      span {
        float: right;
        width: 32px;
        height: 18px;
        line-height: 18px;
        display: block;
      }
    }
    .processclose {
      position: absolute;
      left: 160px;
      top: 50%;
      transform: translate(0, -50%);
      color: #909399;
      cursor: pointer;
      &.processvideo {
        left: 320px;
      }
    }
    .fmbutton {
      padding: 16px 0;
      cursor: inherit;
    }
    .video,
    .videofm,
    .image {
      width: 150px;
      float: left;
      padding: 3px 0;
      margin-right: 10px;
      background-color: #f0f2f5;
    }
    .videofm {
      background-color: #fff;
    }
    .image {
      width: 150px;
    }
  }
}
.search {
  width: 100%;
}
.cbutton {
  width: 100%;
  float: left;
  padding-right: 80px;
  box-sizing: border-box;
  text-align: center;
}
.uploadfile {
  height: 110px;
  overflow: hidden;
}
.textarea {
  max-height: 85px;
  min-height: 85px;
}
.cform {
  overflow: hidden;
}
.el-upload__tip {
  line-height: 30px;
  margin-top: 0;
}
.upload-video,
.upload-fpic {
  float: left;
  margin-right: 20px;
}
.tag {
  padding-left: 80px;
  //   float: left;
  //   width: 50%;
  box-sizing: border-box;
  position: absolute;
  top: 10px;
  height: 76px;
  overflow-y: auto;
  margin-right: 40px;
  .evtag {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
