<template>
  <el-dialog
    :title="`应用于${id}${typename}的规则`"
    :visible="status"
    class="deletedialog"
    @close="toCancel"
  >
    <p class="fonttip important">
      <b>以下是应用于此对象的规则，选择后可移除：</b>
    </p>
    <el-table :data="singlerules" border style="width: 100%" @selection-change="handleSelectionChange">
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
      <el-button type="primary" @click="submitExecute">移 除</el-button>
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
      id: "",
      type: "",
      typename: "",
      ruleids: []
    };
  },
  methods: {
    ...mapMutations(['SETSTATE']),
    toCancel() {
      this.$emit("update:status", false);

      this.ruleids = [];
      this.SETSTATE({ k: "singlerules", v: [] });
    },
    async submitExecute() {
      if (this.ruleids.length == 0) {
        Msgwarning("请选择规则");
        return;
      }
      let objId = this.id;
      let ruleIds = this.ruleids.join(",");
      let res = await this.$store.dispatch("removeRules", {objId, ruleIds});
    },
    handleSelectionChange(vl) {
      this.ruleids = vl.map(v => v.fbId);
    },
    initData(id, type) {
      this.id = id;
      this.type = type;
      switch (type) {
        case "campaignName":
          this.typename = "广告系列";
          break;
        case "adSetName":
          this.typename = "广告组";
          break;
        case "adName":
          this.typename = "广告";
          break;
      }
      this.$store.dispatch("singleRules", id);
    }
  },
  computed: {
    ...mapState(['singlerules'])
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
