<template>
  <div>
    <el-table :data="optimizelist" style="width: 100%">
      <el-table-column prop="executionDetailInfo" label="详细信息"></el-table-column>
      <el-table-column prop="ruleName" label="名称">
        <template slot-scope="scope">
          <p>{{scope.row.ruleName}}</p>
          <p class="childtype">{{scope.row.ruleCondition}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="更改对象" width="160">
        <template slot-scope="scope">
          <p
            v-if="scope.row.changeCount > 0"
            class="changeobj"
            @click="optimizeDetail(scope.row.fbId, scope.row.changeTargetInfo, scope.row.targetType, scope.row.ruleCondition, scope.row.ruleName)"
          >{{scope.row.changeTargetInfo}}</p>
          <p v-else>{{scope.row.changeTargetInfo}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="fbAccountId" label="广告账户" width="180">
        <template slot-scope="scope">
          <p>{{scope.row.fbAccountName}}</p>
          <p class="childtype">{{scope.row.fbAccountId}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="时间" width="140">
        <template slot-scope="scope">
          <span
            class="createTime"
          >{{scope.row.createTime | timeFormat('yyyy-MM-dd', scope.row.createTime)}}</span>
          <span
            class="createTime"
          >{{scope.row.createTime | timeFormat('HH:mm:ss', scope.row.createTime)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <optimize-detail ref="optimizeDetail" :status.sync="detailstatus"></optimize-detail>
  </div>
</template>

<script>
import OptimizeDetail from "./optimize-detail";
import { mapState } from "vuex";

export default {
  components: {
    OptimizeDetail
  },
  data() {
    return {
      detailstatus: false,
      setapplist: []
    };
  },
  computed: {
    ...mapState(["optimizelist"])
  },
  methods: {
    optimizeDetail(fbid, info, type, condition, name) {
      this.detailstatus = true;
      this.$refs.optimizeDetail.initData(fbid, info, type, condition, name);
    }
  }
};
</script>

<style lang="less" scoped>
.createTime {
  display: block;
}
.childtype {
  font-size: 12px;
  color: #999;
}
.changeobj {
  color: #409eff;
  cursor: pointer;
}
</style>
