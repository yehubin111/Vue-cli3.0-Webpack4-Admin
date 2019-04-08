<template>
  <el-dialog :title="rulename + info" :visible="status" class="deletedialog" @close="toCancel">
    <p class="fonttip important">
      <b>{{optimizedetail.length}}个{{typename}}符合规则条件，设置的条件是：</b>
    </p>
    <div class="fonttip important" style="margin-bottom: 20px;">
      <p v-for="(item, index) in condition" :key="index">· {{item}}</p>
    </div>
    <div class="targetlist">
      <el-table :data="optimizedetail" border style="width: 100%" id="ruleExecute">
        <el-table-column prop="targetName" label="名称">
          <template slot-scope="scope">
            <p class="targetname" @click="targetDetail(scope.row.fbTargetId, scope.row.targetType)">{{scope.row.targetName}}</p>
            <p class="childtype">{{scope.row.fbTargetId}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="actionsName" label="详情"></el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="toCancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["status"],
  data() {
    return {
      info: "",
      rulename: "",
      typename: "",
      condition: []
    };
  },
  methods: {
    initData(fbid, info, type, condition, name) {
      this.info = info;
      this.rulename = name;
      switch (type) {
        case "CAMPAIGN":
          this.typename = "广告系列";
          break;
        case "ADSET":
          this.typename = "广告组";
          break;
        case "AD":
          this.typename = "广告";
          break;
      }
      this.condition = condition.split("且").map(v => v.trim());
      this.$store.dispatch("optimizeDetail", fbid);
    },
    toCancel() {
      this.$emit("update:status", false);
    },
    targetDetail(id, type) {
      this.$router.push({
        name: 'ad',
        params: {
          kid: `${id}_${type}`
        }
      })
    }
  },
  computed: {
    ...mapState(["optimizedetail"])
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
  .childtype {
    font-size: 12px;
    color: #999;
  }
  .targetname{
    color: #409eff;
    cursor: pointer;
  }
}
</style>
