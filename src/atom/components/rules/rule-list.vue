<template>
  <div class="list">
    <el-table :data="optimizelist" style="width: 100%">
      <el-table-column prop="id" label width="80">
        <el-switch
          class="statusswitch"
          v-model="switchstatus"
          active-value="ACTIVE"
          inactive-value="PAUSED"
          active-color="#13ce66"
          inactive-color="#d7dae2"
          @change="switchChange"
        ></el-switch>
      </el-table-column>
      <el-table-column prop="id" label="名称" width="180"></el-table-column>
      <el-table-column prop="ruleName" label="应用对象"></el-table-column>
      <el-table-column prop="fbTargetId" label="操作与条件"></el-table-column>
      <el-table-column prop="result" label="结果" width="140"></el-table-column>
      <el-table-column prop="ruleName" label="广告账户"></el-table-column>
      <el-table-column prop="fbTargetId" label="创建人"></el-table-column>
      <el-table-column prop="result" label="操作" width="140"></el-table-column>
    </el-table>
    <div class="pageswitch">
      <el-pagination
        background
        @size-change="pageSizeChange"
        :page-sizes="[20, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="optotal"
        :page-size="oppagesize"
        @current-change="pageSwitch"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      setapplist: [],
      switchstatus: true,
    };
  },
  computed: {
    ...mapState(["optimizelist"])
  }
};
</script>

<style lang="less" scoped>
.createTime {
  display: block;
}
.pageswitch {
  margin-top: 20px;
  text-align: center;
}
</style>
