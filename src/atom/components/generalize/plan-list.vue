<template>
  <el-table :data="planlist" style="width: 100%">
    <el-table-column prop="id" label="计划ID" width="80">
    </el-table-column>
    <el-table-column prop="name" label="计划名称" :show-overflow-tooltip="true">
      <!--:show-overflow-tooltip="true"-->
      <template slot-scope="scope">
        <p class="nametip">
          <span v-if="scope.row.createType != 'auto'" class="commonline">通用</span>
          <span v-else class="autoline">智能</span>
          {{scope.row.name}}
        </p>
      </template>
    </el-table-column>
    <el-table-column prop="country" label="国家" width="100">
    </el-table-column>
    <el-table-column prop="platform" label="平台" width="120">
    </el-table-column>
    <el-table-column prop="creativeNum" label="创意" width="80">
      <template slot-scope="scope">
        <el-button type="text" @click="toSelectcreate(scope.row.id)" v-if="scope.row.createType != 'auto'">{{scope.row.creativeNum}}</el-button>
        <span v-else>--</span>
      </template>
    </el-table-column>
    <el-table-column prop="goalBid" label="目标出价($)" width="120">
      <template slot-scope="scope">
        <el-button type="text" @click="toGiveprice(scope.row.id, scope.row.goalBid?scope.row.goalBid / 100:'')">{{scope.row.goalBid?scope.row.goalBid / 100:'--'}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="adaccountNum" label="广告账户" width="80">
      <template slot-scope="scope">
        <el-button type="text" @click="toSelectaccount(scope.row.id)">{{scope.row.adaccountNum}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="createAmount" label="创建记录" width="80">
      <template slot-scope="scope">
        <el-popover trigger="click" placement="top" width="600">
          <el-table :id="'createList' + scope.row.id" :data="loglist" height="250">
            <el-table-column property="campaignName" label="创建记录">
              <template slot-scope="scope">
                <span class="campaignName" @click="toLogDetail(scope.row.id, scope.row.campaignName)">{{scope.row.campaignName}}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" property="createTime" label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | timeFormat('yyyy-MM-dd')}}</span>
              </template>
            </el-table-column>
            <el-table-column width="140" property="creator" label="创建人"></el-table-column>
            <el-table-column width="60" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="toLogDetail(scope.row.id, scope.row.campaignName)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button slot="reference" type="text" @click="getLogid(scope.row.id)">{{scope.row.createAmount}}</el-button>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="160">
      <template slot-scope="scope">
        <p>
          <el-button type="text" @click="editReset" size="small">
            <router-link class="edit" :to="'/project/' + $route.params.id + '/edit/' + scope.row.id">编辑</router-link>
          </el-button>
          <el-button type="text" @click="syncCreate(scope.row.id, scope.row.creativeNum)" size="small" v-if="scope.row.createType != 'auto'">
            同步创意
          </el-button>
        </p>
        <p>
          <el-button type="text" @click="editReset" size="small">
            <router-link class="edit" :to="'/project/' + $route.params.id + '/copy/' + scope.row.id">复制</router-link>
          </el-button>
          <el-button type="text" size="small" @click="toCreateLog(scope.row.id, scope.row.adaccountNum, scope.row.creativeNum, scope.row.name)" v-if="scope.row.createType != 'auto'">创建广告</el-button>
          <el-switch class="switch" v-if="scope.row.createType == 'auto'" v-model="scope.row.status" @change="toOpenClose(scope.row.id, scope.row.status)" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#d7dae2">
          </el-switch>
        </p>
      </template>
    </el-table-column>
  </el-table>
</template>


<script>
import { mapState, mapMutations } from "vuex";
import { Msgsuccess, Msgwarning, Msgnotify } from "../../js/message";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["planlist", "loglist"])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    syncCreate(planid, createnum) {
      let dangerouslyUseHTMLString = true;

      if(createnum == 0){
        Msgwarning('请选择创意');
        return;
      }

      Msgnotify(
        "创意同步",
        `创意同步中... <a class="synctodetail" href="#/project/${
          this.$route.params.id
        }/sync">查看详情</a>`,
        dangerouslyUseHTMLString
      );

      this.$store.dispatch("syncCreate", {
        planid,
        createnum,
        projectId: this.$route.params.id
      });
    },
    toOpenClose(id, status) {
      let option = [];
      option.push(id);
      if (status == "0") {
        this.$store.dispatch("closePlan", { option });
      } else {
        this.$store.dispatch("openPlan", { option });
      }
    },
    toGiveprice(id, goalBid) {
      this.$emit("showChangebox", "status", id, goalBid);
    },
    toSelectcreate(id) {
      this.$emit("showCreatebox", "status1", id);
    },
    toSelectaccount(id) {
      this.$emit("showAccountbox", "status3", id);
    },
    toCreateLog(id, num, crt, name) {
      if (crt <= 0) {
        Msgwarning("请先同步创意");
        return;
      }
      if (num <= 0) {
        Msgwarning("请先同步广告账户");
        return;
      }
      this.$emit("showCreatelogBox", "status5", id, name);
    },
    getLogid(id) {
      let plan_id = id;
      let loadDom = "createList" + id;
      this.$store.dispatch("getLog", { plan_id, loadDom });
    },
    toLogDetail(id, name) {
      let k = "logdetailid";
      let v = id;
      this.SETSTATE({ k, v });

      k = "logdetailname";
      v = name;
      this.SETSTATE({ k, v });

      k = "ifadcreate";
      v = true;
      this.SETSTATE({ k, v });

      this.$store.dispatch("getLogdetail");
    },
    editReset(id, name) {
      let k = "disinfo";
      let v = [];
      this.SETSTATE({ k, v });
    }
  }
};
</script>
<style>
.synctodetail {
  color: #409eff;
}
</style>
<style lang="less" scoped>
.dist {
  color: #409eff;
  cursor: pointer;
}
.commonline {
  padding: 0 5px;
  line-height: 20px;
  color: #fff;
  background-color: #409eff;
  display: inline-block;
  border-radius: 3px;
  font-size: 12px;
}
.campaignName {
  color: #409eff;
  cursor: pointer;
}
.switch {
  margin-left: 12px;
}
.autoline {
  padding: 0 5px;
  line-height: 20px;
  color: #fff;
  background-color: #67c23a;
  display: inline-block;
  border-radius: 3px;
  font-size: 12px;
}
.edit {
  color: #409eff;
}
.nametip {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
