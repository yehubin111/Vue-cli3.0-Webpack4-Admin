<template>
  <el-dialog
    :title="`应用广告账户${accountid}的规则`"
    :visible="status"
    class="deletedialog"
    @close="toCancel"
  >
    <p class="fonttip important">
      <b>可选择规则并应用到已选择的对象中</b>
    </p>
    <el-table
      :data="adrulelist"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" fixed width="55"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop label="操作与条件">
        <template slot-scope="scope">
          <p>{{scope.row.executionSpecName}}</p>
          <p class="childtype">{{scope.row.evaluationSpecName}}</p>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="submitExecute">应 用</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status"],
  data() {
    return {
      accountid: "",
      objids: [],
      ruleids: []
    };
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    adInit(select, type) {
      let level = "";
      let typeId = "";
      this.accountid = select[0].accountId;
      switch (type) {
        case "campaignName":
          level = "CAMPAIGN";
          typeId = "campaignId";
          break;
        case "adSetName":
          level = "ADSET";
          typeId = "adSetId";
          break;
        case "adName":
          level = "AD";
          typeId = "adId";
          break;
      }
      this.objids = select.map(v => v[typeId]);
      this.$store.dispatch("ruleListForAdd", {
        fbAccountIds: this.accountid,
        level
      });
    },
    toCancel() {
      this.$emit("update:status", false);

      this.SETSTATE({ k: "adrulelist", v: [] });
      this.objids = [];
      this.ruleids = [];
    },
    async submitExecute() {
      if (this.ruleids.length == 0) {
        Msgwarning("请选择规则");
        return;
      }
      let objIds = this.objids.join(",");
      let ruleIds = this.ruleids.join(",");
      let res = await this.$store.dispatch("useRules", { objIds, ruleIds });
    },
    handleSelectionChange(vl) {
      console.log(vl);
      this.ruleids = vl.map(v => v.fbId);
    }
  },
  computed: {
    ...mapState(["adrulelist"])
  },
  watch: {}
};
</script>

<style lang='less' scoped>
.fonttip {
  margin-bottom: 10px;
}
.targetlist {
  margin-bottom: 20px;
}
.childtype {
  font-size: 12px;
  color: #999;
}
</style>
