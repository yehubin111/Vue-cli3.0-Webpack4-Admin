<template>
  <el-dialog title="操作详情" :visible="jobfaildetail" class="dialog" @close="toCancel">
    <p class="detailinfo">{{tasknamedetail}}，{{tasksuccessdetail}}项成功，{{taskfaildetail}}项失败</p>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" empty-text="全部完成">
      <el-tab-pane
        v-for="(item, index) in taskresult"
        :key="index"
        :label="item.tabname"
        :name="`${index+1}`"
      >
        <el-table :data="item.tasks" style="width: 100%" max-height="250">
          <el-table-column prop="extraInfo" :label="item.tabelhead">
            <template slot-scope="scope">{{scope.row.extraInfo?scope.row.extraInfo:'--'}}</template>
          </el-table-column>
          <el-table-column prop="result" label="错误信息">
            <template slot-scope="scope">{{scope.row.result}}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      activeName: "1"
    };
  },
  computed: {
    ...mapState([
      "jobfaildetail",

      "taskresult",

      "taskfaildetail",
      "tasksuccessdetail",
      "tasknamedetail",

      "jobfailkey"
    ])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    handleClick() {},
    toCancel() {
      this.SETSTATE({ k: "jobfaildetail", v: false });

      this.SETSTATE({ k: "taskresult", v: [] });

      this.SETSTATE({ k: "taskfaildetail", v: 0 });
      this.SETSTATE({ k: "tasksuccessdetail", v: 0 });
      this.SETSTATE({ k: "tasknamedetail", v: "" });
    }
  },
  watch: {
    jobfaildetail(n, o) {
      if (n) {
        this.$store.dispatch("joblistDetail");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.detailinfo {
  margin-bottom: 20px;
}
</style>
