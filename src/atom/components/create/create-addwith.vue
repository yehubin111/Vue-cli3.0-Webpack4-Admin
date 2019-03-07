<template>
  <div class="alldialog">
    <el-dialog title="批量新增创意" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
      <el-form ref="form" :model="form" label-width="80px" class="cform">
        <el-form-item label="国家" class="cline">
          <el-select
            class="search"
            v-model="form.selectArr"
            filterable
            multiple
            remote
            placeholder="请选择国家，可搜索"
          >
            <el-option
              v-for="item in othercountries"
              :key="item.code"
              :label="item.name +'(' + item.code + ')'"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" class="cline">
          <el-radio-group v-model="form.sex">
            <el-radio label="0">全部</el-radio>
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="主页" class="cline">
          <el-select
            v-model="form.homepage"
            filterable
            placeholder="请选择主页"
            @change="selectHomepage"
          >
            <el-option
              v-for="(l,index) in allpagelist"
              :key="index"
              :label="l.name"
              :value="l.pageId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类" class="cline">
          <el-autocomplete
            class="search"
            v-model="form.classify"
            :fetch-suggestions="querySearchAsyncClassify"
            placeholder="请输入分类，可搜索"
            suffix-icon="el-icon-search"
            @select="handleSelectClassify"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="创意类型" class="cline">
          <el-radio-group v-model="form.type" @change="resetImgVideo">
            <el-radio label="0">单图片</el-radio>
            <el-radio label="1">单视频</el-radio>
            <el-radio label="2">轮播</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="deeplink" class="cline">
          <el-input v-model="form.deeplink" placeholder="可跳转到APP指定页面，选填，为空则仅下载APP"></el-input>
        </el-form-item>
        <el-form-item class="cbutton">
          <el-button type="primary" @click="toNext">下一步</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="批量新增创意" :visible.sync="dialogFormVisible2" class="dialog" @close="toCancel2">
      <el-form ref="form" :model="form2" label-width="80px" class="cform">
        <!--非轮播类型图片上传-->
        <el-form-item v-show="form.type == 0" label="图片" class="cline uploadfile">
          <el-button class="moreInfo" type="primary" size="small">上传图片</el-button>
          <vue-file-upload
            ref="vueFileUploader"
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
          <ul class="reslist">
            <!-- <transition-group name="fade"> -->
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
            <!-- </transition-group> -->
          </ul>
        </el-form-item>
        <!--非轮播类型图片上传-->
        <!--非轮播类型视频上传-->
        <el-form-item v-show="form.type == 1" label="视频" class="cline uploadfile">
          <el-button class="moreInfo" type="primary" size="small">上传视频</el-button>
          <vue-file-upload
            ref="vueFileUploaderVio"
            @uploadVio="uploadVio"
            @onAdd="onAddItem"
            @checkUploadVio="checkUploadVio"
            @uploadVioRes="uploadVioRes"
            @uploadVioError="uploadVioError"
            name="file"
            class="fileinput"
            :url="uploadFileUrl"
            :events="eventsVIO"
            multiple
            :requestOptions="fileOption"
            :filters="videofilters"
          >
            <span slot="label"></span>
          </vue-file-upload>
          <ul class="reslist">
            <!-- <transition-group name="fade"> -->
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
              <el-button type="text" class="fmbutton" v-show="!item.fmname">上传封面图</el-button>
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
              </div>
              <i
                class="el-icon-error processclose processvideo"
                @click="delVIO(item.file, item.name)"
              ></i>
            </li>
            <!-- </transition-group> -->
          </ul>
        </el-form-item>
        <!--非轮播类型视频上传-->
        <!--文本，描述文字-->
        <div class="descarea" v-show="form2.descarr.length > 0">
          <span class="desctitle">文本</span>
          <div class="tag">
            <span class="evtag" v-for="item in form2.descarr" :key="item">
              {{item}}
              <i class="el-icon-error" @click="delDesc(item)"></i>
            </span>
          </div>
        </div>
        <el-form-item :label="form2.descarr.length > 0?'':'文本'" class="cline">
          <el-input
            type="textarea"
            v-model="form2.desc"
            placeholder="请输入文字说明，介绍推广内容"
            class="textarea"
            :autosize="{ minRows: 3.5, maxRows: 3.5 }"
          ></el-input>
        </el-form-item>
        <el-form-item class="addbutton">
          <el-button class="moreInfo" type="primary" size="small" @click="addDesc">新增文本</el-button>
        </el-form-item>
        <el-form-item label="轮播数量" v-show="form.type == 2" @change="changeFocusaccount">
          <el-input-number v-model="form2.focuscount" :min="3" :max="10" label="描述文字"></el-input-number>
        </el-form-item>
        <!--文本，描述文字-->
        <!--轮播卡片设置模块-->
        <div class="card" v-show="form.type == 2">
          <p class="cardname">
            <span class="title">卡片设置</span>
            <span class="cardtotal">共{{cardCount}}个图片/视频，单个轮播创意中图片/视频不会重复</span>
          </p>
          <el-form-item label="图片" class="cline uploadfile">
            <el-button class="moreInfo" type="primary" size="small">上传图片</el-button>
            <vue-file-upload
              ref="vueFileUploaderLB"
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
            <ul class="reslist">
              <!-- <transition-group name="fade"> -->
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
              <!-- </transition-group> -->
            </ul>
          </el-form-item>
          <el-form-item label="视频" class="cline uploadfile">
            <el-button class="moreInfo" type="primary" size="small">上传视频</el-button>
            <vue-file-upload
              ref="vueFileUploaderVioLB"
              @uploadVio="uploadVio"
              @onAdd="onAddItem"
              @checkUploadVio="checkUploadVio"
              @uploadVioRes="uploadVioRes"
              @uploadVioError="uploadVioError"
              name="file"
              class="fileinput"
              :url="uploadFileUrl"
              :events="eventsVIO"
              multiple
              :requestOptions="fileOption"
              :filters="videofilters"
            >
              <span slot="label"></span>
            </vue-file-upload>
            <ul class="reslist">
              <!-- <transition-group name="fade"> -->
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
                <el-button type="text" class="fmbutton" v-show="!item.fmname">上传封面图</el-button>
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
                </div>
                <i
                  class="el-icon-error processclose processvideo"
                  @click="delVIO(item.file, item.name)"
                ></i>
              </li>
              <!-- </transition-group> -->
            </ul>
          </el-form-item>
          <div class="descarea" v-show="form2.titlearr.length > 0">
            <span class="desctitle">标题</span>
            <div class="tag">
              <span class="evtag" v-for="item in form2.titlearr" :key="item">
                {{item}}
                <i class="el-icon-error" @click="delTitle(item)"></i>
              </span>
            </div>
          </div>
          <el-form-item :label="form2.titlearr.length > 0?'':'标题'" class="cartitle">
            <el-input v-model="form2.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item class="addbutton">
            <el-button class="moreInfo" type="primary" size="small" @click="addTitle">新增标题</el-button>
          </el-form-item>
        </div>
        <!--轮播卡片设置模块-->
        <!--非轮播类型标题-->
        <div class="descarea" v-show="form.type != 2 && form2.titlearr.length > 0">
          <span class="desctitle">标题</span>
          <div class="tag">
            <span class="evtag" v-for="item in form2.titlearr" :key="item">
              {{item}}
              <i class="el-icon-error" @click="delTitle(item)"></i>
            </span>
          </div>
        </div>
        <el-form-item
          :label="form2.titlearr.length > 0?'':'标题'"
          v-show="form.type != 2"
          class="cline"
        >
          <el-input v-model="form2.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item class="addbutton" v-show="form.type != 2">
          <el-button class="moreInfo" type="primary" size="small" @click="addTitle">新增标题</el-button>
        </el-form-item>
        <!--非轮播类型标题-->
        <el-form-item label="行动号召" class="cline">
          <el-select
            v-model="form2.actionArr"
            multiple
            filterable
            remote
            placeholder="行动号召"
            @change="actionChange"
          >
            <el-option v-for="item in allactions" :key="item.code" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="cbutton">
          <el-button @click="toPrev">上一步</el-button>
          <el-button type="primary" @click="toSubmit">新增{{total}}个创意</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import VueFileUpload from "vue-file-upload";
