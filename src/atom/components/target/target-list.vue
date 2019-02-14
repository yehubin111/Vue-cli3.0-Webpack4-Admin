<template>
  <el-table :data="targetlist" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" fixed width="55"></el-table-column>
    <el-table-column prop="name" label="名称">
      <template slot-scope="scope">
        <el-tooltip
          class="item"
          effect="dark"
          :content="scope.row.description"
          :disabled="!scope.row.description"
          placement="top-start"
        >
          <div>
            <p class="targetname">{{scope.row.name}}</p>
            <p class="childtype">{{scope.row.audienceId}}</p>
          </div>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="audienceType" label="类型" width="100">
      <template slot-scope="scope">
        <p>{{scope.row.subtype == 'LOOKALIKE'? '类似受众': '自定义受众'}}</p>
        <p class="childtype">{{scope.row.childType}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="audienceType" label="状态/规模" width="100">
      <template slot-scope="scope">
        <p>
          {{scope.row.statusName}}
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.deliveryStatusDescription"
            v-if="scope.row.deliveryStatusCode != 200"
            :disabled="!scope.row.deliveryStatusDescription"
            placement="top-start"
          >
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </p>
        <p class="childtype">{{scope.row.approximateCount}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="audienceType" label="广告账户">
      <template slot-scope="scope">
        <p>{{scope.row.adaccountName}}</p>
        <p class="childtype">{{scope.row.ownAccountId}}</p>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="description" label="描述"></el-table-column> -->
    <el-table-column prop="creator" label="创建时间" width="100">
      <template slot-scope="scope">
        <!-- <span>
          {{scope.row.creater}}
          <br>
        </span>-->
        <span>{{scope.row.timeCreated + '000' | timeFormat('yyyy-MM-dd HH:mm')}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="160">
      <template slot-scope="scope">
        <!-- <el-popover trigger="click" placement="top" width="600">
          <el-table :id="'targetList' + scope.row.id" :data="targetdetail" height="250">
            <el-table-column property="fbAudienceId" label="受众ID">
              <template slot-scope="scope">
                <span>{{scope.row.fbAudienceId}}</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  v-if="scope.row.fbAudienceName && scope.row.fbAudienceName != disAudienceName"
                  :content="'受众名称：' + scope.row.fbAudienceName"
                  placement="top-start"
                >
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
                <el-tooltip
                  class="item"
                  effect="dark"
                  v-if="scope.row.operationStatus != 200 && scope.row.deliveryDescription"
                  :content="scope.row.deliveryDescription"
                  placement="top-start"
                >
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
          <el-button
            slot="reference"
            class="popoverbutton"
            size="small"
            type="text"
            @click="getLogid(scope.row.id, scope.row.name)"
          >详情</el-button>
        </el-popover>-->
        <el-tooltip
          class="item"
          effect="dark"
          :disabled="scope.row.ifedit"
          :content="'他人与你共享的受众不可编辑，所属广告账户编号：${scope.row.ownAccountId}'"
          placement="top-start"
        >
          <span class="ctrlbutton">
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.ifedit"
              @click="toEdit(scope.row.audienceId, scope.row.subtype, scope.row.childliketype)"
            >编辑</el-button>
          </span>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :disabled="scope.row.ifedit"
          :content="`他人与你共享的受众你不可再次共享，所属广告账户编号：${scope.row.ownAccountId}`"
          placement="top-start"
        >
          <span class="ctrlbutton">
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.ifedit"
              @click="toShare(scope.row.id)"
            >共享</el-button>
          </span>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          :disabled="scope.row.ifdelete"
          content="已被用于创建类似受众，请先删除类似受众"
          placement="top-start"
        >
          <span class="ctrlbutton">
            <el-button
              type="text"
              size="small"
              :disabled="!scope.row.ifdelete"
              @click="toDelete(scope.row.id)"
            >删除</el-button>
          </span>
        </el-tooltip>
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
    handleSelectionChange(sl) {
      this.$emit("listSelect", sl);
    },
    toDelete(id) {
      this.$emit("toDelete", [id]);
    },
    toShare(id) {
      this.$emit("toShare", [id]);
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

      switch (type) {
        case "LOOKALIKE":
          this.$emit("likeEdit", id, ltype);
          break;
        case "APP":
          this.$emit("targetEdit", id);
          break;
        default:
          this.$emit("specialEdit", id);
          break;
      }
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
.childtype {
  font-size: 12px;
  color: #999;
}
.fbName {
  display: block;
}
.targetname {
  // line-height: 23px;
  // height: 23px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}
.ctrlbutton {
  margin-right: 10px;
}
.fbId {
  display: block;
  color: #999;
}
.create {
  color: #409eff;
}
</style>
