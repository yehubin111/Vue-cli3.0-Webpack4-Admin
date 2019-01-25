<template>
    <el-table :data="optimizelist" style="width: 100%">
        <el-table-column prop="id" label="记录ID" width="180">
        </el-table-column>
        <el-table-column prop="ruleName" label="规则名称">
        </el-table-column>
        <el-table-column prop="fbTargetId" label="相关广告">
        </el-table-column>
        <el-table-column prop="result" label="结果" width="140">
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="140">
            <template slot-scope="scope">
                <span class="createTime">{{scope.row.createTime | timeFormat('yyyy-MM-dd', scope.row.createTime)}}</span>
                <span class="createTime">{{scope.row.createTime | timeFormat('HH:mm:ss', scope.row.createTime)}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
            <template slot-scope="scope">
                <span>{{scope.row.status == 1? '成功' : '失败'}}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      setapplist: []
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
</style>
