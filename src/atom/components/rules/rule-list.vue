<template>
  <div class="list">
    <el-table :data="newrulelist" style="width: 100%">
      <el-table-column prop label width="60">
        <template slot-scope="scope">
          <el-switch
            class="statusswitch"
            v-model="scope.row.status"
            active-value="ENABLED"
            inactive-value="DISABLED"
            active-color="#13ce66"
            inactive-color="#d7dae2"
            @change="switchChange(scope.row.id, scope.row.status)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="名称" width="120">
        <template slot-scope="scope">
          <p class="rulename" @click="toEdit(scope.row.id, scope.row.fbId)">{{scope.row.name}}</p>
          <p class="childtype">{{scope.row.scheduleCnName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop label="应用对象">
        <template slot-scope="scope">
          <p
            class="rulename"
            v-if="scope.row.relateRuleObjs.length > 0"
            @click="showDetail(scope.row.name, scope.row.targetObjName, scope.row.id)"
          >{{scope.row.targetObjName}}</p>
          <!-- <p
            v-if="scope.row.ruleObjCount > 0"
            class="activename"
          >{{scope.row.ruleObjCount}}个{{scope.row.levelCnName}}</p>-->
          <p v-else>{{scope.row.targetObjName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop label="操作与条件">
        <template slot-scope="scope">
          <p>{{scope.row.executionSpecName}}</p>
          <p class="childtype">{{scope.row.evaluationSpecName}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="结果" width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.lastOccurTime">
            <router-link :to="`/project/${$route.params.id}/optimize/${scope.row.fbId}`" class="rulename">{{scope.row.result}}</router-link>
            <p class="childtype">{{scope.row.lastOccurTime | timeFormat('yyyy-MM-dd')}}</p>
          </div>
          <p v-else>{{scope.row.result}}</p>
        </template>
      </el-table-column>
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
        <template slot-scope="scope">
          <p class="ctrl">
            <el-button type="text" size="mini" @click="toEdit(scope.row.id, scope.row.fbId)">编辑</el-button>
            <el-button type="text" size="mini" @click="toExecute(scope.row.fbId, scope.row.levelCnName, scope.row.evaluationSpecName)">执行</el-button>
            <el-button type="text" size="mini" @click="toDelete(scope.row.id)">删除</el-button>
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
    <rule-execute ref="ruleExecute" :status.sync="executeStatus"></rule-execute>
    <rule-objdetail ref="objDetail" :status.sync="objStatus"></rule-objdetail>
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
      // executeid: '',
      objStatus: false
    };
  },
  computed: {
    ...mapState(["newrulelist", "newruletotal"])
  },
  methods: {
    showDetail(rulename, name, id) {
      let rule = this.newrulelist.find(v => v.id == id);
      let detail = rule.relateRuleObjs;
      let objname = name;
      this.objStatus = true;
      this.$refs.objDetail.initData(rulename, objname, detail);
    },
    toEdit(id, fbid) {
      this.$emit('editRule', id, fbid);
    },
    toExecute(fbid, type, condition) {
      this.executeStatus = true;
      // this.executeid = fbid;
      this.$refs.ruleExecute.initData(fbid, type, condition);
    },
    toDelete(id) {
      this.$confirm("确定要删除此规则吗？此操作无法撤销", "删除规则", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("deleteRule", id);
        })
        .catch(() => {});
    },
    switchChange(id, status) {
      console.log(status);
      if(status == 'ENABLED') {
        this.$store.dispatch('toOpenRule', id);
      } else {
        this.$store.dispatch('toCloseRule', id);
      }
    },
    pageSwitch(index) {
      this.SETOBJSTATE({
        obj: "ruleoption",
        name: "pageIndex",
        v: index
      });
      this.$store.dispatch("getRuleList");
    },
    pageSizeChange(size) {
      this.SETOBJSTATE({
        obj: "ruleoption",
        name: "pageSize",
        v: size
      });
      this.$store.dispatch("getRuleList");
    }
  }
};
</script>

<style lang="less" scoped>
.createTime {
  display: block;
}
.rulename{
  display: inline-block;
  color: #409eff;
  cursor: pointer;
}
.childtype {
  font-size: 12px;
  color: #999;
}
// .activename {
//   color: #409eff;
//   cursor: pointer;
// }
.pageswitch {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 100px;
}
</style>
