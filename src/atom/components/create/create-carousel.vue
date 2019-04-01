<template>
  <el-dialog title="新增轮播创意" :visible.sync="dialogFormVisible" class="dialog createdialog" @close="toCancel">
    <el-form ref="form" :model="form" label-width="80px" class="cform">
      <div class="leftform">
        <!-- <el-form-item label="创意名称" class="cline">
          <el-input v-model="form.name" placeholder="请输入创意名称"></el-input>
        </el-form-item> -->
        <el-form-item label="性别" class="cline">
          <el-radio-group v-model="form.sex">
            <el-radio label="0">全部</el-radio>
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="" class="cline"> -->
        <div class="carousellist">
          <div class="add" v-if="tablist.length < 10" style="margin-bottom: 20px;">
            <el-button size="small" type="primary" @click="addTab(tabvalue)">
              +
            </el-button>
          </div>
          <el-tabs v-model="tabvalue" type="card">
            <el-tab-pane v-for="(item, index) in tablist" :key="item.name" :label="index + 1 + ''" :name="item.name">
              <i v-show="tablist.length > 3" class="el-icon-close cardremove" @click="removeTab(item.name)"></i>
              <el-form-item label="类型" class="cline">
                <el-radio-group v-model="item.type" @change="resetImgVideo(item.name)">
                  <el-radio label="1">图片</el-radio>
                  <el-radio label="2">视频</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-show="item.type == '1'" label="图片" class="cline uploadfile">
                <el-button v-show="item.processIMG.length == 0" class="moreInfo" type="primary" size="small">上传图片</el-button>
                <div class="filebutton">
                  <vue-file-upload v-show="item.processIMG.length == 0" @checkUpload="checkUpload" @uploadPic="uploadPic" @uploadRes="uploadRes" @uploadError="uploadError" name="file" class="fileinput" :url="uploadFileUrl" :events="eventsIMG" :requestOptions="fileOption" :filters="imgfilters">
                    <span slot="label"></span>
                  </vue-file-upload>
                </div>
                <ul class="reslist">
                  <!-- <transition-group name="fade"> -->
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
                  <!-- </transition-group> -->
                </ul>
              </el-form-item>
              <el-form-item v-show="item.type == '2'" label="视频" class="cline uploadfile">
                <el-button v-show="item.processVIO.length == 0" class="moreInfo" type="primary" size="small">上传视频</el-button>
                <vue-file-upload v-show="item.processVIO.length == 0" @checkUpload="checkUploadVio" @uploadVio="uploadVio" @uploadVioRes="uploadVioRes" @uploadVioError="uploadVioError" name="file" class="fileinput" :url="uploadFileUrl" :events="eventsVIO" :requestOptions="fileOption" :filters="videofilters">
                  <span slot="label"></span>
                </vue-file-upload>
                <ul class="reslist">
                  <!-- <transition-group name="fade"> -->
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
                        <vue-file-upload v-show="!g.fmname && g.process == 100" @checkUploadFm="checkUploadFm" @uploadFm="uploadFm" @uploadFmRes="uploadFmRes" @uploadFmError="uploadFmError" name="file" class="fileinputfm" :url="uploadFileUrl" :events="eventsFM" :requestOptions="fileOptionFM" :filters="imgfilters">
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
                  <!-- </transition-group> -->
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
      </div>
      <div class="leftform">
        <el-form-item label="国家" class="cline">
          <el-select class="search" v-model="form.selectArr" filterable multiple remote placeholder="请选择国家，可搜索">
            <el-option v-for="item in othercountries" :key="item.code" :label="item.name +'(' + item.code + ')'" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主页" class="cline">
          <el-select v-model="form.homepage" placeholder="请选择主页" filterable @change="selectHomepage">
            <el-option v-for="(l,index) in allpagelist" :key="index" :label="l.name" :value="l.pageId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类" class="cline">
          <el-autocomplete class="search" v-model="form.classify" :fetch-suggestions="querySearchAsyncClassify" placeholder="请输入分类，可搜索" suffix-icon="el-icon-search" @select="handleSelectClassify"></el-autocomplete>
        </el-form-item>
        <el-form-item label="文本" class="cline">
          <el-input type="textarea" v-model="form.desc" class="textarea" placeholder="请输入文字说明，介绍推广内容" :autosize="{ minRows: 3.5, maxRows: 3.5 }"></el-input>
        </el-form-item>
        <el-form-item label="deeplink" class="cline">
          <el-input v-model="form.deeplink" placeholder="可跳转到APP指定页面，选填，为空则仅下载APP"></el-input>
        </el-form-item>
        <el-form-item label="行动号召" class="cline">
          <el-select v-model="form.actions" placeholder="行动号召">
            <el-option v-for="(l, index) in allactions" :key="index" :label="l.name" :value="l.code"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item class="cbutton">
        <el-button type="primary" @click="onSubmitOnly">立即创建</el-button>
        <el-button type="primary" @click="onSubmitNext">保存并下一个</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import VueFileUpload from "vue-file-upload";
