<template>
  <div class="list">
    <el-table :data="newrulelist" style="width: 100%">
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
      <el-table-column prop label="名称" width="120">
        <template slot-scope="scope">
          <p>{{scope.row.name}}</p>
          <p class="childtype">{{scope.row.scheduleCnName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop label="应用对象">
        <template slot-scope="scope">
          <p
            v-if="scope.row.ruleObjCount > 0"
            class="activename"
          >{{scope.row.ruleObjCount}}个{{scope.row.levelCnName}}</p>
          <p v-else>投放中{{scope.row.levelCnName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop label="操作与条件">
        <template slot-scope="scope">
          <p>{{scope.row.executionSpecName}}</p>
          <p class="childtype">{{scope.row.scheduleCnName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="结果" width="100"></el-table-column>
      <el-table-column prop label="广告账户">
        <template slot-scope="scope">
          <p>{{scope.row.fbAccountName}}</p>
          <p class="childtype">{{scope.row.fbAccountId.replace('act_', '')}}</p>
        </template>
      </el-table-column>
      <el-table-column prop label="创建人" width="100">
        <template slot-scope="scope">
          <p>{{scope.row.createBy}}</p>
          <p class="childtype">{{scope.row.createTime | timeFormat('yyyy-MM-dd')}}</p>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="140">
        <template>
          <p class="ctrl">
            <el-button type="text" size="mini">编辑</el-button>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageswitch">
      <el-pagination
        background
        @size-change="pageSizeChange"
        :page-sizes="[20, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="newruletotal"
        :page-size="20"
        @current-change="pageSwitch"
      ></el-pagination>
    </div>
    <rule-execute :status.sync="executeStatus"></rule-execute>
    <rule-objdetail :status.sync="objStatus"></rule-objdetail>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RuleExecute from "./rule-execute";
import RuleObjdetail from "./rule-objdetail";
export default {
  components: {
    RuleExecute,
    RuleObjdetail
  },
  data() {
    return {
      setapplist: [],
      switchstatus: true,
      executeStatus: false,
      objStatus: false
    };
  },
  computed: {
    ...mapState(["newrulelist", "newruletotal"])
  },
  methods: {
    switchChange() {},
    pageSwitch() {},
    pageSizeChange() {}
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
.activename {
  color: #409eff;
}
.pageswitch {
  margin-top: 20px;
  text-align: center;
}
</style>
