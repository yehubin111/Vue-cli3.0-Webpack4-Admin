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
        placeholder="暂只支持同BM下的广告账户"
      >
        <el-option
          v-for="(item, index) in adaccountlist"
          :key="index"
          :label="item.name + (item.fbId?'('+item.fbId+')':'')"
          :value="item.fbId"
        ></el-option>
      </el-select>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="submitShare">删 除</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["status", "shareids"],
  data() {
    return {
      adaccounts: []
    };
  },
  computed: {
    ...mapState(["adaccountlist"])
  },
  methods: {
    toCancel() {
      this.$emit("hideBox");
      this.adaccounts = [];
    },
    submitShare() {
      this.$store.dispatch("submitDelete", this.deleteids);
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