import BMF from "browser-md5-file";
import { Msgwarning, Msgsuccess, Msgerror } from "../../js/message";
import { mapState, mapGetters } from "vuex";
import baseurl from "../../js/baseurl";
let bmf = new BMF();
export default {
  props: ["status"],
  components: {
    VueFileUpload
  },
  data() {
    return {
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
      tabvalue: "t1",
      tabindex: 3,
      dialogImageUrl: "",
      state: "",
      timeout: null,
      restaurants: [],
      xtoken: localStorage.getItem("atom_token"),
      form: {
        name: "",
        sex: "0",
        type: "0",
        deeplink: "",
        homepage: "",
        classify: "",
        selectArr: [],
        // imgvideo: "",
        desc: "",
        title: "",
        actions: ""
        // videoUrl: ""
      },
      msg: {
        name: "创意名称不可以为空",
        homepage: "请选择主页",
        classify: "请输入分类",
        desc: "请输入文本",
        title: "请输入标题",
        selectArr: "请选择国家",
        actions: "请选择行动号召",
        deeplink: "",
        imginfo: "请上传图片",
        videoinfo: "请上传视频",
        fminfo: "请上传封面图"
      },
      dialogFormVisible: false,
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
      //   processIMG: [],
      //   processVIO: [],
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
      //   fmvideoname: "",
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
  mounted() {},
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;
    }
  },
  computed: {
    ...mapState(["othercountries", "allpagelist", 'cardcreate']),
    ...mapGetters(["createclassify", "allactions"]),
    uploadFileUrl() {
      return `${baseurl[process.env.VUE_APP_URLBASE].UPLOAD_URL}/file/`;
    }
  },
  methods: {
    /**
     * 20181107新增，图片视频素材库
     * 选择文件之后，JS获取MD5值（brower-file-md5），传到后台，如果已上传过，则进度直接为100%
     */
    matchMD5(md5, file, type) {
      // this.dom = type == "img" ? "vueFileUploaderSINGER" : "vueFileUploaderVioSINGER";

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
      let h = this.allpagelist.filter(v => v.pageId == this.form.homepage)[0];
      if (!h.insId) {
        this.form.homepage = "";
        Msgwarning("此主页无PBIA，请先同步");
      }
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
    },
    onSubmitNext() {
      if (this.onSubmit()) this.toReset();
    },
    onSubmitOnly() {
      if (this.onSubmit()) this.dialogFormVisible = false;
    },
    checkCondition() {
      let data = this.form;

      // if (data["name"] === "") return [false, this.msg["name"]];

      let result;
      for (let i = 0; i < this.tablist.length; i++) {
        let v = this.tablist[i];

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

      if (data["selectArr"].length == 0) return [false, this.msg["selectArr"]];
      if (data["homepage"] == "") return [false, this.msg["homepage"]];
      if (data["classify"].trim() == "") return [false, this.msg["classify"]];
      if (data["desc"] == "") return [false, this.msg["desc"]];
      if (data["actions"] === "") return [false, this.msg["actions"]];

      return [true];
    },
    onSubmit() {
      console.log(this.tablist);
      let check = this.checkCondition();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }

      let data = this.form;

      let countryid = [],
        countryname = [];

      this.form.selectArr.forEach(v => {
        countryid.push(v.code);
        countryname.push(v.name);
      });

      let homepage = this.allpagelist.filter(
        v => v.pageId == this.form.homepage
      )[0];
      let action = this.allactions.filter(v => v.code == this.form.actions)[0];

      let card = [];
      let rlt = [true];
      console.log(this.tablist);
      this.tablist.forEach((v, i) => {
        let image, video;
        if (v.type == "1") {
          image = {
            imageUrl: v.processIMG[0].imageUrl,
            imageHash: v.processIMG[0].imageHash
          };
          video = {
            videoUrl: "",
            videoHash: ""
          };
        } else {
          image = {
            imageUrl: v.processVIO[0].fmUrl,
            imageHash: v.processVIO[0].fmHash
          };
          video = {
            videoUrl: v.processVIO[0].videoUrl,
            videoHash: v.processVIO[0].videoHash
          };
        }
        let obj = {
          cardType: v.type,
          image: image,
          video: video,
          cardTitle: v.title,
          cardDeepLink: v.deeplink
        };
        /**
         * 2018-10-16新增
         * 对于单独创建轮播创意，视频素材封面图为空的情况
         * 在提交之前拦截，如果素材不全，则提醒并且不提交
         */
        if (v.type == "1") {
          if (
            !image.hasOwnProperty("imageUrl") ||
            image["imageUrl"].trim() == ""
          ) {
            rlt = [false, `${v.processIMG[0].name}异常，请重新上传或更换素材`];
          }
        } else {
          if (
            !video.hasOwnProperty("videoUrl") ||
            video["videoUrl"].trim() == ""
          ) {
            rlt = [false, `${v.processVIO[0].name}异常，请重新上传或更换素材`];
          }
          if (
            !image.hasOwnProperty("imageUrl") ||
            image["imageUrl"].trim() == ""
          ) {
            rlt = [
              false,
              `${v.processVIO[0].name}对应的封面图${v.processVIO[0].fmname}异常，请重新上传或更换素材`
            ];
          }
        }

        card.push(obj);
      });

      if (!rlt[0]) {
        Msgerror(rlt[1]);
        return;
      }

      let option = {
        actionCallOn: action.code,
        actionCallOnName: action.name,
        classify: this.form.classify.trim(),
        countryId: countryid.join(","),
        countryName: countryname.join(","),
        creativityName: this.form.name,
        creativityText: this.form.desc,
        // creativityTitle: this.form.title,
        creativityType: "2",
        deeplink: this.form.deeplink,
        card: JSON.stringify(card),
        // imageUrl: JSON.stringify(imgobj),
        pageId: homepage.pageId,
        pageLogo: homepage.picture,
        pageName: homepage.name,
        projectId: this.$route.params.id,
        sex: this.form.sex == "0" ? "1,2" : this.form.sex,
        // status: 0,
        token: this.xtoken
        // videoUrl: videoobj ? JSON.stringify(videoobj) : ""
      };

      this.$store.dispatch("toAddCreate", {
        option,
        id: this.$route.params.id
      });

      // this.dialogFormVisible = false;
      return true;
    },
    toReset() {
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

      this.form.name = "";
      this.form.sex = "0";
      this.form.type = "0";
      this.form.deeplink = "";
      this.form.homepage = "";
      this.form.classify = "";
      this.form.selectArr = [];
      // this.form.imgvideo = "";
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

      //   this.$refs.uploadfile.forEach(v => {
      //     v.clearFiles();
      //   });
    },
    toCancel() {
      // 复位
      this.toReset();

      this.$emit("cancelAddbm", "status9");
    }
  }
};
</script>

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
.carousellist {
  position: relative;
  width: 90%;
  .add {
    position: absolute;
    right: -60px;
    top: 5px;
    z-index: 19;
    .el-button {
      font-size: 22px;
      width: 39px;
      height: 32px;
      padding: 0;
      line-height: 32px;
      text-align: center;
    }
  }
}
.search {
  width: 100%;
}
.leftform {
  width: 50%;
  float: left;
}
.cbutton {
  width: 100%;
  float: left;
  padding-right: 80px;
  box-sizing: border-box;
  text-align: center;
}
.uploadfile {
  //   height: 148px;
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
.cardremove {
  position: absolute;
  right: 0;
  cursor: pointer;
  z-index: 22;
}
</style>
