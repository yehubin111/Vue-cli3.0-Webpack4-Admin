<template>
  <el-table
    id="outAdList"
    :ref="'multipleTable' + type"
    :key="customOption.map(v => v.name).join(',')"
    :data="datalist"
    :height="600"
    border
    style="width: 100%"
    @selection-change="handleSelectionChange"
    @sort-change="sortChange"
    show-summary
    :summary-method="getSummaries"
  >
    <el-table-column type="selection" :selectable="ifSelect" fixed width="55"></el-table-column>
    <el-table-column label="状态" fixed width="80">
      <template slot-scope="scope">
        <i class="el-icon-loading jobstatus" v-show="scope.row.jobStatus"></i>
        <el-tooltip
          v-if="!scope.row.iscare"
          class="item"
          :disabled="!scope.row.effectiveStatus || scope.row.effectiveStatus == 'ACTIVE' || scope.row.effectiveStatus == 'PAUSED'"
          effect="dark"
          :content="scope.row.effectiveStatus == 'ARCHIVED'?'已归档不可开关':'已删除不可开关'"
          placement="top-start"
        >
          <el-switch
            class="statusswitch"
            v-model="scope.row.switchStatus"
            :disabled="scope.row.jobStatus || scope.row.load || scope.row.effectiveStatus == 'ARCHIVED' || scope.row.effectiveStatus == 'DELETED'"
            active-value="ACTIVE"
            inactive-value="PAUSED"
            active-color="#13ce66"
            inactive-color="#d7dae2"
            @change="switchChange(scope.row.switchStatus, scope.row[typeData.effectIdsPush])"
          ></el-switch>
        </el-tooltip>
        <div
          class="statusload"
          v-if="!scope.row.iscare"
          v-loading="scope.row.load"
          element-loading-text
          element-loading-spinner="el-icon-loading"
        ></div>
        <p v-if="scope.row.iscare"></p>
      </template>
    </el-table-column>
    <el-table-column
      :prop="item.key"
      v-for="(item,index) in customOption"
      :key="index"
      :fixed="!item.checked"
      :label="item.name"
      :sortable="item.name != '广告系列名称' && item.name != '广告组名称' && item.name != '广告名称' && !item.isevent && !item.nosort? 'custom' : false"
      :width="item.name.indexOf('名称') == -1 && item.name.indexOf('编号') == -1?'100': '200'"
    >
      <template slot-scope="scope">
        <!--广告系列名称，广告组名称，点击可跳转到下一级tab-->
        <p
          :class="{canjump: true, linedata: true, iscare: scope.row.iscare}"
          v-if="!scope.row.iscare && item.link"
          @click="tabJump(scope.row)"
          :title="item.name != '广告系列名称' && item.name != '广告组名称'?'':scope.row[item.key]"
        >{{scope.row[item.key] || scope.row[item.key] === 0 || scope.row[item.key] === "0"? scope.row[item.key]:'--'}}</p>
        <!--20190212新增，广告名称旁边放缩略图-->
        <p v-else-if="!scope.row.iscare && item.name == '广告名称'" class="adname">
          <span class="headpic">
            <a :href="scope.row.materialText" target="_blank">
              <img :src="scope.row.materialText">
            </a>
          </span>
          <span class="name" :title="scope.row[item.key]">{{scope.row[item.key]}}</span>
        </p>
        <!--20190212新增，动态创意图片/视频 细分数据情况，缩略图-->
        <p
          v-else-if="scope.row.careimg && (item.name == '广告系列名称' || item.name == '广告组名称' || item.name == '广告名称')"
          v-html="scope.row[item.key] ? scope.row[item.key]:'--'"
        ></p>
        <!--普通数据-->
        <p
          :class="{linedata: true, iscare: scope.row.iscare}"
          v-else
          :title="item.name != '广告名称'?'':scope.row[item.key]"
        >{{scope.row[item.key] || scope.row[item.key] === 0 || scope.row[item.key] === '0'? scope.row[item.key]:'--'}}</p>
        <!--投放状态二级状态-->
        <p
          v-if="item.key == 'effectiveStatusName' && scope.row.effectiveImport != scope.row.effectiveStatus"
          style="font-size: 12px;color: #999;"
        >{{scope.row.effectiveImportName}}</p>
        <!--广告系列/广告组/广告名称 操作按钮-->
        <p
          class="namectrl"
          v-if="item.tool && !scope.row.iscare && scope.row.effectiveStatus != 'ARCHIVED' && scope.row.effectiveStatus != 'DELETED' && (item.name == '广告系列名称' || item.name == '广告组名称' || item.name == '广告名称')"
        >
          <el-button
            icon="el-icon-edit-outline"
            type="text"
            size="mini"
            @click="toEdit(scope.row[typeData.effectIdsPush], [scope.row.campaignName, scope.row.adSetName, scope.row.adName])"
            :disabled="scope.row.jobStatus"
          >编辑</el-button>
          <el-button
            icon="el-icon-news"
            type="text"
            size="mini"
            @click="toCopy(scope.row[typeData.effectIdsPush], scope.row[typeData.originalId], scope.row[typeData.originalName], scope.row.accountId)"
            :disabled="scope.row.jobStatus"
          >复制</el-button>
          <el-button
            icon="el-icon-setting"
            type="text"
            size="mini"
            @click="setRule(scope.row[typeData.effectIdsPush])"
            :disabled="scope.row.jobStatus"
          >规则</el-button>
          <el-button
            icon="el-icon-edit"
            type="text"
            size="mini"
            @click="reName(scope.row[typeData.effectIdsPush], scope.row[item.key])"
            :disabled="scope.row.jobStatus"
            class="rename"
          ></el-button>
        </p>
      </template>
    </el-table-column>
  </el-table>

  <!-- </div> -->
