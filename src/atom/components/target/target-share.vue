<template>
  <el-dialog
    :title="`共享${shareids.length}个受众`"
    :visible="status"
    class="deletedialog"
    @close="toCancel"
  >
    <p class="fonttip important">
      <b>输入另一帐户，该帐户即可获权使用受众、或查看受众分析。但该帐户不能编辑、共享受众，或以受众为来源创建类似受众。</b>
    </p>
    <div class="account">
      <span class="accname">广告账户</span>
      <el-select
        class="selectl"
        v-model="adaccounts"
        collapse-tags
        multiple
        filterable
        placeholder="暂只支持同BM下的广告账户，可搜索"
      >
        <el-option
          v-for="(item, index) in commonaccount"
          :key="index"
          :label="item.name + (item.fbAccountId?'('+item.fbAccountId+')':'')"
          :value="item.fbAccountId"
          :disabled="item.accountStatus != 1"
        ></el-option>
      </el-select>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="submitShare">共 享</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Loading } from "element-ui";
import { Msgsuccess, Msgwarning, Msgerror } from "../../js/message";
export default {
  props: ["status", "shareids"],
  data() {
    return {
      adaccounts: []
    };
  },
  computed: {
    ...mapState(["commonaccount"])
  },
  methods: {
    toCancel() {
      this.$emit("hideBox");
      this.adaccounts = [];
    },
    async submitShare() {
      let load = Loading.service({ fullscreen: true });
      let res = await this.$store.dispatch("submitShare", {
        audienceList: this.shareids,
        adaccountList: this.adaccounts
      });
      load.close();
      if (res) {
        let fail = res.data.filter(v => v.status != "success");
        if (fail.length == 0) {
          Msgsuccess("共享成功");
        } else {
          Msgerror(
            `以下受众共享失败，${fail.map(v => `${v.audienceId}原因：${v.errorMsg}`).join(",")}`
          );
        }
        this.toCancel();
      }
    }
  }
};
</script>

<style lang='less' scoped>
.fonttip {
  margin-bottom: 20px;
}
.account {
  display: flex;
  align-items: center;
  .accname {
    flex-basis: 100px;
  }
  .selectl {
    flex-grow: 1;
  }
}
</style>
