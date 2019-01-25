<template>
    <el-table :data="targetlist" style="width: 100%">
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="audienceType" label="类型" width="140">
             <template slot-scope="scope">
                <p>{{scope.row.audienceType == 'lookalike'? '类似受众': '自定义受众'}}</p>
                <p class="childtype">{{scope.row.childType}}</p>
            </template>
        </el-table-column>
        <el-table-column prop="description" label="描述">
             <!-- <template slot-scope="scope">
                <p v-html="scope.row.description"></p>
            </template> -->
        </el-table-column>
        <el-table-column prop="creator" label="创建人/时间" width="140">
            <template slot-scope="scope">
                <span>{{scope.row.creater}}<br></span>
                <span>{{scope.row.createTime | timeFormat('yyyy-MM-dd')}}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
            <template slot-scope="scope">
                <el-popover trigger="click" placement="top" width="600">
                    <el-table :id="'targetList' + scope.row.id" :data="targetdetail" height="250">
                        <el-table-column property="fbAudienceId" label="受众ID">
                            <template slot-scope="scope">
                                <span>{{scope.row.fbAudienceId}}</span>
                                <el-tooltip class="item" effect="dark" v-if="scope.row.fbAudienceName && scope.row.fbAudienceName != disAudienceName" :content="'受众名称：' + scope.row.fbAudienceName" placement="top-start">
                                    <i class="el-icon-warning"></i>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column property="campaignName" label="账号名称">
                            <template slot-scope="scope">
                                <span class="fbName">{{scope.row.fbAccountName}}</span>
                                <span class="fbId">ID:{{scope.row.fbAccountId.split('_')[1]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="80" property="statusName" label="状态">
                            <template slot-scope="scope">
                                <span>{{scope.row.statusName}}</span>
                                <el-tooltip class="item" effect="dark" v-if="scope.row.operationStatus != 200 && scope.row.deliveryDescription" :content="scope.row.deliveryDescription" placement="top-start">
                                    <i class="el-icon-warning"></i>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column width="100" property="approximateCount" label="规模">
                            <template slot-scope="scope">
                                <span>{{scope.row.approximateCount?scope.row.approximateCount: '--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="100" property="updateTime" label="更新时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.updateTime | timeFormat('yyyy-MM-dd HH:mm:ss')}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p class="createall">{{targetdetail.length}}个广告账号内有此受众</p>
                    <el-button slot="reference" class="popoverbutton" size="small" type="text" @click="getLogid(scope.row.id, scope.row.name)">详情</el-button>
                </el-popover>
                <el-button type="text" size="small" @click="toEdit(scope.row.id, scope.row.audienceType, scope.row.lookalikeType)">编辑</el-button>
                <el-button type="text" size="small">
                    <router-link class="create" :to="'/project/' + $route.params.id + '/gener/1/' + scope.row.id">创建计划</router-link>
                </el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      disAudienceName: ""
    };
  },
  computed: {
    ...mapState(["targetlist", "targetdetail"])
  },
  methods: {
    getLogid(id, name) {
      this.disAudienceName = name;

      let targetid = id;
      let loadDom = "targetList" + id;
      this.$store.dispatch("getTargetDetail", { targetid, loadDom });
    },
    toEdit(id, type, liketype) {
      let ltype = "";
      if (liketype == "custom_audience") {
        ltype = 1;
      } else if (liketype == "campaign_conversions") {
        ltype = 2;
      } else {
        ltype = 3;
      }
      if (type == "lookalike") this.$emit("likeEdit", id, ltype);
      else this.$emit("targetEdit", id);
    }
  }
};
</script>

<style lang="less" scoped>
.popoverbutton {
  margin-right: 10px;
}
.createall {
  background-color: #fafafa;
  line-height: 40px;
  padding-left: 10px;
}
.childtype{
    font-size: 12px;
    color: #999;
}
.fbName {
  display: block;
}
.fbId {
  display: block;
  color: #999;
}
.create {
  color: #409eff;
}
</style>
