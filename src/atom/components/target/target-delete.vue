<template>
  <el-dialog
    :title="`删除${deleteids.length}个受众`"
    :visible="status"
    class="deletedialog"
    @close="toCancel"
  >
    <p class="fonttip important">
      <b>确定删除这{{deleteids.length}}个受众吗？</b>
    </p>
    <p class="fonttip important" style="margin-bottom: 20px;">
      <b>删除这些受众后，这些受众将彻底从关联的所有广告帐户移除。使用受众的所有广告将停止投放。你或其他共享者将无法重启用过这些受众的广告。</b>
    </p>
    <p class="fonttip" v-show="deletesharing.length > 0">共享给其他广告账户的受众：</p>
    <div class="targetlist" v-show="deletesharing.length > 0">
      <ul>
        <li v-for="(item, index) in deletesharing" :key="index">
          <p class="targetname">{{item.name}}</p>
          <p class="targetid">{{item.audienceId}}</p>
        </li>
      </ul>
    </div>
    <p class="fonttip" v-show="deleteusing.length > 0">广告正在使用的受众：</p>
    <div class="targetlist" v-show="deleteusing.length > 0">
      <ul>
        <li v-for="(item, index) in deleteusing" :key="index">
          <p class="targetname">{{item.name}}</p>
          <p class="targetid">{{item.audienceId}}</p>
        </li>
      </ul>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="submitDelete">删 除</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Loading } from "element-ui";
import { Msgsuccess, Msgwarning, Msgerror } from "../../js/message";
export default {
  props: ["status", "deleteids"],
  methods: {
    ...mapMutations(["SETSTATE"]),
    toCancel() {
      this.$emit("hideBox");
      this.SETSTATE({ k: "deleteusing", v: [] });
      this.SETSTATE({ k: "deletesharing", v: [] });
    },
    async submitDelete() {
      let load = Loading.service({ fullscreen: true });
      let res = await this.$store.dispatch("submitDelete", this.deleteids);
      load.close();
      if (res) {
        let fail = res.data.filter(v => v.status != "success");
        if (fail.length == 0) {
          Msgsuccess("删除成功");
        } else {
          Msgerror(`以下受众删除失败，${fail.map(v => v.audienceId).join(',')}`);
        }
        this.toCancel();
      }
    }
  },
  computed: {
    ...mapState(["deleteusing", "deletesharing"])
  },
  watch: {
    status(n, o) {
      if (n) {
        this.$store.dispatch("deleteDetail", this.deleteids.join(","));
      }
    }
  }
};
</script>

<style lang='less' scoped>
.fonttip {
  margin-bottom: 10px;
}
.targetlist {
  margin-bottom: 20px;
  ul {
    border: 1px solid #ebeef5;
    border-bottom: none;
    li {
      padding: 8px 15px;
      border-bottom: 1px solid #ebeef5;
      .targetname {
        line-height: 26px;
      }
      .targetid {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
