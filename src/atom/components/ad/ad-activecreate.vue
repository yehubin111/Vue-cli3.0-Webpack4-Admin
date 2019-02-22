<template>
  <el-form ref="form" :model="form" label-width="100px" class="cform">
    <el-form-item label="主页" class="cline">
      <el-select v-model="form.homepage" filterable placeholder="请选择主页" @change="selectHomepage">
        <el-option v-if="otherpageid" :label="otherpagename" :value="otherpageid"></el-option>
        <el-option v-for="(l,index) in allpagelist" :key="index" :label="l.name" :value="l.pageId"></el-option>
      </el-select>
    </el-form-item>
    <!--图片或视频-->
    <el-form-item label="图片或视频" class="cline uploadfile" v-if="createType == 0">
      <el-tooltip
        class="item"
        effect="dark"
        content="亮起日期有数据，建议上传无数据的日期。上传亮起日期的留存，旧数据会被覆盖"
        placement="top-start"
      >
        <div slot="content">图片总数：小于 10
          <br>推荐图片参数：宽高比 1.9:1
          <br>如果包含 Instagram 版位，请考虑使用正方形图片，以获得更好的表现
          <br>推荐图片尺寸：1,200 x 628 像素
          <br>视频：如果包含 Instagram 版位，则只能使用正方形视频或横向视频
        </div>
        <i class="el-icon-question elnotice"></i>
      </el-tooltip>
      <el-button
        class="moreInfo"
        type="primary"
        size="small"
        :disabled="processIMG.length >= 10 && processVIO.length >= 10"
      >上传</el-button>
      <vue-file-upload
        ref="vueFileUploader"
        v-show="processIMG.length < 10 || processVIO.length < 10"
        @uploadPic="uploadPic"
        @onAdd="onAddItem"
        @checkUploadPic="checkUploadPic"
        @uploadRes="uploadRes"
        @uploadError="uploadError"
        name="file"
        class="fileinput"
        :url="uploadFileUrl"
        :events="eventsIMG"
        multiple
        :requestOptions="fileOption"
        :filters="matterfilters"
      >
        <span slot="label"></span>
      </vue-file-upload>
      <span class="fonttip">{{processIMG.length}}/10个图片，{{processVIO.length}}/10个视频</span>
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
      <ul class="reslist">
        <li v-for="(item, index) in processVIO" :key="index">
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
          <!-- <el-button type="text" class="fmbutton" v-show="!item.fmname">上传封面图</el-button>
          <div class="uploadFmbox" @click="showUploading(item.name)">
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
              multiple
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
          </div>-->
          <i class="el-icon-error processclose" @click="delIMG(item.file, item.name)"></i>
        </li>
      </ul>
    </el-form-item>
    <!--图片或视频-->
    <!--轮播图片-->
    <el-form-item label="图片" class="cline uploadfile" v-else>
      <el-tooltip
        class="item"
        effect="dark"
        content="亮起日期有数据，建议上传无数据的日期。上传亮起日期的留存，旧数据会被覆盖"
        placement="top-start"
      >
        <div slot="content">图片总数：小于 10
          <br>推荐图片参数：宽高比 1.9:1
          <br>如果包含 Instagram 版位，请考虑使用正方形图片，以获得更好的表现
          <br>推荐图片尺寸：1,200 x 628 像素
        </div>
        <i class="el-icon-question elnotice2"></i>
      </el-tooltip>
      <el-button
        class="moreInfo"
        type="primary"
        size="small"
        :disabled="processIMG.length >= 10"
      >上传图片</el-button>
      <vue-file-upload
        ref="vueFileUploaderLB"
        v-show="processIMG.length < 10"
        @uploadPic="uploadPic"
        @onAdd="onAddItem"
        @checkUploadPic="checkUploadPic"
        @uploadRes="uploadRes"
        @uploadError="uploadError"
        name="file"
        class="fileinput"
        :url="uploadFileUrl"
        :events="eventsIMG"
        multiple
        :requestOptions="fileOption"
        :filters="imgfilters"
      >
        <span slot="label"></span>
      </vue-file-upload>
      <span class="fonttip">{{processIMG.length}}/10个图片</span>
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
    <!--轮播图片-->
    <el-form-item label="文本" class="cline">
      <div class="descarea" v-show="form.descarr.length > 0">
        <div class="tag">
          <span class="evtag" v-for="item in form.descarr" :key="item">
            {{item}}
            <i class="el-icon-error" @click="delDesc(item)"></i>
          </span>
        </div>
      </div>
      <el-input
        type="textarea"
        v-model="form.desc"
        placeholder="请输入文字说明，介绍推广内容"
        maxlength="1024"
        class="textarea"
        :autosize="{ minRows: 3.5, maxRows: 3.5 }"
      ></el-input>
      <el-button
        class="moreInfo"
        type="primary"
        size="small"
        @click="addDesc"
        :disabled="form.descarr.length >= 5"
      >新增文本</el-button>
      <span class="fonttip">{{form.descarr.length}}/5个文本</span>
    </el-form-item>
    <el-form-item label="标题" class="cartitle">
      <div class="descarea" v-show="form.titlearr.length > 0">
        <div class="tag">
          <span class="evtag" v-for="item in form.titlearr" :key="item">
            {{item}}
            <i class="el-icon-error" @click="delTitle(item)"></i>
          </span>
        </div>
      </div>
      <el-input v-model="form.title" placeholder="请输入标题" maxlength="255"></el-input>
      <el-button
        class="moreInfo"
        type="primary"
        size="small"
        @click="addTitle"
        :disabled="form.titlearr.length >= 5"
      >新增标题</el-button>
      <span class="fonttip">{{form.titlearr.length}}/5个标题</span>
    </el-form-item>
    <el-form-item label="行动号召" class="cline">
      <el-select
        v-model="form.actionArr"
        multiple
        filterable
        remote
        placeholder="行动号召"
        @change="actionChange"
      >
        <el-option
          v-for="item in allactions"
          :key="item.code"
          :label="item.name"
          :value="item.name"
          :disabled="form.actionArr.length >= 5"
        ></el-option>
      </el-select>
      <span class="fonttip">{{form.actionArr.length}}/5个行动号召</span>
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
import { Msgwarning, Msgsuccess, Msgerror } from "../../js/message";
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
        descarr: [],
        desc: "",
        titlearr: [],
        title: "",
        actionArr: [],
        deeplink: ""
      },
      msg: {
        homepage: "请选择主页",
        imgvideo: "请上传图片",
        videoUrl: "请上传视频",
        imginfo: "请上传至少2张图片",
        matterinfo: "请上传图片或视频",
        desc: "请输入文本",
        title: "请输入标题",
        actions: "请选择行动号召"
      },
      otherpageid: "",
      otherpagename: "",
      disfile: null, // 正在上传的file
      fileOption: {
        headers: {
          "X-Token": localStorage.getItem("atom_token")
        }
      },
      // 图片/视频上传格式过滤
      matterfilters: [
        {
          name: "imageFilter",
          fn(file) {
            var type =
              "|" + file.type.slice(file.type.lastIndexOf("/") + 1) + "|";
            return (
              "|jpg|png|jpeg|bmp|gif|vob|ifo|mpg|mpeg|dat|mp4|3gp|mov|rm|ram|rmvb|wmv|asf|avi|asx|".indexOf(
                type
              ) !== -1
            );
          }
        }
      ],
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
      uploadsize: 0, // 当前选择的将要上传的文件数量
      dom: "", // 当前使用的vue-file-upload ref
      processIMG: [],
      processVIO: [],
      eventsIMG: {
        onProgressUpload(file, process) {
          console.log(file.name);
          this.vm.$emit("uploadPic", file, process);
        },
        onSuccessUpload(file, response, status, headers) {
          if (response.code != 0) {
            Msgerror(response.msg);
            this.vm.$emit("uploadError", response, file);
            return;
          }
          this.vm.$emit("uploadRes", response, file);
          // 上传完成之后需要从队列中清除
          console.log("%cremove", "color: red");
          file.remove();
        },
        onAddFileSuccess(file) {
          console.log("%cwaiting", "color: red");
          this.vm.$emit("checkUploadPic", file);
        }
      }
      // fmvideoname: "",
      // eventsFM: {
      //   onProgressUpload(file, process) {
      //     this.vm.$emit("uploadFm", file, process);
      //   },
      //   onSuccessUpload(file, response, status, headers) {
      //     if (response.code != 0) {
      //       Msgerror(response.msg);
      //       this.vm.$emit("uploadFmError", response, file);
      //       return;
      //     }
      //     this.vm.$emit("uploadFmRes", response);
      //   },
      //   onAddFileSuccess(file) {
      //     let fl = file.file;
      //     let md5 = bmf.md5(
      //       fl,
      //       (err, md5) => {
      //         // console.log('md5:', md5);
      //         this.vm.$emit("matchMD5", md5, file, "fm");
      //       },
      //       progress => {
      //         // console.log('progress number:', progress);
      //       }
      //     );
      //   }
      // }
    };
  },
  computed: {
    ...mapState([
      "allpagelist",
      "allactions",
      "wantupload",
      "withcreatead",
      "edittype"
    ]),
    uploadFileUrl() {
      return `${baseurl[process.env.VUE_APP_URLBASE].UPLOAD_URL}/file/`;
    }
  },
  watch: {
    async createObject(n, o) {
      // 阻塞 100ms
      await this.$barrageTime(100);

      if (n && n.assetFeedSpec) {
        if (!this.allpagelist.find(v => v.pageId == n.pageId)) {
          this.otherpageid = n.pageId ? n.pageId : "";
          this.otherpagename = n.pageName ? n.pageName : "";
        }
        // 20190130新增逻辑，编辑单个广告，初始化保存该创意类型，切换的时候数据填充
        this.SETSTATE({ k: "edittype", v: this.createType });
        this.dataSet(n);
      }
    },
    createType(n, o) {
      // 初始化
      this.reset();
      // 20190130新增逻辑，如果切回该广告创意原来的类型，则数据继续填充
      if (this.edittype == n) {
        this.dataSet(this.createObject);
      }
    },
    wantupload(n, v) {
      console.log("wantupload:", n);
      if (n != 0 && n == this.uploadsize) {
        console.log("%call ready", "color: red");
        this.$refs[this.dom].uploadAll();
      }
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    dataSet(n) {
      let create = JSON.parse(n.assetFeedSpec);
      this.form.homepage = n.pageId ? n.pageId : "";
      this.form.deeplink = create.link_urls[0].deeplink_url;
      this.form.descarr = create.bodies.map(v => v.text);
      this.form.titlearr = create.titles.map(v => v.text);
      this.form.actionArr = create.call_to_action_types;

      if (create.images) {
        create.images.forEach(v => {
          this.processIMG.push({
            name: v.hash,
            process: 100,
            size: 0,
            file: null,
            imageUrl: "",
            imageHash: v.hash
          });
        });
      }

      if (this.createType == 0 && create.videos) {
        create.videos.forEach(v => {
          // 图片和视频创意
          this.processVIO.push({
            name: v.video_id,
            process: 100,
            file: null,
            size: 0,
            videoUrl: "",
            videoHash: "",
            videoId: v.video_id
          });
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
        descarr: [],
        desc: "",
        titlearr: [],
        title: "",
        actionArr: [],
        deeplink: ""
      };

      this.SETSTATE({ k: "withcreatead", v: true });
    },
    selectHomepage() {
      let h = this.allpagelist.filter(v => v.pageId == this.form.homepage)[0];
      if (!h.insId) {
        this.form.homepage = "";
        Msgwarning("此主页无PBIA，请先同步");
      }
    },
    actionChange() {},
    getCheckData() {
      let data = this.form;

      if (!this.withcreatead) return [false, "图片/视频正在上传中..."];

      if (data["homepage"] == "") return [false, this.msg["homepage"]];
      if (this.createType == 1 && this.processIMG.length < 2)
        return [false, this.msg["imginfo"]];
      if (
        this.createType == 0 &&
        this.processIMG.length == 0 &&
        this.processVIO.length == 0
      )
        return [false, this.msg["matterinfo"]];
      if (data["descarr"].length == 0) return [false, this.msg["desc"]];
      if (data["titlearr"].length == 0) return [false, this.msg["title"]];
      if (data["actionArr"].length == 0) return [false, this.msg["actions"]];

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
            videoUrl: "",
            // 新增字段
            images: "",
            videos: "",
            bodies: "",
            callToActionTypes: "",
            titles: "",
            adFormats: ""
          };

      let homepage = this.allpagelist.filter(
        v => v.pageId == this.form.homepage
      )[0];
      // let action = this.allactions.filter(v => v.code == this.form.actions)[0];
      creative.callToActionTypes = this.form.actionArr
        .map(v => v.replace(/\s/g, "_").toLocaleUpperCase())
        .join(",");
      creative.deeplink = this.form.deeplink;
      creative.pageId = homepage ? homepage.pageId : this.otherpageid;
      creative.pageLogo = homepage ? homepage.picture : "";
      creative.pageName = homepage ? homepage.name : this.otherpagename;
      creative.bodies = this.form.descarr.join("/");
      creative.titles = this.form.titlearr.join("/");
      creative.adFormats =
        this.createType == 0 ? "AUTOMATIC_FORMAT" : "CAROUSEL_IMAGE";
      creative.token = this.xtoken;

      // 创建的时候无需传imagehash videoid，编辑的时候无需传imageurl videourl
      let newimg = this.processIMG.filter(v => v.imageUrl);
      let oldimg = this.processIMG.filter(v => !v.imageUrl && v.imageHash);
      creative.images = newimg.length > 0 ? newimg.map(v => v.imageUrl).join(',') : "";
      creative.imageHashs =
        oldimg.length > 0 ? oldimg.map(v => v.imageHash).join(',') : "";

      if (this.createType == 0) {
        let newvideo = this.processVIO.filter(v => v.videoUrl);
        let oldvideo = this.processVIO.filter(v => !v.videoUrl && v.videoId);
        creative.videos =
          newvideo.length > 0 ? newvideo.map(v => v.videoUrl).join(',') : "";
        creative.videoIds =
          oldvideo.length > 0 ? oldvideo.map(v => v.videoId).join(',') : "";
      } else {
        creative.videos = "";
        creative.videoIds = "";
      }

      return [true, creative];
    },
    delTitle(item) {
      this.form.titlearr = this.form.titlearr.filter(v => v != item);
    },
    addTitle() {
      if (this.form.title.trim() == "") {
        Msgwarning("请在文本框内输入想要添加的标题名称");
        return;
      }
      if (this.form.title.trim().length > 255) {
        Msgwarning("文本不超过 255 个字符");
        return;
      }

      let str = this.form.title.trim();
      this.form.titlearr = this.form.titlearr.filter(v => v != str);
      this.form.titlearr.push(str);

      this.form.title = "";
    },
    delDesc(item) {
      this.form.descarr = this.form.descarr.filter(v => v != item);
    },
    addDesc() {
      if (this.form.desc.trim() == "") {
        Msgwarning("请在文本框内输入想要添加的文本");
        return;
      }
      if (this.form.desc.trim().length > 1024) {
        Msgwarning("文本不超过 1024 个字符");
        return;
      }

      let str = this.form.desc.trim();
      this.form.descarr = this.form.descarr.filter(v => v != str);
      this.form.descarr.push(str);

      this.form.desc = "";
    },
    /**
     * 20181107新增，图片视频素材库
     * 选择文件之后，JS获取MD5值（brower-file-md5），传到后台，如果已上传过，则进度直接为100%
     */
    matchMD5(md5, file, type) {
      // console.log(md5);
      this.dom = "vueFileUploader";
      // 轮播模式
      if (this.createType == "1") this.dom += "LB";
      this.$store.dispatch("matchMutiFileMD5", {
        md5: [md5],
        file,
        list: type == "img" ? this.processIMG : this.processVIO,
        type,
        on: "withcreatead",
        vdname: this.fmvideoname,
        maxcount: type == "fm" ? 0 : 10,
        callback: () => {}
      });
    },
    onAddItem(files) {
      console.log(files);
      this.SETSTATE({ k: "wantupload", v: 0 });
      this.SETSTATE({ k: "imgspwant", v: 0 });
      this.SETSTATE({ k: "viospwant", v: 0 });
      this.uploadsize = files.length;
      console.log("this.uploadsize:", this.uploadsize);
    },
    changeFocusaccount() {},
    // uploadFmError(res, file) {
    //   this.SETSTATE({ k: "withcreatead", v: true });
    //   this.processVIO.forEach(v => {
    //     if (v.fmname == file.name) {
    //       v.fmname = "";
    //       v.fmprocess = "";
    //     }
    //   });
    // },
    // uploadFmRes(res) {
    //   this.SETSTATE({ k: "withcreatead", v: true });

    //   this.processVIO.forEach(v => {
    //     if (v.fmname == res.data[0].originName) {
    //       v.fmUrl = res.data[0].targetName;
    //       v.fmHash = res.data[0].md5;
    //     }
    //   });

    //   // if (uploading) uploading.close();
    //   console.log(this.processVIO);
    // },
    showUploading(name) {
      this.fmvideoname = name;
    },
    // uploadFm(file, process) {
    //   this.disfile = file;

    //   let self = this;
    //   this.SETSTATE({ k: "withcreatead", v: false });

    //   // let idx = 0;
    //   let obj = null;
    //   let oj = null;
    //   this.processVIO.forEach((v, i) => {
    //     if (v.name == this.fmvideoname) {
    //       // idx = i;
    //       obj = this.processVIO[i];
    //       oj = {
    //         ...obj,
    //         fmname: file.name,
    //         fmprocess: process
    //       };

    //       this.processVIO.splice(i, 1);
    //       this.processVIO.splice(i, 0, oj);
    //     }
    //   });
    // },
    uploadError(res, file) {
      this.SETSTATE({ k: "withcreatead", v: true });
      this.processIMG = this.processIMG.filter(v => v.name != file.name);
      this.processVIO = this.processVIO.filter(v => v.name != file.name);
    },
    uploadRes(res, file) {
      this.SETSTATE({ k: "withcreatead", v: true });
      if (/jpg|png|jpeg|bmp|gif/.test(file.type)) {
        this.processIMG.forEach(v => {
          if (v.name == res.data[0].originName) {
            v.imageUrl = res.data[0].targetName;
            v.imageHash = res.data[0].md5;
          }
        });
      } else {
        this.processVIO.forEach(v => {
          if (v.name == res.data[0].originName) {
            v.videoUrl = res.data[0].targetName;
            v.videoHash = res.data[0].md5;
          }
        });
      }
    },
    checkUploadPic(file) {
      let sameimg = this.processIMG.find(
        v => v.name == file.name && (!v.size || (v.size && v.size == file.size))
      );
      let samevio = this.processVIO.find(
        v => v.name == file.name && (!v.size || (v.size && v.size == file.size))
      );
      let cant = false;
      let reg = /jpg|png|jpeg|bmp|gif/;
      switch (true) {
        case Boolean(sameimg):
          Msgwarning("相同图片不可重复上传");
          cant = true;
          break;
        case Boolean(samevio):
          Msgwarning("相同视频不可重复上传");
          cant = true;
          break;
      }
      if (cant) {
        file.remove();
        return;
      }

      let fl = file.file;
      let md5 = bmf.md5(
        fl,
        (err, md5) => {
          // console.log("md5:", md5);
          this.matchMD5(md5, file, reg.test(fl.type) ? "img" : "video");
        },
        progress => {
          // console.log("progress number:", progress);
        }
      );
    },
    uploadPic(file, process) {
      this.disfile = file;
      this.SETSTATE({ k: "withcreatead", v: false });

      let obj = {};
      obj.name = file.name;
      obj.process = process;
      obj.size = file.size;
      obj.file = file;

      if (/jpg|png|jpeg|bmp|gif/.test(file.type)) {
        this.processIMG.forEach(v => {
          if (v.name == file.name) {
            v.process = process;
          }
        });
        if (!this.processIMG.find(v => v.name == file.name)) {
          this.processIMG.push(obj);
        }
      } else {
        obj.fmname = "";
        obj.fmprocess = 0;

        this.processVIO.forEach(v => {
          if (v.name == file.name) {
            v.process = process;
          }
        });
        if (!this.processVIO.find(v => v.name == file.name)) {
          this.processVIO.push(obj);
        }
      }
    },
    delIMG(file, name) {
      console.log(file);
      if (file && file.isUploading) {
        file.cancel();
        file.remove();
      }
      this.processIMG = this.processIMG.filter(v => v.name != name);
      this.processVIO = this.processVIO.filter(v => v.name != name);

      this.SETSTATE({ k: "withcreatead", v: true });
    }
  }
};
</script>

<style lang="less" scoped>
.elnotice {
  position: absolute;
  left: -27px;
  top: 20px;
  font-size: 16px;
  margin-top: -8px;
}
.elnotice2 {
  position: absolute;
  left: -70px;
  top: 20px;
  font-size: 16px;
  margin-top: -8px;
}
.fonttip {
  color: #999;
  margin-left: 10px;
}
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
.descarea {
  display: flex;
  margin-bottom: 20px;
  .actiondown {
    position: relative;
  }
  .desctitle {
    width: 80px;
    text-align: right;
    // float: left;
    line-height: 40px;
    padding-right: 12px;
    box-sizing: border-box;
    flex-basis: 80px;
    flex-shrink: 0;
    color: #606266;
  }
  textarea {
    flex-grow: 1;
    display: block;
    float: left;
    resize: vertical;
    padding: 5px 15px;
    line-height: 1.5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 85px;
    font-size: inherit;
    color: #606266;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  input {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
  }
}
.tag {
  //   float: left;
  //   width: 50%;
  box-sizing: border-box;
  flex-grow: 1;
  top: 10px;
  padding-top: 7px;
  //   height: 76px;
  //   overflow-y: auto;
  .evtag {
    margin-right: 10px;
    margin-bottom: 10px;
    // height: 26px;
    line-height: 18px;
    background-color: #f0f2f5;
    color: #666;
    display: block;
    float: left;
    font-size: 12px;
    border-radius: 3px;
    padding: 4px 26px 4px 10px;
    position: relative;
    i {
      color: #c0c4cc;
      margin-left: 5px;
      cursor: pointer;
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
}
</style>
