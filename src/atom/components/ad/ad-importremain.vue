<template>
  <el-dialog title="导入AppsFlyer留存数据" :visible="status" @close="hideBox">
    <div v-show="!submitresult">
      <el-form label-width="90px" label-position="left">
        <el-form-item label="系统">
          <el-radio-group v-model="system" @change="systemChange">
            <el-radio label="Android"></el-radio>
            <el-radio label="iOS"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据日历" class="relativeform">
          <um-calendar
            :dayOn.sync="calendardate"
            ref="umCalendar"
            @monthChange="monthChange"
            :disabledDate="disabledDate"
          ></um-calendar>
          <el-tooltip
            class="item"
            effect="dark"
            content="亮起日期有数据，建议上传无数据的日期。上传亮起日期的留存，旧数据会被覆盖"
            placement="top-start"
          >
            <i class="el-icon-question elnotice"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="上传文件" class="relativeform">
          <div class="csvline" v-for="(csv, index) in processCSV" :key="index">
            <p class="file" :title="csv.name">{{csv.name}}</p>
            <i class="el-icon-error close" @click="deleteCSV(index)"></i>
            <el-tooltip class="item" effect="dark" :content="csv.resultMsg" placement="top-start">
              <i class="el-icon-warning warn" v-show="csv.resultMsg"></i>
            </el-tooltip>
            <i class="el-icon-success successcsv" v-show="!csv.resultMsg"></i>
          </div>
          <el-button type="primary" size="small" :loading="fileload">上传文件</el-button>
          <vue-file-upload
            ref="vueFileUploader"
            @uploadPic="uploadPic"
            @uploadRes="uploadRes"
            name="files"
            class="fileinput"
            :autoUpload="true"
            :url="uploadFileUrl"
            :events="eventsCSV"
            :requestOptions="fileOption"
            :filters="imgfilters"
            v-show="!fileload"
          >
            <span slot="label"></span>
          </vue-file-upload>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div
              slot="content"
            >·请上传按照以下条件在AF【留存报告】页面导出的CSV文件。筛选条件：媒体平台 选择 Facebook Ads，分组维度 选择 ad、广告组、国家和日期，最低安装数量 为 0，日期范围请自行确定。
              <br>·请不要修改下载的文件名和文件内容。
            </div>
            <i class="el-icon-question elnotice"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideBox">取 消</el-button>
        <el-button
          type="primary"
          @click="submitAfdata"
          :disabled="Boolean(processCSV.find(v => v.resultMsg))"
        >确 定</el-button>
      </div>
    </div>
    <div v-show="submitresult == 'success'">
      <div class="successline">
        <i class="el-icon-success successicon"></i>
        <p class="font">匹配成功</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideBox">关闭</el-button>
      </div>
    </div>
    <div v-show="submitresult == 'fail'">
      <div class="successline">
        <i class="el-icon-warning successicon"></i>
        <p class="fail">匹配部分成功，请下载结果并检查数据是否合规，合规后重新上传</p>
        <p class="failresult" v-for="(r, index) in resultarray" :key="index">
          <span class="name">{{r.fileName}}</span>
          <span class="result" v-if="r.isSuccess">匹配成功</span>
          <span class="result" v-else>
            部分成功，
            <span @click="downFailResult(r.fileName)">下载结果</span>
          </span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideBox">关闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import UmCalendar from "../ummodule/calendar";
