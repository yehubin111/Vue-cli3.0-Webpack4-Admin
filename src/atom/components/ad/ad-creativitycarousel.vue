<template>
  <el-form ref="form" :model="form" label-width="80px" class="cform" label-position="left">
    <el-form-item label="主页" class="cline">
      <el-select v-model="form.homepage" placeholder="请选择主页" filterable @change="selectHomepage">
        <el-option v-if="otherpagename" :label="otherpagename" :value="otherpageid"></el-option>
        <el-option v-for="(l,index) in commonpage" :key="index" :label="l.name" :value="l.pageId"></el-option>
      </el-select>
    </el-form-item>
    <div class="carousellist">
      <div class="add" v-if="tablist.length < 10">
        <el-button size="small" type="primary" @click="addTab(tabvalue)">+</el-button>
      </div>
      <el-tabs v-model="tabvalue" type="card">
        <el-tab-pane
          v-for="(item, index) in tablist"
          :key="item.name"
          :label="index + 1 + ''"
          :name="item.name"
        >
          <i
            v-show="tablist.length > 3"
            class="el-icon-close cardremove"
            @click="removeTab(item.name)"
          ></i>
          <el-form-item label="类型" class="cline">
            <el-radio-group v-model="item.type" @change="resetImgVideo(item.name)">
              <el-radio label="1">图片</el-radio>
              <el-radio label="2">视频</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="item.type == '1'" label="图片" class="cline uploadfile">
            <el-button
              v-show="item.processIMG.length == 0"
              class="moreInfo"
              type="primary"
              size="small"
            >上传图片</el-button>
            <div class="filebutton">
              <vue-file-upload
                v-show="item.processIMG.length == 0"
                @checkUpload="checkUpload"
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
            </div>
            <ul class="reslist">
              <li v-for="(l, index) in item.processIMG" :key="index">
                <div class="image">
                  <p class="processname">
                    <span class="el-icon-picture-outline"></span>
                    <span class="name" :title="l.name">{{l.name}}</span>
                    <transition name="fade">
                      <span class="el-icon-check" v-show="l.process == 100"></span>
                    </transition>
                  </p>
                  <p class="processline">
                    <i class="line">
                      <em :style="'width:' + l.process + '%' "></em>
                    </i>
                    <span>{{l.process}}%</span>
                  </p>
                </div>
                <i class="el-icon-error processclose" @click="delIMG(l.file)"></i>
              </li>
            </ul>
          </el-form-item>
          <el-form-item v-show="item.type == '2'" label="视频" class="cline uploadfile">
            <el-button
              v-show="item.processVIO.length == 0"
              class="moreInfo"
              type="primary"
              size="small"
            >上传视频</el-button>
            <vue-file-upload
              v-show="item.processVIO.length == 0"
              @checkUpload="checkUploadVio"
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
              <li v-for="(g, index) in item.processVIO" :key="index">
                <div class="video">
                  <p class="processname">
                    <span class="el-icon-document"></span>
                    <span class="name" :title="g.name">{{g.name}}</span>
                    <transition name="fade">
                      <span class="el-icon-check" v-show="g.process == 100"></span>
                    </transition>
                  </p>
                  <p class="processline">
                    <i class="line">
                      <em :style="'width:' + g.process + '%' "></em>
                    </i>
                    <span>{{g.process}}%</span>
                  </p>
                </div>
                <el-button type="text" class="fmbutton" v-show="!g.fmname && g.process == 100">上传封面图</el-button>
                <div class="uploadFmbox">
                  <vue-file-upload
                    v-show="!g.fmname && g.process == 100"
                    @checkUploadFm="checkUploadFm"
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
                <div class="videofm" v-show="g.fmname">
                  <p class="processname">
                    <span class="el-icon-picture-outline"></span>
                    <span class="name" :title="g.fmname">{{g.fmname}}</span>
                    <transition name="fade">
                      <span class="el-icon-check" v-show="g.fmprocess == 100"></span>
                    </transition>
                  </p>
                  <p class="processline">
                    <i class="line">
                      <em :style="'width:' + g.fmprocess + '%' "></em>
                    </i>
                    <span>{{g.fmprocess}}%</span>
                  </p>
                </div>
                <i class="el-icon-error processclose processvideo" @click="delVIO(g.file)"></i>
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="标题" class="cline">
            <el-input v-model="item.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="deeplink" class="cline">
            <el-input v-model="item.deeplink" placeholder="可跳转到APP指定页面，选填，为空则仅下载APP"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-form-item label="文本" class="cline">
      <el-input
        type="textarea"
        v-model="form.desc"
        class="textarea"
        placeholder="请输入文字说明，介绍推广内容"
        :autosize="{ minRows: 3.5, maxRows: 3.5 }"
      ></el-input>
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
import baseurl from "../../js/baseurl";
import VueFileUpload from "vue-file-upload";
import BMF from "browser-md5-file";
import { Msgwarning, Msgsuccess, Msgerror } from "../../js/message";
import { mapState, mapGetters, mapMutations } from "vuex";
let bmf = new BMF();
export default {
  props: ["createType", "createObject"],
  components: {
    VueFileUpload
  },
  data() {
    return {
      tabvalue: "t1",
      tabindex: 3,
      tablist: [
        {
          tab: "1",
          name: "t1",
          title: "",
          deeplink: "",
          type: "1",
          processIMG: [],
          processVIO: []
        },
        {
          tab: "2",
          name: "t2",
          title: "",
          deeplink: "",
          type: "1",
          processIMG: [],
          processVIO: []
        },
        {
          tab: "3",
          name: "t3",
          title: "",
          deeplink: "",
          type: "1",
          processIMG: [],
          processVIO: []
        }
      ],
      form: {
        type: "0",
        deeplink: "",
        homepage: "",
        desc: "",
        title: "",
        actions: ""
      },
      otherpagename: "",
      otherpageid: "",
      msg: {
        homepage: "请选择主页",
        desc: "请输入文本",
        actions: "请选择行动号召"
      },
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
          this.vm.$emit("uploadRes", response);
        },
        onAddFileSuccess(file) {
          this.vm.$emit("checkUpload", file);
        }
      },
      eventsVIO: {
        onProgressUpload(file, process) {
          console.log(file.name);
          this.vm.$emit("uploadVio", file, process);
        },
        onSuccessUpload(file, response, status, headers) {
          if (response.code != 0) {
            Msgerror(response.msg);
            this.vm.$emit("uploadVioError", response, file);
            return;
          }
          this.vm.$emit("uploadVioRes", response);
        },
        onAddFileSuccess(file) {
          this.vm.$emit("checkUpload", file);
        }
      },
      eventsFM: {
        onProgressUpload(file, process) {
          console.log(arguments);
          this.vm.$emit("uploadFm", file, process);
        },
        onSuccessUpload(file, response, status, headers) {
          if (response.code != 0) {
            Msgerror(response.msg);
            this.vm.$emit("uploadFmError", response, file);
            return;
          }
          this.vm.$emit("uploadFmRes", response);
        },
        onAddFileSuccess(file) {
          this.vm.$emit("checkUploadFm", file);
        }
      }
    };
  },
  computed: {
    ...mapState(["commonpage"]),
    ...mapGetters(["allactions"]),
    uploadFileUrl() {
      return `${baseurl[process.env.VUE_APP_URLBASE].UPLOAD_URL}/file/`;
    }
  },
  mounted() {
    let n = this.createObject;
    if (n) {
      this.otherpageid = n.pageId ? n.pageId : "";
      if (!this.commonpage.find(v => v.pageId == n.pageId))
        this.otherpagename = n.pageName ? n.pageName : "";
    }
    if (n && n.cards) {
      // 20190130新增逻辑，编辑单个广告组，初始化保存该创意类型，切换的时候数据填充
      this.SETSTATE({ k: "edittype", v: '2' });

      this.form.homepage = n.pageId ? n.pageId : "";
      this.form.deeplink = n.deeplink ? n.deeplink : "";
      this.form.desc = n.creativityText ? n.creativityText : "";
      this.form.actions = n.actionCallOn ? n.actionCallOn : "";

      this.tablist = [];
      let card = JSON.parse(n.cards);
      card.forEach((v, i) => {
        let obj = {
          tab: i + 1,
          name: `t${i + 1}`,
          title: v.title,
          deeplink: v.cardDeepLink,
          type: v.cardType.toString(),
          processIMG: [],
          processVIO: []
        };

        if (v.videoId) {
          let vio = {
            name: v.videoId,
            process: 100,
            file: null,
            size: 0,
            fmname: v.imageHash,
            fmprocess: 100,
            videoId: v.videoId,
            videoUrl: v.videoUrl ? v.videoUrl : "",
            videoHash: "",
            fmUrl: v.imageUrl ? v.imageUrl : "",
            fmHash: v.imageHash ? v.imageHash : ""
          };
          obj.processVIO.push(vio);
        } else {
          let img = {
            name: v.imageHash,
            imageUrl: v.imageUrl ? v.imageUrl : "",
            imageHash: v.imageHash ? v.imageHash : "",
            process: 100,
            size: 0,
            file: null
          };
          obj.processIMG.push(img);
        }

        this.tablist.push(obj);
      });
      console.log(this.tablist);
    }
  },
  watch: {
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
    "form.actions": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    tablist() {
      this.$emit("changeEdit", true);
    },
    createType(n, o) {
      // 初始化
      /**
       * 取消全部上传进程
       * 条件：file存在且未成功上传且未取消
       */
      this.tablist.forEach(g => {
        if (g.type == "1") {
          var itfile = g.processIMG[0] ? g.processIMG[0].file : null;
          if (itfile && !itfile.isSuccess && !itfile.isCancel) itfile.cancel();
        } else {
          var itfile = g.processVIO[0]
            ? g.processVIO[0].fmfile || g.processVIO[0].file
            : null;
          if (itfile && !itfile.isSuccess && !itfile.isCancel) itfile.cancel();
        }
      });

      this.form.type = "0";
      this.form.deeplink = "";
      this.form.homepage = "";
      this.form.desc = "";
      this.form.title = "";
      this.form.actions = "";
      this.tablist = [
        {
          tab: "1",
          name: "t1",
          title: "",
          deeplink: "",
          type: "1",
          processIMG: [],
          processVIO: []
        },
        {
          tab: "2",
          name: "t2",
          title: "",
          deeplink: "",
          type: "1",
          processIMG: [],
          processVIO: []
        },
        {
          tab: "3",
          name: "t3",
          title: "",
          deeplink: "",
          type: "1",
          processIMG: [],
          processVIO: []
        }
      ];
      this.tabvalue = "t1";
      this.tabindex = 3;
      this.otherpagename = "";
      this.otherpageid = "";
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    getCheckData() {
      let data = this.form;

      let result;
      for (let i = 0; i < this.tablist.length; i++) {
        let v = this.tablist[i];

        if (data["homepage"] == "") return [false, this.msg["homepage"]];
        if (v.type == "1") {
          if (v.processIMG.length == 0) {
            result = [false, `卡片${i + 1} 图片未上传`];
            break;
          } else if (v.processIMG[0].process != 100) {
            result = [false, `卡片${i + 1} 图片正在上传中……`];
            break;
          } else {
            result = [true];
          }
        } else {
          if (v.processVIO.length == 0) {
            result = [false, `卡片${i + 1} 视频未上传`];
            break;
          } else if (v.processVIO[0].process != 100) {
            result = [false, `卡片${i + 1} 视频正在上传中……`];
            break;
          } else if (!v.processVIO[0].fmname) {
            result = [false, `卡片${i + 1} 封面图未上传`];
            break;
          } else if (v.processVIO[0].fmprocess != 100) {
            result = [false, `卡片${i + 1} 封面图正在上传中……`];
            break;
          } else {
            result = [true];
          }
        }
        if (v.title == "") {
          result = [false, `卡片${i + 1} 标题未填写`];
          break;
        }
      }
      if (!result[0]) return result;

      if (data["desc"] == "") return [false, this.msg["desc"]];
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
      let homepage = this.commonpage.filter(
        v => v.pageId == this.form.homepage
      )[0];
      let action = this.allactions.filter(v => v.code == this.form.actions)[0];
      creative.pageId = homepage.pageId;
      creative.pageLogo = homepage.picture;
      creative.pageName = homepage.name;
      creative.actionCallOn = action.code;
      creative.actionCallOnName = action.name;
      creative.creativityText = this.form.desc;
      creative.token = this.xtoken;
      creative.deeplink = this.form.deeplink;
      // creative.creativityTitle = this.form.title;
      let card = [];
      this.tablist.forEach((v, i) => {
        let image, video;
        if (v.type == "1") {
          image = {
            imageUrl: v.processIMG[0].imageUrl,
            imageHash: v.processIMG[0].imageHash
          };
          video = {
            videoUrl: "",
            videoHash: "",
            videoId: ""
          };
        } else {
          image = {
            imageUrl: v.processVIO[0].fmUrl,
            imageHash: v.processVIO[0].fmHash
          };
          video = {
            videoUrl: v.processVIO[0].videoUrl,
            videoHash: v.processVIO[0].videoHash,
            videoId: v.processVIO[0].videoId
          };
        }
        let obj = {
          cardType: v.type,
          title: v.title,
          cardDeepLink: v.deeplink
        };

        // 创建的时候无需传imagehash videoid，编辑的时候无需传imageurl videourl
        obj.imageUrl = image.imageUrl;
        obj.videoUrl = video.videoUrl;
        if (!image.imageUrl) obj.imageHash = image.imageHash;
        if (!video.videoUrl) obj.videoId = video.videoId;

        card.push(obj);
      });
      creative.cards = JSON.stringify(card);

      return [true, creative];
    },
    /**
     * 20181107新增，图片视频素材库
     * 选择文件之后，JS获取MD5值（brower-file-md5），传到后台，如果已上传过，则进度直接为100%
     */
    matchMD5(md5, file, type) {
      this.$store.dispatch("matchFileMD5", {
        md5: [md5],
        file,
        list: this.tablist,
        type,
        tabvalue: this.tabvalue,
        on: "cardcreate",
        vdname: this.fmvideoname
      });
    },
    resetImgVideo(name) {
      /**
       * 取消当前file上传进程
       * 条件：file存在且未成功上传且未取消
       * type为切换之后type
       */
      this.tablist.forEach(g => {
        if (g.name == name) {
          if (g.type == "1") {
            var itfile = g.processVIO[0]
              ? g.processVIO[0].fmfile || g.processVIO[0].file
              : null;
            if (itfile && !itfile.isSuccess && !itfile.isCancel)
              itfile.cancel();

            g.processVIO = [];
          } else {
            var itfile = g.processIMG[0] ? g.processIMG[0].file : null;
            if (itfile && !itfile.isSuccess && !itfile.isCancel)
              itfile.cancel();

            g.processIMG = [];
          }
        }
      });
    },
    addTab(targetName) {
      let newTabName = ++this.tabindex + "";
      this.tablist.push({
        tab: newTabName,
        name: "t" + newTabName,
        title: "",
        deeplink: "",
        type: "1",
        processIMG: [],
        processVIO: []
      });
      this.tabvalue = "t" + newTabName;
    },
    removeTab(targetName) {
      /**
       * 删除卡片的时候根据name 取消正在上传的图片或者视频
       */
      this.tablist.forEach(g => {
        if (g.name == targetName) {
          if (g.type == "1") {
            var itfile = g.processIMG[0] ? g.processIMG[0].file : null;

            if (itfile && !itfile.isSuccess && !itfile.isCancel) {
              itfile.cancel();
            }
          } else {
            var itfile = g.processVIO[0]
              ? g.processVIO[0].fmfile || g.processVIO[0].file
              : null;

            if (itfile && !itfile.isSuccess && !itfile.isCancel) {
              itfile.cancel();
            }
          }
        }
      });

      let tabs = this.tablist;
      let activeName = this.tabvalue;
      // 如果删除的是当前项
      if (activeName === targetName) {
        tabs.forEach((v, i) => {
          if (v.name == targetName) {
            activeName = tabs[i + 1] ? tabs[i + 1].name : tabs[i - 1].name;
          }
        });
      }

      this.tabvalue = activeName;
      this.tablist = tabs.filter(tab => tab.name !== targetName);
    },
    uploadFmError(res, file) {
      this.tablist.forEach(g => {
        if (g.processVIO[0] && g.processVIO[0].fmname == file.name) {
          g.processVIO[0].fmname = "";
          g.processVIO[0].fmprocess = "";
        }
      });
    },
    uploadFmRes(res) {
      console.log(res);
      this.tablist.forEach(g => {
        if (
          g.processVIO[0] &&
          g.processVIO[0].fmname == res.data[0].originName
        ) {
          g.processVIO[0].fmUrl = res.data[0].targetName;
          g.processVIO[0].fmHash = res.data[0].md5;
        }
      });
    },
    uploadFm(file, process) {
      let self = this;
      let pss = this.tablist.find(
        v => v.processVIO[0] && v.processVIO[0].fmname == file.name
      );
      // 检测是否已在上传，若有，则根据文件名称匹配，继续上传，若无，则根据tab名称匹配
      // 需排除相同图片视频上传
      if (!pss) {
        this.tablist.forEach(g => {
          if (g.name == this.tabvalue) {
            g.processVIO[0].fmname = file.name;
            g.processVIO[0].fmprocess = process;
            g.processVIO[0].fmfile = file;
          }
        });
      } else {
        this.tablist.forEach(g => {
          if (g.processVIO[0] && g.processVIO[0].fmname == file.name) {
            g.processVIO[0].fmprocess = process;
          }
        });
      }
    },
    uploadVioError(res, file) {
      this.tablist.forEach(g => {
        if (g.processVIO[0] && g.processVIO[0].name == file.name) {
          g.processVIO = [];
        }
      });
    },
    uploadVioRes(res) {
      this.tablist.forEach(g => {
        if (g.processVIO[0] && g.processVIO[0].name == res.data[0].originName) {
          g.processVIO[0].videoUrl = res.data[0].targetName;
          g.processVIO[0].videoHash = res.data[0].md5;
        }
      });
    },
    uploadVio(file, process) {
      let obj = {};
      obj.name = file.name;
      obj.process = process;
      obj.file = file;
      obj.size = file.size;
      obj.fmname = "";
      obj.fmprocess = 0;
      obj.videoId = "";

      let pss = this.tablist.find(
        v => v.processVIO[0] && v.processVIO[0].name == file.name
      );
      // 检测是否已在上传，若有，则根据文件名称匹配，继续上传，若无，则根据tab名称匹配
      // 需排除相同图片视频上传
      if (!pss) {
        this.tablist.forEach(g => {
          if (g.name == this.tabvalue) {
            g.processVIO.push(obj);
          }
        });
      } else {
        this.tablist.forEach(g => {
          if (g.processVIO[0] && g.processVIO[0].name == file.name) {
            g.processVIO[0].process = process;
          }
        });
      }
    },
    delVIO(file) {
      if (file && file.isUploading) {
        file.cancel();
        file.remove();
      }
      this.tablist.forEach(g => {
        if (g.name == this.tabvalue) {
          g.processVIO = [];
        }
      });
    },
    uploadRes(res) {
      // console.log(res);

      this.tablist.forEach(g => {
        if (g.processIMG[0] && g.processIMG[0].name == res.data[0].originName) {
          g.processIMG[0].imageUrl = res.data[0].targetName;
          g.processIMG[0].imageHash = res.data[0].md5;
        }
      });
    },
    uploadError(res, file) {
      this.tablist.forEach(g => {
        if (g.processIMG[0] && g.processIMG[0].name == file.name) {
          g.processIMG = [];
        }
      });
    },
    // 重复监测
    checkUpload(file) {
      // console.log(file);
      if (
        this.tablist.find(
          v => v.processIMG[0] && v.processIMG[0].name == file.name
        )
      ) {
        file.remove();
        Msgwarning("相同图片不可重复上传，请更换图片或重新命名");
      } else {
        let fl = file.file;
        let md5 = bmf.md5(
          fl,
          (err, md5) => {
            // console.log("md5:", md5);
            this.matchMD5(md5, file, "img");
          },
          progress => {
            // console.log("progress number:", progress);
          }
        );
      }
    },
    checkUploadVio(file) {
      if (
        this.tablist.find(
          v => v.processVIO[0] && v.processVIO[0].name == file.name
        )
      ) {
        file.remove();
        Msgwarning("相同视频不可重复上传，请更换视频或重新命名");
      } else {
        let fl = file.file;
        let md5 = bmf.md5(
          fl,
          (err, md5) => {
            // console.log("md5:", md5);
            this.matchMD5(md5, file, "video");
          },
          progress => {
            // console.log("progress number:", progress);
          }
        );
      }
    },
    checkUploadFm(file) {
      if (
        this.tablist.find(
          v => v.processVIO[0] && v.processVIO[0].fmname == file.name
        )
      ) {
        file.remove();
        Msgwarning("暂时无法上传相同封面图，请更换封面图或重新命名");
      } else {
        let fl = file.file;
        let md5 = bmf.md5(
          fl,
          (err, md5) => {
            // console.log("md5:", md5);
            this.matchMD5(md5, file, "fm");
          },
          progress => {
            // console.log("progress number:", progress);
          }
        );
      }
    },
    uploadPic(file, process) {
      // console.log(file);
      let obj = {};
      obj.name = file.name;
      obj.process = process;
      obj.size = file.size;
      obj.file = file;

      let pss = this.tablist.find(
        v => v.processIMG[0] && v.processIMG[0].name == file.name
      );
      // 检测是否已在上传，若有，则根据文件名称匹配，继续上传，若无，则根据tab名称匹配
      // 需排除相同图片视频上传
      if (!pss) {
        this.tablist.forEach(g => {
          if (g.name == this.tabvalue) {
            g.processIMG.push(obj);
          }
        });
      } else {
        this.tablist.forEach(g => {
          if (g.processIMG[0] && g.processIMG[0].name == file.name) {
            g.processIMG[0].process = process;
          }
        });
      }
    },
    delIMG(file) {
      if (file && file.isUploading) {
        file.cancel();
        file.remove();
      }
      // this.processIMG = this.processIMG.filter(v => v.name != name);
      this.tablist.forEach(g => {
        if (g.name == this.tabvalue) {
          g.processIMG = [];
        }
      });
    },
    selectHomepage() {
      let h = this.commonpage.filter(v => v.pageId == this.form.homepage)[0];
      if (h && !h.insId) {
        this.form.homepage = "";
        Msgwarning("此主页无PBIA，请先同步");
      }
    }
  }
};
</script>
<style>
.carousellist .el-tabs__content {
  border: 1px solid #e4e7ed;
  border-top: none;
  padding-right: 20px;
  padding-top: 15px;
  width: 111%;
  padding-left: 20px;
  box-sizing: border-box;
}
.carousellist .el-tabs__header {
  margin-bottom: 0;
}
</style>

<style lang="less" scoped>
.carousellist {
  position: relative;
  width: 90%;
  margin-bottom: 20px;
  .add {
    position: absolute;
    right: -50px;
    top: 0px;
    z-index: 19;
    .el-button {
      font-size: 22px;
      width: 50px;
      height: 41px;
      padding: 0;
      line-height: 32px;
      text-align: center;
    }
  }
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
.cardremove {
  position: absolute;
  right: 13px;
  cursor: pointer;
  z-index: 22;
}
</style>
