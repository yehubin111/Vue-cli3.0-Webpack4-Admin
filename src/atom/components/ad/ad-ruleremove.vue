<template>
  <el-dialog
    :title="`应用于${id}${typename}的规则`"
    :visible="status"
    class="deletedialog"
    @close="toCancel"
  >
    <div class="fonttip important">
      <p>以下是应用于此对象的规则，选择后可移除：</p>
      <p class="notice" v-show="hascantselect">置灰列表不可删除，请直接删除此规则</p>
    </div>
    <el-table
      :data="singlerules"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :selectable="ifSelect" fixed width="55">
      </el-table-column>
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
      ruleids: [],
      level: "",
      hascantselect: false
    };
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    ifSelect(row, index) {
      if (row.ruleObjCount > 1) {
        return true;
      } else {
        this.hascantselect = true;
        return false;
      }
    },
    toCancel() {
      this.$emit("update:status", false);

      this.ruleids = [];
      this.SETSTATE({ k: "singlerules", v: [] });
      this.hascantselect = false;
    },
    async submitExecute() {
      if (this.ruleids.length == 0) {
        Msgwarning("请选择规则");
        return;
      }
      let objId = this.id;
      let ruleIds = this.ruleids.join(",");
      let res = await this.$store.dispatch("removeRules", {
        objId,
        ruleIds,
        objLevel: this.level
      });
      this.toCancel();
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
          this.level = "CAMPAIGN";
          break;
        case "adSetName":
          this.typename = "广告组";
          this.level = "ADSET";
          break;
        case "adName":
          this.typename = "广告";
          this.level = "AD";
          break;
      }
      this.$store.dispatch("singleRules", id);
    }
  },
  computed: {
    ...mapState(["singlerules"])
  },
  watch: {}
};
</script>

<style lang='less' scoped>
.fonttip {
  margin-bottom: 10px;
  .notice {
    color: red;
  }
}
.conditiontip {
  position: absolute;
  left: -10px;
  top: 14px;
}
.specialname {
  z-index: 99;
}
.targetlist {
  margin-bottom: 20px;
}
.childtype {
  font-size: 12px;
  color: #999;
}
</style>
