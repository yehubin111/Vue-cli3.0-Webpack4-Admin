<template>
  <div class="upload">
    <el-button size="mini" type="primary">上传</el-button>
    <vue-file-upload
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
        callback: () => {
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

<style lang="less" scoped>
.upload {
  display: inline-block;
}
.fileinput {
  width: 56px;
  height: 28px;
  margin-top: 3px;
  cursor: pointer;
  overflow: hidden;
}
</style>
