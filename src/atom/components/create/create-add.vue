<template>
  <el-dialog
    title="新增创意"
    :visible.sync="dialogFormVisible"
    class="dialog createdialog"
    @close="toCancel"
  >
    <el-form ref="form" :model="form" label-width="80px" class="cform">
      <div class="leftform">
        <el-form-item label="性别" class="cline">
          <el-radio-group v-model="form.sex">
            <el-radio label="0">全部</el-radio>
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创意类型" class="cline">
          <el-radio-group v-model="form.type" @change="resetImgVideo">
            <el-radio label="0">单图片</el-radio>
            <el-radio label="1">单视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="form.type == 0" label="图片" class="cline uploadfile">
          <el-button
            v-show="processIMG.length == 0"
            class="moreInfo"
            type="primary"
            size="small"
          >上传图片</el-button>
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
        <el-form-item v-show="form.type == 1" label="视频" class="cline uploadfile">
          <el-button
            v-show="processVIO.length == 0"
            class="moreInfo"
            type="primary"
            size="small"
          >上传视频</el-button>
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
            <!-- <transition-group name="fade"> -->
            <li
              v-for="(item, index) in processVIO"
              :key="index"
              @mouseover="fmvideoname = item.name"
            >
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
              <i
                class="el-icon-error processclose processvideo"
                @click="delVIO(item.file, item.name)"
              ></i>
            </li>
            <!-- </transition-group> -->
          </ul>
        </el-form-item>
        <el-form-item label="deeplink" class="cline">
          <el-input v-model="form.deeplink" placeholder="可跳转到APP指定页面，选填，为空则仅下载APP"></el-input>
        </el-form-item>
      </div>
      <div class="leftform">
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
        <el-form-item label="主页" class="cline">
          <el-select
            v-model="form.homepage"
            placeholder="请选择主页"
            filterable
            @change="selectHomepage"
          >
            <el-option
              v-for="(l,index) in commonpage"
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
            <el-option
              v-for="(l, index) in allactions"
              :key="index"
              :label="l.name"
              :value="l.code"
            ></el-option>
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
import { mapState, mapGetters, mapMutations } from "vuex";
import baseurl from "../../js/baseurl";
let bmf = new BMF();
export default {
  props: ["status"],
  components: {
    VueFileUpload
  },
  data() {
    return {
      ifcreate: true, // 为false则视频或者图片正在上传中，此时无法提交当前表单
      dialogImageUrl: "",
      dialogVisible: false,
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
      uploadsize: 0, // 当前选择的将要上传的文件数量
      dom: "", // 当前使用的vue-file-upload ref
      processIMG: [],
      // imgShow: "",
      processVIO: [],
      // urlShow: "",
      // fmShow: "",
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
          // console.log(file);
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
  mounted() {},
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;
    },
    wantupload(n, v) {
      console.log("create-add wantupload:", n);
      if (n != 0 && n == this.uploadsize) {
        console.log("%ccreate-add all ready", "color: red");
        this.$refs[this.dom].uploadAll();
      }
    }
  },
  computed: {
    ...mapState(["othercountries", "commonpage", "addcreate", "wantupload"]),
    ...mapGetters(["createclassify", "allactions"]),
    uploadFileUrl() {
      return `${baseurl[process.env.VUE_APP_URLBASE].UPLOAD_URL}/file/`;
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    /**
     * 20181107新增，图片视频素材库
     * 选择文件之后，JS获取MD5值（brower-file-md5），传到后台，如果已上传过，则进度直接为100%
     */
    matchMD5(md5, file, type) {
      this.dom =
        type == "img" ? "vueFileUploaderSINGER" : "vueFileUploaderVioSINGER";

      // console.log(md5, file, type);
      this.$store.dispatch("matchMutiFileMD5", {
        md5: [md5],
        file,
        list: type == "img" ? this.processIMG : this.processVIO,
        type,
        on: "addcreate",
        vdname: this.fmvideoname
      });
    },
    onAddItem(files) {
      console.log(files);
      this.SETSTATE({ k: "wantupload", v: 0 });
      this.uploadsize = files.length;
      console.log("create-add this.uploadsize:", this.uploadsize);
    },
    // 切换图片、视频、轮播
    resetImgVideo() {
      console.log(this.disfile);
      // 如果当前file存在且未成功上传且未取消
      if (this.disfile && !this.disfile.isSuccess && !this.disfile.isCancel)
        this.disfile.cancel();

      if (this.form.type == "0") {
        this.processVIO = [];
      } else {
        this.processIMG = [];
      }

      this.SETSTATE({ k: "addcreate", v: true });
    },
    // 封面图上传错误回调
    uploadFmError(res, file) {
      this.SETSTATE({ k: "addcreate", v: true });
      this.processVIO.forEach(v => {
        if (v.fmname == file.name) {
          v.fmname = "";
          v.fmprocess = "";
        }
      });
    },
    // 封面图上传完成回调
    uploadFmRes(res) {
      this.SETSTATE({ k: "addcreate", v: true });

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
      this.SETSTATE({ k: "addcreate", v: false });

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
      this.SETSTATE({ k: "addcreate", v: true });
      this.processVIO = this.processVIO.filter(v => v.name != file.name);
    },
    uploadVioRes(res) {
      this.SETSTATE({ k: "addcreate", v: true });

      this.processVIO.forEach(v => {
        if (v.name == res.data[0].originName) {
          v.videoUrl = res.data[0].targetName;
          v.videoHash = res.data[0].md5;
        }
      });
    },
    uploadVio(file, process) {
      this.disfile = file;
      this.SETSTATE({ k: "addcreate", v: false });

      let obj = {};
      obj.name = file.name;
      obj.process = process;
      obj.file = file;
      obj.size = file.size;
      obj.fmname = "";
      obj.fmprocess = 0;

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

      this.SETSTATE({ k: "addcreate", v: true });
    },
    uploadRes(res) {
      this.SETSTATE({ k: "addcreate", v: true });

      this.processIMG.forEach(v => {
        if (v.name == res.data[0].originName) {
          v.imageUrl = res.data[0].targetName;
          v.imageHash = res.data[0].md5;
        }
      });
    },
    uploadError(res, file) {
      this.SETSTATE({ k: "addcreate", v: true });
      this.processIMG = this.processIMG.filter(v => v.name != file.name);
    },
    uploadPic(file, process) {
      this.disfile = file;
      this.SETSTATE({ k: "addcreate", v: false });

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

      this.SETSTATE({ k: "addcreate", v: true });
    },
    selectHomepage() {
      let h = this.commonpage.filter(v => v.pageId == this.form.homepage)[0];
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
      console.log(this.processVIO);
      if (data["type"] == 0 && this.processIMG.length == 0)
        return [false, this.msg["imginfo"]];
      if (data["type"] == 1 && this.processVIO.length == 0)
        return [false, this.msg["videoinfo"]];
      if (data["type"] == 1 && !this.processVIO[0].fmname)
        return [false, this.msg["fminfo"]];
      if (data["selectArr"].length == 0) return [false, this.msg["selectArr"]];
      if (data["homepage"] == "") return [false, this.msg["homepage"]];
      if (data["classify"].trim() == "") return [false, this.msg["classify"]];
      if (data["desc"] == "") return [false, this.msg["desc"]];
      if (data["title"] == "") return [false, this.msg["title"]];
      if (data["actions"] === "") return [false, this.msg["actions"]];

      return [true];
    },
    onSubmit() {
      console.log(this.form);
      if (!this.addcreate) {
        Msgwarning("图片/视频正在上传中...");
        return;
      }
      let data = this.form;

      let check = this.checkCondition();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }

      let countryid = [],
        countryname = [];

      this.form.selectArr.forEach(v => {
        countryid.push(v.code);
        countryname.push(v.name);
      });

      let homepage = this.commonpage.filter(
        v => v.pageId == this.form.homepage
      )[0];
      let action = this.allactions.filter(v => v.code == this.form.actions)[0];

      let imgobj = {
        imageUrl:
          this.form.type == 0
            ? this.processIMG[0].imageUrl
            : this.processVIO[0].fmUrl,
        imageHash:
          this.form.type == 0
            ? this.processIMG[0].imageHash
            : this.processVIO[0].fmHash
      };

      let videoobj = null;
      if (this.form.type == 1) {
        videoobj = {
          videoUrl: this.processVIO[0].videoUrl,
          videoHash: this.processVIO[0].videoHash
        };
      }

      let option = {
        actionCallOn: action.code,
        actionCallOnName: action.name,
        classify: this.form.classify.trim(),
        countryId: countryid.join(","),
        countryName: countryname.join(","),
        creativityName: this.form.name,
        creativityText: this.form.desc,
        creativityTitle: this.form.title,
        creativityType: this.form.type,
        deeplink: this.form.deeplink,
        imageUrl: JSON.stringify(imgobj),
        pageId: homepage.pageId,
        pageLogo: homepage.picture,
        pageName: homepage.name,
        projectId: this.$route.params.id,
        sex: this.form.sex == "0" ? "1,2" : this.form.sex,
        // status: 0,
        token: this.xtoken,
        videoUrl: videoobj ? JSON.stringify(videoobj) : ""
      };

      this.$store.dispatch("toAddCreate", {
        option,
        id: this.$route.params.id
      });

      // this.dialogFormVisible = false;
      return true;
    },
    toReset() {
      // 如果当前file存在且未成功上传且未取消
      if (this.disfile && !this.disfile.isSuccess && !this.disfile.isCancel)
        this.disfile.cancel();
      this.processVIO = [];
      this.processIMG = [];
      this.SETSTATE({ k: "addcreate", v: true });

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

      //   this.$refs.uploadfile.forEach(v => {
      //     v.clearFiles();
      //   });
    },
    toCancel() {
      // 复位
      this.toReset();

      this.$emit("cancelAddbm", "status4");
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
  height: 148px;
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