import BMF from "browser-md5-file";
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning, Msgsuccess, Msgerror } from "../../js/message";
import baseurl from "../../js/baseurl";
let bmf = new BMF();
export default {
  props: ["status"],
  components: {
    VueFileUpload
  },
  data() {
    return {
      ifcreate: true,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogImageUrl: "",
      dialogVisible: false,
      xtoken: localStorage.getItem("atom_token"),
      state: "",
      // desclength: [],
      // titlelength: [],
      // actionlength: [],
      total: 0,
      prevtype: "0",
      disfile: null, // 正在上传的file
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
      // 图片上传格式过滤
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
      // 视频上传格式过滤
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
          this.vm.$emit("uploadRes", response);
          // 上传完成之后需要从队列中清除
          console.log("%cremove", "color: red");
          file.remove();
        },
        onAddFileSuccess(file) {
          console.log("%cwaiting", "color: red");
          this.vm.$emit("checkUploadPic", file);
        }
      },
      eventsVIO: {
        onProgressUpload(file, process) {
          this.vm.$emit("uploadVio", file, process);
        },
        onSuccessUpload(file, response, status, headers) {
          if (response.code != 0) {
            Msgerror(response.msg);
            this.vm.$emit("uploadVioError", response, file);
            return;
          }
          this.vm.$emit("uploadVioRes", response);
          // 上传完成之后需要从队列中清除
          console.log("%cremove", "color: red");
          file.remove();
        },
        onAddFileSuccess(file) {
          console.log("%cwaiting", "color: red");
          this.vm.$emit("checkUploadVio", file);
        }
      },
      fmvideoname: "",
      eventsFM: {
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
        },
        onAddFileSuccess(file) {
          let fl = file.file;
          let md5 = bmf.md5(
            fl,
            (err, md5) => {
              // console.log('md5:', md5);
              this.vm.$emit("matchMD5", md5, file, "fm");
            },
            progress => {
              // console.log('progress number:', progress);
            }
          );
        }
      },
      form: {
        selectArr: [],
        sex: "0",
        homepage: "",
        classify: "",
        type: "0",
        deeplink: ""
      },
      form2: {
        imgvideo: [],
        descarr: [],
        desc: "",
        titlearr: [],
        title: "",
        actions: "",
        actionArr: [],
        actionidArr: [],
        focuscount: 3,

        // name: "",

        videoUrl: []
      },
      msg: {
        selectArr: "请选择国家",
        homepage: "请选择主页",
        classify: "请输入分类",
        deeplink: ""
      },
      msg2: {
        // name: "创意名称不能为空",
        desc: "请输入文本",
        title: "请输入标题",
        actions: "请选择行动号召",
        imgvideo: "请上传图片",
        videoUrl: "请上传视频"
      }
    };
  },
  computed: {
    ...mapState(["othercountries", "allpagelist", "withcreate", "wantupload"]),
    ...mapGetters(["createclassify", "allactions"]),
    cardCount() {
      return (
        this.processIMG.length + this.processVIO.length
        //  *this.form2.titlearr.length
      );
    },
    uploadFileUrl() {
      return `${baseurl[process.env.VUE_APP_URLBASE].UPLOAD_URL}/file/`;
    }
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;
    },
    dialogFormVisible2(n, v) {
      if (n) {
        if (this.form.type == "0" && this.prevtype != this.form.type) {
          this.prevtype = this.form.type;
          if (this.$refs.uploadfile1) this.$refs.uploadfile1.clearFiles();
          this.form2.videoUrl = [];
          this.form2.imgvideo = [];
        }
        if (this.form.type == "1" && this.prevtype != this.form.type) {
          this.prevtype = this.form.type;
          if (this.$refs.uploadfile2) this.$refs.uploadfile2.clearFiles();
          if (this.$refs.uploadfile3) this.$refs.uploadfile3.clearFiles();
          this.form2.videoUrl = [];
          this.form2.imgvideo = [];
        }
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
    /**
     * 20181107新增，图片视频素材库
     * 选择文件之后，JS获取MD5值（brower-file-md5），传到后台，如果已上传过，则进度直接为100%
     */
    matchMD5(md5, file, type) {
      // console.log(md5);
      this.dom = type == "img" ? "vueFileUploader" : "vueFileUploaderVio";
      // 轮播模式
      if (this.form.type == "2") this.dom += "LB";
      this.$store.dispatch("matchMutiFileMD5", {
        md5: [md5],
        file,
        list: type == "img" ? this.processIMG : this.processVIO,
        type,
        on: "withcreate",
        vdname: this.fmvideoname,
        callback: () => {
          // 计算总数
          this.setTotal();
        }
      });
    },
    onAddItem(files) {
      console.log(files);
      this.SETSTATE({ k: "wantupload", v: 0 });
      this.uploadsize = files.length;
      console.log("this.uploadsize:", this.uploadsize);
    },
    changeFocusaccount() {
      // 计算总数
      this.setTotal();
    },
    resetImgVideo() {
      // 如果当前file存在且未成功上传且未取消
      if (this.disfile && !this.disfile.isSuccess && !this.disfile.isCancel)
        this.disfile.cancel();

      if (this.form.type == "0") {
        this.processVIO = [];
      }
      if (this.form.type == "1") {
        this.processIMG = [];
      }

      this.SETSTATE({ k: "withcreate", v: true });

      // 计算总数
      this.setTotal();
    },
    uploadFmError(res, file) {
      this.SETSTATE({ k: "withcreate", v: true });
      this.processVIO.forEach(v => {
        if (v.fmname == file.name) {
          v.fmname = "";
          v.fmprocess = "";
        }
      });
    },
    uploadFmRes(res) {
      this.SETSTATE({ k: "withcreate", v: true });

      this.processVIO.forEach(v => {
        if (v.fmname == res.data[0].originName) {
          v.fmUrl = res.data[0].targetName;
          v.fmHash = res.data[0].md5;
        }
      });

      // if (uploading) uploading.close();
      console.log(this.processVIO);
    },
    showUploading(name) {
      this.fmvideoname = name;
      // uploading = Loading.service({
      //   fullscreen: true,
      //   background: "rgba(0, 0, 0, 0.8)",
      //   text: "封面图上传中",
      //   spinner: 'el-icon-loading'
      // });
    },
    uploadFm(file, process) {
      this.disfile = file;

      let self = this;
      this.SETSTATE({ k: "withcreate", v: false });

      // let idx = 0;
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
      this.SETSTATE({ k: "withcreate", v: true });
      this.processVIO = this.processVIO.filter(v => v.name != file.name);
    },
    uploadVioRes(res) {
      this.SETSTATE({ k: "withcreate", v: true });
      // 计算总数
      this.setTotal();

      this.processVIO.forEach(v => {
        if (v.name == res.data[0].originName) {
          v.videoUrl = res.data[0].targetName;
          v.videoHash = res.data[0].md5;
        }
      });
    },
    checkUploadVio(file) {
      if (
        this.processVIO.find(v => v.name == file.name && v.size == file.size)
      ) {
        file.remove();
        Msgwarning("相同视频不可重复上传");
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
    uploadVio(file, process) {
      this.disfile = file;
      this.SETSTATE({ k: "withcreate", v: false });

      let obj = {};
      obj.name = file.name;
      obj.process = process;
      obj.file = file;
      obj.size = file.size;
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
    },
    uploadError(res, file) {
      this.SETSTATE({ k: "withcreate", v: true });
      this.processIMG = this.processIMG.filter(v => v.name != file.name);
    },
    uploadRes(res, file) {
      this.SETSTATE({ k: "withcreate", v: true });
      // 计算总数
      this.setTotal();
      // console.log(res);
      this.processIMG.forEach(v => {
        if (v.name == res.data[0].originName) {
          v.imageUrl = res.data[0].targetName;
          v.imageHash = res.data[0].md5;
        }
      });
    },
    checkUploadPic(file) {
      // console.log(file);
      if (
        this.processIMG.find(v => v.name == file.name && v.size == file.size)
      ) {
        file.remove();
        Msgwarning("相同图片不可重复上传");
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
    uploadPic(file, process) {
      this.disfile = file;
      this.SETSTATE({ k: "withcreate", v: false });

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
      console.log(file);
      if (file && file.isUploading) {
        file.cancel();
        file.remove();
      }
      this.processIMG = this.processIMG.filter(v => v.name != name);

      this.SETSTATE({ k: "withcreate", v: true });

      // 计算总数
      this.setTotal();
    },
    delVIO(file, name) {
      console.log(file);
      if (file && file.isUploading) {
        file.cancel();
        file.remove();
      }
      this.processVIO = this.processVIO.filter(v => v.name != name);

      this.SETSTATE({ k: "withcreate", v: true });

      // 计算总数
      this.setTotal();
    },
    setTotal() {
      let imgvideo = 0;
      if (this.form.type == "0") {
        imgvideo = this.processIMG.length;
      } else if (this.form.type == "1") {
        imgvideo = this.processVIO.length;
      } else {
        imgvideo = this.processIMG.length + this.processVIO.length;
      }

      let cardcount =
        this.form.type == "2"
          ? Math.ceil(imgvideo / this.form2.focuscount)
          : imgvideo;

      this.total =
        cardcount *
        this.form2.titlearr.length *
        this.form2.descarr.length *
        this.form2.actionArr.length;
    },
    delTitle(item) {
      this.form2.titlearr = this.form2.titlearr.filter(v => v != item);
      this.setTotal();
    },
    addTitle() {
      if (this.form2.title == "") {
        Msgwarning("请在文本框内输入想要添加的标题名称");
        return;
      }

      let str = this.form2.title.trim();
      this.form2.titlearr = this.form2.titlearr.filter(v => v != str);
      this.form2.titlearr.push(str);

      this.form2.title = "";
      this.setTotal();
    },
    delDesc(item) {
      this.form2.descarr = this.form2.descarr.filter(v => v != item);
      this.setTotal();
    },
    addDesc() {
      if (this.form2.desc == "") {
        Msgwarning("请在文本框内输入想要添加的文本");
        return;
      }

      let str = this.form2.desc.trim();
      this.form2.descarr = this.form2.descarr.filter(v => v != str);
      this.form2.descarr.push(str);

      this.form2.desc = "";
      this.setTotal();
    },
    selectHomepage() {
      let h = this.allpagelist.filter(v => v.pageId == this.form.homepage)[0];
      if (!h.insId) {
        this.form.homepage = "";
        Msgwarning("此主页无PBIA，请先同步");
      }
    },
    actionChange() {
      this.setTotal();
    },
    cancelAction(idx) {
      this.form2.actionArr = this.form2.actionArr.filter(v => v.code == idx);
    },
    toCancel2() {},
    toSubmit() {
      console.log(this.form2);

      console.log(this.processVIO);
      // return;
      if (!this.withcreate) {
        Msgwarning("图片/视频正在上传中...");
        return;
      }
      if (this.form.type == "0" && this.processIMG.length == 0) {
        Msgwarning("请上传图片");
        return;
      }
      if (this.form.type == "1" && this.processVIO.length == 0) {
        Msgwarning("请上传视频");
        return;
      }
      if (
        this.form.type == "2" &&
        this.processIMG.length + this.processVIO.length < this.form2.focuscount
      ) {
        Msgwarning("图片+视频的数量要≥轮播数量");
        return;
      }
      if (
        (this.form.type == "1" || this.form.type == "2") &&
        this.processVIO.find(v => !v.fmname)
      ) {
        Msgwarning("每个视频都需上传一张封面图");
        return;
      }

      let self = this;
      if (this.form2.descarr.length == 0) {
        Msgwarning("请输入文本");
        return;
      }
      if (this.form2.titlearr.length == 0) {
        Msgwarning("请输入标题");
        return;
      }

      console.log(this.form2.actionArr);
      if (this.form2.actionArr.length == 0) {
        Msgwarning("请选择行动号召");
        return;
      }

      //   console.log(this.form2);

      let countryid = [],
        countryname = [];
      this.form.selectArr.forEach(v => {
        countryid.push(v.code);
        countryname.push(v.name);
      });

      // console.log(this.allpagelist, this.form.homepage);
      let homepage = this.allpagelist.filter(
        v => v.pageId == this.form.homepage
      )[0];

      let option = [];

      let imageVideo =
        this.form.type == "1" ? this.processVIO : this.processIMG;
      // 区分轮播特殊情况
      if (this.form.type == "2") {
        this.processIMG.forEach(v => {
          v.type = "1";
        });
        this.processVIO.forEach(v => {
          v.type = "2";
        });
        let ar = this.processIMG.concat(this.processVIO);
        let card = [],
          image,
          video;

        let rlt = [true];
        console.log(ar);
        ar.forEach(v => {
          if (v.type == "1") {
            image = {
              imageUrl: v.imageUrl,
              imageHash: v.imageHash
            };
            video = {
              videoUrl: "",
              videoHash: ""
            };
          } else {
            image = {
              imageUrl: v.fmUrl,
              imageHash: v.fmHash
            };
            video = {
              videoUrl: v.videoUrl,
              videoHash: v.videoHash
            };
          }
          let obj = {
            cardType: v.type,
            image: image,
            video: video
          };

          /**
           * 2018-10-16新增
           * 对于批量创建轮播创意，视频素材封面图为空的情况
           * 在提交之前拦截，如果素材不全，则提醒并且不提交
           */
          if (v.type == "1") {
            if (
              !image.hasOwnProperty("imageUrl") ||
              image["imageUrl"].trim() == ""
            ) {
              rlt = [false, `${v.name}异常，请重新上传或更换素材`];
            }
          } else {
            if (
              !video.hasOwnProperty("videoUrl") ||
              video["videoUrl"].trim() == ""
            ) {
              rlt = [false, `${v.name}异常，请重新上传或更换素材`];
            }
            if (
              !image.hasOwnProperty("imageUrl") ||
              image["imageUrl"].trim() == ""
            ) {
              rlt = [
                false,
                `${v.name}对应的封面图${v.fmname}异常，请重新上传或更换素材`
              ];
            }
          }

          card.push(obj);
        });

        if (!rlt[0]) {
          Msgerror(rlt[1]);
          return;
        }

        // 如果卡片数量不够，从前部补充
        let cardadd =
          this.form2.focuscount - (card.length % this.form2.focuscount);
        if (cardadd < this.form2.focuscount) {
          card = card.concat(card.slice(0, cardadd));
        }

        // console.log(homepage);
        // card.forEach((a, ai) => {
        for (let i = 0; i < card.length; i += this.form2.focuscount) {
          let a = card.slice(i, i + this.form2.focuscount);
          self.form2.descarr.forEach(b => {
            self.form2.titlearr.forEach(c => {
              // let d = self.form2.actionArr;
              self.form2.actionArr.forEach(d => {
                // 往card里面放置title,3个卡片对应同一个title
                a.forEach(v => {
                  v.cardTitle = c;
                });

                let item = {
                  actionCallOn: d.code,
                  actionCallOnName: d.name,
                  classify: self.form.classify.trim(),
                  countryId: countryid.join(","),
                  countryName: countryname.join(","),
                  // createTime: "2018-07-24T05:46:07.326Z",
                  // creater: "string",
                  // creativityName: "string",
                  creativityText: b,
                  // creativityTitle: c,
                  creativityType: self.form.type,
                  deeplink: self.form.deeplink,
                  card: JSON.stringify(a),
                  // id: 0,
                  // imageUrl:
                  //   self.form.type == "0"
                  //     ? JSON.stringify(a)
                  //     : JSON.stringify(obj),
                  // imageName: self.form.type == "1" ? fmname : imgname,
                  pageId: homepage.pageId,
                  pageLogo: homepage.picture,
                  pageName: homepage.name,
                  projectId: self.$route.params.id,
                  sex: this.form.sex == "0" ? "1,2" : this.form.sex,
                  // status: 0,
                  token: self.xtoken
                  // videoUrl: self.form.type == "1" ? JSON.stringify(a) : "",
                  // videoName: self.form.type == "1" ? imgname : ""
                };

                option.push(item);
              });
            });
          });
        }
        // });
      } else {
        // console.log(homepage);
        imageVideo.forEach((a, ai) => {
          let imgname = a.name,
            obj,
            fmname;
          delete a["name"];
          delete a["file"];
          delete a["process"];
          delete a["size"];
          console.log(a["fmname"]);
          if (a["fmname"]) {
            fmname = a["fmname"];
            obj = {
              imageUrl: a["fmUrl"],
              imageHash: a["fmHash"]
            };

            delete a["fmname"];
            delete a["fmUrl"];
            delete a["fmprocess"];
            delete a["fmHash"];
          }
          self.form2.descarr.forEach(b => {
            self.form2.titlearr.forEach(c => {
              // let d = self.form2.actionArr;
              self.form2.actionArr.forEach(d => {
                let item = {
                  actionCallOn: d.code,
                  actionCallOnName: d.name,
                  classify: self.form.classify.trim(),
                  countryId: countryid.join(","),
                  countryName: countryname.join(","),
                  // createTime: "2018-07-24T05:46:07.326Z",
                  // creater: "string",
                  // creativityName: "string",
                  creativityText: b,
                  creativityTitle: c,
                  creativityType: self.form.type,
                  deeplink: self.form.deeplink,
                  // id: 0,
                  imageUrl:
                    self.form.type == "0"
                      ? JSON.stringify(a)
                      : JSON.stringify(obj),
                  imageName: self.form.type == "1" ? fmname : imgname,
                  pageId: homepage.pageId,
                  pageLogo: homepage.picture,
                  pageName: homepage.name,
                  projectId: self.$route.params.id,
                  sex: this.form.sex == "0" ? "1,2" : this.form.sex,
                  // status: 0,
                  token: self.xtoken,
                  videoUrl: self.form.type == "1" ? JSON.stringify(a) : "",
                  videoName: self.form.type == "1" ? imgname : ""
                };
                /**
                 * 2018-10-12新增
                 * 线上出现批量新增创意imageUrl无数据的情况
                 * 2019-03-07
                 * 线上出现批量新增单视频创意videoUrl无数据的情况
                 * 暂时做强制排除处理
                 */
                if (item.imageUrl.length < 10)
                  Msgerror(`imageName: ${imgname} 创建失败，请重新创新`);
                else if (item.videoUrl.length < 10)
                  Msgerror(`videoName: ${imgname} 创建失败，请重新创新`);
                else option.push(item);
              });
            });
          });
        });
      }

      // console.log(option);
      // return;

      this.$store.dispatch("addCreates", { option, id: this.$route.params.id });

      this.dialogFormVisible2 = false;

      this.toReset();
    },
    toNext() {
      let data = this.form;

      for (let i in data) {
        if (data[i] === "" || data[i].length == 0) {
          if (this.msg[i] && this.msg[i].trim() != "") {
            Msgwarning(this.msg[i]);
            return;
          }
        }
      }

      this.dialogFormVisible = false;

      setTimeout(v => {
        this.dialogFormVisible2 = true;
      }, 300);
    },
    toPrev() {
      this.dialogFormVisible2 = false;

      this.$emit("prevAddcreate", "status5");
    },
    toCancel() {
      // 复位
      // this.toReset();

      this.$emit("cancelAddbm", "status5");
    },
    toReset() {
      //reset
      this.form.selectArr = [];
      this.form.sex = "0";
      this.form.homepage = "";
      this.form.classify = "";
      this.form.deeplink = "";

      // this.$refs.uploadfile1.clearFiles();
      this.processIMG = [];
      this.processVIO = [];
      this.form2.imgvideo = [];
      this.form2.descarr.length = 0;
      this.form2.desc = "";
      this.form2.titlearr.length = 0;
      this.form2.title = "";
      this.form2.actions = "";
      this.form2.actionArr = [];
      this.form2.focuscount = 3;

      this.total = 0;
    },
    // 分类匹配功能
    querySearchAsyncClassify(queryString, cb) {
      var restaurants = this.createclassify;
      var results = queryString
        ? restaurants.filter(this.createStateFilterClassify(queryString))
        : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilterClassify(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelectClassify(item) {
      this.form.classify = item.value;
    }
  }
};
</script>
<style lang="less">
.fileinput {
  position: absolute;
  left: 0;
  top: 4px;
  width: 80px;
  height: 32px;
  // cursor: pointer;
  input[name="file"] {
    width: 80px;
    height: 32px;
    background-color: #000;
    position: absolute;
    top: 0;
    opacity: 0;
    // cursor: pointer;
  }
}
.uploadFmbox {
  position: absolute;
  left: 160px;
  top: 16px;
  width: 80px;
  height: 16px;
}
.fileinputfm {
  width: 80px;
  height: 16px;
  display: block;
  // cursor: pointer;
  input[name="file"] {
    width: 80px;
    height: 16px;
    background-color: #000;
    position: absolute;
    top: 0;
    opacity: 0;
    // cursor: pointer;
  }
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
.cline {
  // width: 50%;
  // float: left;
}
.card {
  background-color: #f8f9fb;
  padding: 20px 0 1px 0;
  margin-bottom: 22px;
  .cartitle {
    width: 90%;
  }
  .cardname {
    padding-left: 20px;
    margin-bottom: 20px;
    .title {
      font-size: 18px;
      margin-right: 10px;
    }
    .cardtotal {
      color: #666;
    }
  }
}
.cbutton {
  width: 100%;
  float: left;
  padding-right: 80px;
  box-sizing: border-box;
  text-align: center;
}
.uploadfile {
  overflow: hidden;
}
.textarea {
  max-height: 85px;
  min-height: 85px;
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
.el-select {
  // width: 217px;
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
.moreInfo {
  //   margin-left: 80px;
  //   margin-bottom: 20px;
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
