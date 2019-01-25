<template>
  <el-dialog title="视频解析转换" :visible="status" class="dialog" @close="toCancel" id="videoLoad">
    <div class="link" v-for="(item, index) in link" :key="index">
      <div class="linkfrom">
        <span class="title">短视频链接</span>
        <el-input
          class="input"
          v-model="link[index]"
          auto-complete="off"
          placeholder="短视频链接默认文案：请输入gid、tiktok链接或短链接"
        ></el-input>
      </div>
      <div v-if="videoerrmsg[index]">
        <p class="result" v-show="!videoerrmsg[index].status" style="color:red">{{videoerrmsg[index].result}}</p>
        <p class="result" v-show="videoerrmsg[index].status">
          <a :href="videoerrmsg[index].result" target="_blank">{{videoerrmsg[index].result}}</a>
        </p>
      </div>
    </div>
    <div class="add">
      <el-button type="primary" icon="el-icon-plus" circle @click="toAdd"></el-button>
      <el-button
        type="primary"
        :data-clipboard-text="videoresult.join('\n\n')"
        round
        v-show="videoresult.length > 0"
        id="copyResult"
      >复制结果</el-button>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click.stop="toCancel">取 消</el-button>
      <el-button @click="toTranslate" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Msgsuccess, Msgwarning } from "../js/message";
import { mapState, mapMutations } from "vuex";

export default {
  props: ["status"],
  data() {
    return {
      link: [""]
    };
  },
  computed: {
    ...mapState(["videoerrmsg", "videoresult"])
  },
  mounted() {
      this.$textCopy("#copyResult");
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    toTranslate() {
      let linkarr = this.link.filter(v => v);
      linkarr = linkarr.map(v => v.trim());
      if (linkarr.length == 0) {
        Msgwarning("至少输入一个需要转换的短视频链接");
        return;
      }

      this.$store.dispatch("videoUrlTranslate", { urls: linkarr, originurl: this.link });
    },
    toCancel() {
      this.link = [""];
      this.$emit("update:status", false);

      this.SETSTATE({ k: "videoerrmsg", v: {} });
      this.SETSTATE({ k: "videoresult", v: [] });
    },
    toAdd() {
      this.link.push("");
    },
    toCopy() {},
    showBox() {
      //   this.dialogFormVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
.link {
  margin-bottom: 10px;
  .linkfrom {
    display: flex;
    align-items: center;
    justify-content: center;
    .title {
      margin-right: 10px;
      width: 6em;
    }
  }
  .result {
    width: 100%;
    word-break: break-all;
    line-height: 30px;
    a {
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      color: #3297ff;
    }
  }
}
.add {
  text-align: center;
}
</style>
