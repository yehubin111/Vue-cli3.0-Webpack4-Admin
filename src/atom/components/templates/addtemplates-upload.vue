<template>
  <div class="uploadfile">
    <el-button size="mini" class="button" type="primary" :disabled="disabled">上传</el-button>
    <vue-file-upload
      ref="vueFileUploaderSINGER"
      @matchMD5="matchMD5"
      @onAdd="onAddItem"
      @uploadPic="uploadPic"
      @uploadRes="uploadRes"
      @uploadError="uploadError"
      name="file"
      class="fileuploadinput"
      :url="uploadFileUrl"
      :events="eventsIMG"
      :requestOptions="fileOption"
      :filters="imgfilters"
      :multiple="type == 'MUTIPLE'"
      v-show="!disabled"
    >
      <span slot="label"></span>
    </vue-file-upload>
  </div>
</template>

<script>
import VueFileUpload from "vue-file-upload";
import BMF from "browser-md5-file";
import { Msgwarning, Msgsuccess, Msgerror } from "../../js/message";
import baseurl from "../../js/baseurl";
import { mapState, mapMutations } from "vuex";
let bmf = new BMF();
export default {
  props: {
    // 类型 SINGLE MUTIPLE
    type: {
      type: String,
      default: "SINGLE"
    },
    // disabled
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VueFileUpload
  },
  data() {
    return {
      fileOption: {
        headers: {
          "X-Token": localStorage.getItem("atom_token")
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
      processIMG: [],
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
      }
    };
  },
  watch: {
    wantupload(n, v) {
      console.log("create-add wantupload:", n);
      if (n != 0 && n == this.uploadsize) {
        console.log("%ccreate-add all ready", "color: red");
        this.$refs[this.dom].uploadAll();
      }
    }
  },
  computed: {
    ...mapState(["wantupload"]),
    uploadFileUrl() {
      return `${baseurl[process.env.VUE_APP_URLBASE].UPLOAD_URL}/file/`;
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    resetUploaded(url) {
      this.processIMG = this.processIMG.filter(v => v.imageUrl != url);
    },
    /**
     * 20181107新增，图片视频素材库
     * 选择文件之后，JS获取MD5值（brower-file-md5），传到后台，如果已上传过，则进度直接为100%
     */
    matchMD5(md5, file, type) {
      // 单图情况，上传之前需要清空原先的
      if (this.type == "SINGLE") this.processIMG = [];

      this.dom =
        type == "img" ? "vueFileUploaderSINGER" : "vueFileUploaderVioSINGER";

      // console.log(md5, file, type);
      this.$store.dispatch("matchMutiFileMD5", {
        md5: [md5],
        file,
        list: type == "img" ? this.processIMG : this.processVIO,
        type,
        on: "",
        vdname: this.fmvideoname,
        callback: (res) => {
          this.processIMG.forEach(v => {
            if(v.imageHash == res.data[0].md5) {
              v.imageWidth = res.data[0].width;
              v.imageHeight = res.data[0].height;
            }
          })
          this.$emit("imgUploading", this.processIMG);
        }
      });
    },
    onAddItem(files) {
      console.log(files);
      this.SETSTATE({ k: "wantupload", v: 0 });
      this.uploadsize = files.length;
      console.log("create-add this.uploadsize:", this.uploadsize);
    },
    uploadRes(res) {
      //   this.SETSTATE({ k: "addcreate", v: true });

      this.processIMG.forEach(v => {
        if (v.name == res.data[0].originName) {
          v.imageUrl = res.data[0].targetName;
          v.imageHash = res.data[0].md5;
          v.imageWidth = res.data[0].width;
          v.imageHeight = res.data[0].height;
        }
      });
      this.$emit("imgUploading", this.processIMG);
    },
    uploadError(res, file) {
      //   this.SETSTATE({ k: "addcreate", v: true });
      this.processIMG = this.processIMG.filter(v => v.name != file.name);
    },
    uploadPic(file, process) {
      this.disfile = file;
      //   this.SETSTATE({ k: "addcreate", v: false });

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
      // 单图情况，支持进度条
      if(this.type == "SINGLE")
        this.$emit("imgUploading", this.processIMG);
    },
    delIMG(file, name) {
      if (file && file.isUploading) {
        file.cancel();
        file.remove();
      }
      this.processIMG = this.processIMG.filter(v => v.name != name);

      //   this.SETSTATE({ k: "addcreate", v: true });
    }
  }
};
</script>
<style lang="less">
.fileuploadinput {
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
</style>

<style lang="less" scoped>
.uploadfile {
  display: inline-block;
  position: relative;
  width: 56px;
  height: 28px;
}
.button{
  display: block;
}
.fileuploadinput {
  position: absolute;
  cursor: pointer;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 56px;
  height: 28px;
  // cursor: pointer;
}
</style>