import VueFileUpload from "vue-file-upload";
import { mapState, mapMutations } from "vuex";
import { Msgwarning, Msgerror } from "../../js/message";
import { Loading } from "element-ui";
import URL from "../../js/url";
export default {
  props: ["status", "type"],
  components: {
    UmCalendar,
    VueFileUpload
  },
  data() {
    return {
      system: "Android",
      submitresult: "", // 提交结果，sucess为成功，fail为失败
      resultarray: [],
      date: "",
      dayOn: [],
      fileload: false,
      fileArray: [],
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      disabledDate: `${new Date().getFullYear()}-${new Date().getMonth() +
        1}-${new Date().getDate() - 1}`, // 特殊情况，需要置灰该日期后全部日期，当前情况是当前日期的前一天
      fileOption: {
        formData: {
          check: true
          // "userOs": this.system
        },
        headers: {
          "X-Token": localStorage.getItem("atom_token")
        }
      },
      // 文件上传格式过滤
      imgfilters: [
        {
          name: "csvFilter",
          fn(file) {
            // console.log(file);
            // return true;
            var type =
              "|" + file.name.slice(file.name.lastIndexOf(".") + 1) + "|";
            if ("|csv|".indexOf(type) !== -1) {
              return true;
            } else {
              Msgwarning("只能上传csv格式的文件");
              return false;
            }
          }
        }
      ],
      processCSV: [],
      eventsCSV: {
        onProgressUpload(file, process) {
          console.log(file.name);
          this.vm.$emit("uploadPic", file, process);
        },
        onSuccessUpload(file, response, status, headers) {
          if (response.code != 0) {
            Msgerror(response.msg);
          }
          this.vm.$emit("uploadRes", response, file);
          // 上传完成之后需要从队列中清除
          console.log("%cremove", "color: red");
          // file.remove();
        },
        onAddFileSuccess(file) {
          console.log("%cwaiting", "color: red");
          this.vm.$emit("checkUploadPic", file);
        }
      }
    };
  },
  computed: {
    ...mapState(["calendardate"]),
    uploadFileUrl() {
      return URL.addatacsv;
    }
  },
  mounted() {},
  watch: {
    status(n, o) {
      if (n) {
        this.monthChange();
        this.fileOption.formData["userOs"] = this.system;
        this.fileOption.formData["projectId"] = this.$route.params.id;
      }
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    downFailResult(name) {
      console.log(name);
      this.$store.dispatch("affileDownload", name);
    },
    async submitAfdata() {
      if (this.fileArray.length == 0) {
        Msgwarning("请上传af留存数据文件");
        return;
      }

      let submitload = Loading.service({ fullscreen: true });
      // let sync = await this.submitAsync();
      for (let a of this.fileArray) {
        let option = new FormData();
        option.append("files", a.file);
        option.append("userOs", this.system);
        option.append("projectId", this.$route.params.id);
        option.append("check", false);

        let r = await this.$store.dispatch("submitAfdata", option);
        this.resultarray.push(r.data);
      }
      submitload.close();
      // 判断成功失败
      if (this.resultarray.find(v => v.isSuccess === 0)) {
        this.submitresult = "fail";
      } else {
        this.submitresult = "success";
      }
    },
    submitAsync() {
      return new Promise((resolve, reject) => {
        this.fileArray.forEach(async (v, i) => {
          l;
        });
      });
    },
    systemChange() {
      this.fileOption.formData["userOs"] = this.system;
      // 切换系统的时候，清空文件，重新获取日历数据
      this.monthChange();
      this.fileArray = [];
      this.processCSV = [];
    },
    deleteCSV(idx) {
      this.fileArray.splice(idx, 1);
      this.processCSV.splice(idx, 1);
    },
    uploadRes(res, file) {
      this.SETSTATE({ k: "withcreate", v: true });
      let obj = {};
      obj.name = file.name;
      obj.size = file.size;
      obj.resultMsg = res.msg;

      this.processCSV = this.processCSV.filter(v => v.name != file.name);
      this.fileArray = this.fileArray.filter(v => v.name != file.name);

      this.fileArray.push(file);
      this.processCSV.push(obj);
      this.fileload = false;
    },
    uploadPic(file, process) {
      // this.disfile = file;
      this.SETSTATE({ k: "withcreate", v: false });

      this.fileload = true;
    },
    getMonthDaycount(year, month) {
      // 获取当前月份下一个月的第0天，即当前月份的最后一天，也就是天数
      let d = new Date(year, month, 0);
      return [d.getDate(), d.getFullYear(), d.getMonth() + 1];
    },
    hideBox() {
      this.$emit("hideRemainBox");

      this.SETSTATE({ k: "calendardate", v: [] });
      this.reset();
    },
    reset() {
      this.system = "Android";
      this.processCSV = [];
      this.fileArray = [];
      this.submitresult = "";
      this.resultarray = [];
      this.year = new Date().getFullYear();
      this.month = new Date().getMonth() + 1;
      this.fileload = false;
      // 重置日历状态
      this.$refs.umCalendar.reset();
    },
    async monthChange(year, month) {
      if (year) this.year = year;
      if (month) this.month = month;

      let day = this.getMonthDaycount(this.year, this.month);
      this.$store.dispatch("getCalendarData", {
        projectId: this.$route.params.id,
        startDate: `${this.year}-${this.month}-01`,
        endDate: `${this.year}-${this.month}-${day[0]}`,
        userOs: this.system
      });
    }
  }
};
</script>

<style lang="less" scoped>
.relativeform {
  position: relative;
  .csvline {
    display: flex;
    align-items: center;
    .file {
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .close {
      margin-right: 20px;
      font-weight: bold;
      cursor: pointer;
      margin-left: 3px;
      color: #666;
    }
  }
  .fileinput {
    position: absolute;
    bottom: 3px;
    top: auto;
  }
}
.elnotice {
  position: absolute;
  left: -30px;
  top: 20px;
  font-size: 16px;
  margin-top: -8px;
}
.dialog-footer {
  text-align: right;
}
.successline {
  text-align: center;
  margin-bottom: 30px;
  .successicon {
    font-size: 75px;
    margin-bottom: 20px;
  }
  .font {
    line-height: 30px;
    margin-bottom: 20px;
  }
  .fail,
  .failresult {
    text-align: left;
    line-height: 30px;
  }
  .failresult {
    display: flex;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
      height: 30px;
      margin-right: 30px;
      white-space: nowrap;
    }
    .result {
      flex-basis: 10em;
      flex-shrink: 0;
      span {
        color: #409eff;
        cursor: pointer;
      }
    }
  }
}
</style>
