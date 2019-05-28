<template>
  <el-dialog
    :title="`设置{竞价上限/目标费用}`"
    :visible="status"
    class="deletedialog"
    @close="toCancel"
  >
    <p class="fonttip important">
      <b>为这{所选广告系列数量}个广告系列中的所有广告组（已发布和已暂停）设置竞价上限</b>
    </p>
    <el-table
      :data="adrulelist"
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="广告组名称"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop label="竞价上限">
        <template slot-scope="scope">
          <p>{{scope.row.executionSpecName}}</p>
          <p class="childtype">{{scope.row.evaluationSpecName}}</p>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="submitExecute">保 存</el-button>
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
      ruleids: [],
      level: ''
    };
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    adInit(select, type) {
      let typeId = "";
      this.accountid = select[0].accountId;
      switch (type) {
        case "campaignName":
          this.level = "CAMPAIGN";
          typeId = "campaignId";
          break;
        case "adSetName":
          this.level = "ADSET";
          typeId = "adsetId";
          break;
        case "adName":
          this.level = "AD";
          typeId = "adId";
          break;
      }
      this.objids = select.map(v => v[typeId]);
      this.$store.dispatch("ruleListForAdd", {
        fbAccountIds: this.accountid,
        level: this.level
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
      let res = await this.$store.dispatch("useRules", { objIds, ruleIds, objLevel: this.level });
      if(res.data) {
        this.toCancel();
      }
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
