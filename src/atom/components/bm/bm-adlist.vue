<template>
  <el-table :data="disaccount" style="width: 100%">
    <el-table-column prop="fbAccountId" label="账户ID" width="200">
    </el-table-column>
    <el-table-column prop="name" label="账户名称">
    </el-table-column>
    <el-table-column prop="balance" label="账户余额($)" width="160">
      <template slot-scope="scope">
        <el-tooltip v-if="scope.row.balance <= 0 || scope.row.balance < scope.row.avgSpend * 300" class="item" effect="dark" content="剩余余额不足3天花费" placement="top-start">
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <span style="margin-left: 0px">{{ scope.row.balance / 100 }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="accountStatus" label="状态" width="120">
      <template slot-scope="scope">
        <span :class="{good: scope.row.accountStatus == 1, bad: scope.row.accountStatus != 1}">{{ scope.row.accountStatus == 1? '正常':'异常' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="停用/启用" width="120">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#d7dae2" @change="switchChange(scope.row.status, scope.row.fbId)">
        </el-switch>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      // value2: 1
    };
  },
  computed: {
    ...mapState(["disaccount"])
  },
  methods: {
    switchChange(status, id) {
      this.$store.dispatch("accountStatus", { status, id });
    }
  }
};
</script>

<style lang="less" scoped>
.good {
  color: #67c23a;
}
.bad {
  color: #f56c6c;
}
</style>