</template>


<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["customOption", "type"],
  data() {
    return {};
  },
  computed: {
    ...mapState(["adcampaignlist", "adsetlist", "adadlist", "adlisttotal"]),
    // 计算表格宽度
    totalWidth() {
      let totalwidth = 0;
      // 加上默认栏宽度
      totalwidth += 140;
      this.customOption.forEach(v => {
        // 20为margin
        if (v.name == "广告系列名称") {
          totalwidth += 200 + 20;
        } else {
          totalwidth += 120;
        }
      });
      return totalwidth;
    },
    datalist() {
      // console.log(this.adcampaignlist);
      if (this.type == "campaignName") return JSON.parse(this.adcampaignlist);
      if (this.type == "adSetName") return JSON.parse(this.adsetlist);
      if (this.type == "adName") return JSON.parse(this.adadlist);
    },
    typeData() {
      let k = {};
      switch (this.type) {
        case "campaignName":
          k.effectIds = "adCampaignIds";
          k.effectIdsPush = "campaignId";
          // k.effectName = "campaignName";
          k.originalId = "campaignId"; // 复制所需特殊id, 复制campaign无需id
          k.originalName = "campaignName"; // 复制所需特殊name, 复制campaign无需name
          break;
        case "adSetName":
          k.effectIds = "adSetIds";
          k.effectIdsPush = "adsetId";
          // k.effectName = "adSetName";
          k.originalId = "campaignId";
          k.originalName = "campaignName";
          break;
        case "adName":
          k.effectIds = "adIds";
          k.effectIdsPush = "adId";
          // k.effectName = "adName";
          k.originalId = "adsetId";
          k.originalName = "adSetName";
          break;
      }
      return k;
    }
  },
  created() {
    // console.log(this.customOption);
  },
  methods: {
    ...mapMutations(["SETSTATE", "CHANGEADLOAD"]),
    getSummaries(param) {
      let { columns, data } = param;
      let sums = [];
      let persentArray = [
        "ctr",
        "afMinsRate",
        "afRetentionRate",
        "cvr",
        "afCtr",
        "afLoyalUsersRate",
        "afROI",
        "afConversionRate",
        "afReRate1",
        "afReRate2",
        "afReRate3",
        "afReRate4",
        "afReRate5",
        "afReRate6",
        "afReRate7"
      ];
      columns.forEach((column, index) => {
        switch (index) {
          case 0:
            sums[index] = "合计";
            break;
          case 1:
          case 2:
            sums[index] = "";
            break;
          default:
            let d =
              this.adlisttotal[column.property] ||
              this.adlisttotal[column.property] === 0
                ? this.adlisttotal[column.property]
                : "";
            sums[index] =
              d + (d && persentArray.indexOf(column.property) != -1 ? "%" : "");
            break;
        }
      });

      return sums;
    },
    tabJump(row) {
      let tabname = "";
      if (this.type == "campaignName") {
        tabname = "second";
      } else {
        tabname = "third";
      }
      this.$emit("tabJump", tabname, row, this.type);

      this.$refs["multipleTable" + this.type].clearSelection();
      this.$refs["multipleTable" + this.type].toggleRowSelection(row, true);
    },
    setRule(id) {
      this.$emit('setRule', id);
    },
    toEdit(id, name) {
      this.$emit("toEdit", [id], name);
    },
    toCopy(id, orgid, orgname, accountId, creative, marketurl) {
      let obj = {
        id,
        orgid,
        orgname,
        creative,
        marketurl
      };
      let option = [obj];
      this.$emit("toCopy", option, accountId);
    },
    ifSelect(row, index) {
      /**
       * 无法选择操作的数据
       * 细分数据 or 已删除的数据 or 操作中的数据
       */
      if (row.iscare || row.effectiveStatus == "DELETED" || row.jobStatus) {
        return false;
      } else {
        return true;
      }
    },
    // 重命名
    reName(key, name) {
      this.$emit("reName", key, name);
    },
    sortChange({ column, prop, order }) {
      if (!prop) {
        this.$emit("tableSort", "");
        return;
      }
      // let sort = "";
      let sort = prop;

      if (order == "ascending") sort += " asc";
      else sort += " desc";

      this.$emit("tableSort", sort);
    },
    handleSelectionChange(vl) {
      this.$emit("mutilSelect", vl);
    },
    switchChange(status, id) {
      let option = {
        // adIds: id,
        effectiveStatus: status
      };
      option[this.typeData.effectIds] = id;
      this.$store.dispatch("changeAdstatus", {
        option,
        type: this.type,
        fullScreen: true
      });
      // load
      this.CHANGEADLOAD(id);
    }
  }
};
</script>
<style lang="less">
.statusload {
  float: left;
  width: 20px;
  height: 20px;
  display: inline-block;
  .el-loading-mask {
    background-color: transparent;
    .el-loading-spinner {
      top: 0;
      margin-top: -1px;
    }
  }
}
.headpic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  background-color: #f5f5f5;
  position: relative;
  margin-right: 10px;
  flex-basis: 60px;
  flex-shrink: 0;
  img {
    // width: 100%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    height: 100%;
    cursor: pointer;
  }
}
</style>

