<template>
  <el-dialog title="操作详情" :visible="jobfaildetail" class="dialog" @close="toCancel">
    <p class="detailinfo">{{tasknamedetail}}，{{tasksuccessdetail}}项成功，{{taskfaildetail}}项失败</p>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" empty-text="全部完成">
      <el-tab-pane
        :label="`广告系列${taskcampaignsucess}/${taskcampaignfaildetail.length}`"
        :name="tasktabcampaign"
        v-if="taskcampaignsucess > 0 || taskcampaignfaildetail.length > 0"
      >
        <el-table :data="taskcampaignfaildetail" style="width: 100%" max-height="250">
          <el-table-column prop="extraInfo" label="广告系列名称">
            <template slot-scope="scope">{{scope.row.extraInfo?scope.row.extraInfo:'--'}}</template>
          </el-table-column>
          <el-table-column prop="result" label="错误信息">
            <template slot-scope="scope">{{scope.row.result}}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        :label="`广告组${taskadsetsucess}/${taskadsetfaildetail.length}`"
        :name="tasktabadset"
        empty-text="全部完成"
        v-if="taskadsetsucess > 0 || taskadsetfaildetail.length > 0"
      >
        <el-table :data="taskadsetfaildetail" style="width: 100%" max-height="250">
          <el-table-column prop="extraInfo" label="广告组名称">
            <template slot-scope="scope">{{scope.row.extraInfo?scope.row.extraInfo:'--'}}</template>
          </el-table-column>
          <el-table-column prop="result" label="错误信息">
            <template slot-scope="scope">{{scope.row.result}}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        :label="`广告${taskadsucess}/${taskadfaildetail.length}`"
        :name="tasktabad"
        empty-text="全部完成"
        v-if="taskadsucess > 0 || taskadfaildetail.length > 0"
      >
        <el-table :data="taskadfaildetail" style="width: 100%" max-height="250">
          <el-table-column prop="extraInfo" label="广告名称">
            <template slot-scope="scope">{{scope.row.extraInfo?scope.row.extraInfo:'--'}}</template>
          </el-table-column>
          <el-table-column prop="result" label="错误信息">
            <template slot-scope="scope">{{scope.row.result}}</template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        :label="`创意${taskadsucess}/${taskadfaildetail.length}`"
        :name="tasktabcreate"
        empty-text="全部完成"
        v-if="taskcreatesucess > 0 || taskcreatefaildetail.length > 0"
      >
        <el-table :data="taskcreatefaildetail" style="width: 100%" max-height="250">
          <el-table-column prop="extraInfo" label="创意名称">
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
      activeName: "first"
    };
  },
  computed: {
    ...mapState([
      "jobfaildetail",

      "taskcampaignfaildetail",
      "taskadsetfaildetail",
      "taskadfaildetail",
      "taskcreatefaildetail",

      "taskcampaignsucess",
      "taskadsetsucess",
      "taskadsucess",
      "taskcreatesucess",

      "taskfaildetail",
      "tasksuccessdetail",
      "tasknamedetail",
      "tasknamedetail",
      
      "tasktabcampaign",
      "tasktabadset",
      "tasktabad",
      "tasktabcreate",

      "jobfailkey"
    ])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    handleClick() {},
    toCancel() {
      this.SETSTATE({ k: "jobfaildetail", v: false });
      this.SETSTATE({ k: "taskcampaignfaildetail", v: [] });
      this.SETSTATE({ k: "taskadsetfaildetail", v: [] });
      this.SETSTATE({ k: "taskadfaildetail", v: [] });
      this.SETSTATE({ k: "taskcreatefaildetail", v: [] });

      this.SETSTATE({ k: "taskcampaignsucess", v: 0 });
      this.SETSTATE({ k: "taskadsetsucess", v: 0 });
      this.SETSTATE({ k: "taskadsucess", v: 0 });
      this.SETSTATE({ k: "taskcreatesucess", v: 0 });

      this.SETSTATE({ k: "taskfaildetail", v: 0 });
      this.SETSTATE({ k: "tasksuccessdetail", v: 0 });
      this.SETSTATE({ k: "tasknamedetail", v: "" });

      this.SETSTATE({ k: "tasktabcampaign", v: "first" });
      this.SETSTATE({ k: "tasktabadset", v: "second" });
      this.SETSTATE({ k: "tasktabad", v: "third" });
      this.SETSTATE({ k: "tasktabcreate", v: "forth" });
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
