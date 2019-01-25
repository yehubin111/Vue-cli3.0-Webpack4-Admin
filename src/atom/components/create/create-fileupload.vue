<template>
    <div class="fileupload">
        <el-button v-show="processfile.length == 0" class="moreInfo" type="primary" size="small">上传图片</el-button>
        <vue-file-upload v-show="processfile.length == 0" @uploadProcess="uploadProcess" @uploadSuccess="uploadSuccess" @uploadError="uploadError" name="file" class="fileinput" :url="uploadFileUrl" :events="eventsIMG" autoUpload :requestOptions="fileOption" :filters="imgfilters">
            <span slot="label"></span>
        </vue-file-upload>
        <ul class="reslist">
            <transition-group name="fade">
                <li v-for="(item, index) in processfile" :key="index">
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
                    <!-- <div class="imgshow">
                  <img :src="'http://172.31.1.45' + imgShow" alt="">
                </div> -->
                    <i class="el-icon-error processclose" @click="delIMG(item.file)"></i>
                </li>
            </transition-group>
        </ul>
    </div>
</template>

<script>
import VueFileUpload from "vue-file-upload";
import baseurl from "../../js/baseurl";
export default {
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
      processfile: [],
      eventsIMG: {
        onProgressUpload(file, process) {
          console.log(file.name);
          this.vm.$emit("uploadProcess", file, process);
        },
        onSuccessUpload(file, response, status, headers) {
          if (response.code != 0) {
            Msgerror(response.msg);
            this.vm.$emit("uploadError", response, file);
            return;
          }
          this.vm.$emit("uploadSuccess", response);
        }
      }
    };
  },
  computed: {
    uploadFileUrl() {
      return `${baseurl[process.env.NODE_ENV].UPLOAD_URL}/file/`;
    }
  },
  methods: {
    uploadSuccess(res) {
      this.ifcreate = true;
      // console.log(res);

      this.processfile.forEach(v => {
        if (v.name == res.data[0].originName) {
          v.imageUrl = res.data[0].targetName;
          v.imageHash = res.data[0].md5;
        }
      });

      // this.imgShow = res.data[0].targetName;
      console.log(this.processfile);
    },
    uploadError(res, file) {
      this.ifcreate = true;
      this.processfile = this.processfile.filter(v => v.name != file.name);
    },
    uploadProcess(file, process) {
      this.disfile = file;
      this.ifcreate = false;

      let obj = {};
      obj.name = file.name;
      obj.process = process;
      obj.size = file.size;
      obj.file = file;

      this.processfile.forEach(v => {
        if (v.name == file.name) {
          v.process = process;
        }
      });
      if (!this.processfile.find(v => v.name == file.name)) {
        this.processfile.push(obj);
      }
    },
    delIMG(file) {
      file.cancel();
      this.processfile = this.processfile.filter(v => v.name != file.name);

      this.ifcreate = true;
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
</style>