<style lang="less" scoped>
.adtable {
  width: 960px;
  .at-table {
    width: 100%;
    overflow-x: auto;
    position: relative;
    &.fixtable {
      position: absolute;
      top: 0;
      left: 0;
    }
    .at-title {
      overflow: hidden;
      border-bottom: 1px solid #e5e5e5;
      // height: 60px;
      display: flex;
      align-items: center;
      li {
        float: left;
        font-size: 14px;
        font-weight: bold;
        margin: 0 10px;
        width: 60px;
        padding: 15px 0;
        word-break: break-all;
        &.sortable {
          cursor: pointer;
          span {
            position: relative;
            display: inline-block;
            &:before {
              content: "";
              height: 0;
              width: 0;
              border: 5px solid transparent;
              border-bottom-color: #c0c4cc;
              position: absolute;
              display: inline-block;
              right: -15px;
              bottom: 50%;
              margin-bottom: 1px;
            }
            &:after {
              content: "";
              height: 0;
              width: 0;
              border: 5px solid transparent;
              border-top-color: #c0c4cc;
              position: absolute;
              display: inline-block;
              right: -15px;
              top: 50%;
              margin-top: 1px;
            }
          }
        }
        &.desc {
          span {
            &:after {
              border-top-color: #409eff;
            }
          }
        }
        &.asc {
          span {
            &:before {
              border-bottom-color: #409eff;
            }
          }
        }
      }
    }
    .at-box {
      height: 500px;
      overflow-y: auto;
      .at-line {
        overflow: hidden;
        border-bottom: 1px solid #e5e5e5;
        display: flex;
        align-items: center;
        li {
          float: left;
          // line-height: 60px;
          font-size: 14px;
          margin: 0 10px;
          padding: 15px 0;
          // height: 60px;
          flex-shrink: 0;
          p {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
    }
  }
}
.jobstatus {
  position: absolute;
  left: -20px;
  // margin-top: 2px;
  top: 50%;
  margin-top: -8px;
}
.adInfo {
  height: 69px;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}
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
.autoline {
  padding: 0 5px;
  line-height: 20px;
  color: #fff;
  background-color: #67c23a;
  display: inline-block;
  border-radius: 3px;
  font-size: 12px;
}
.statusswitch {
  float: left;
}
.linedata {
  height: 24px;
  line-height: 24px;
  padding: 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &.iscare {
    text-overflow: inherit;
    white-space: pre-wrap;
    height: auto;
  }
  &.canjump {
    color: #409eff;
    cursor: pointer;
  }
}
.adname {
  display: flex;
  .headpic {
  }
  .name {
    height: 60px;
    line-height: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.namectrl {
  font-size: 12px;
  min-width: 200px;
  .rename{
    position: absolute;
    top: calc((100% - 40px) / 2);
    right: 0;
    padding: 0;
  }
}
</style>
