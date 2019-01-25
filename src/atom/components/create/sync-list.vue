<template>
  <el-table
    ref="multipleTable"
    :data="synclist"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" :selectable="ifChecked"></el-table-column>
    <el-table-column prop="creativityId" label="创意编号" width="100"></el-table-column>
    <!-- <el-table-column prop="creativityName" label="创意名称">
    </el-table-column>-->
    <el-table-column prop="address" label="缩略图" width="100" show-overflow-tooltip>
      <template slot-scope="scope">
        <span class="headpic">
          <img :src="scope.row.img" alt>
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="fbAccountId" label="账户ID" width="150">
      <template slot-scope="scope">{{scope.row.fbAccountId.split('_')[1]}}</template>
    </el-table-column>
    <el-table-column prop="adAccountName" label="账户名称"></el-table-column>
    <el-table-column prop="platFrom" label="平台" width="100"></el-table-column>
    <el-table-column prop="statusName" label="状态" width="100">
      <template slot-scope="scope">
        <el-tooltip
          v-if="scope.row.statusName == '同步失败'"
          class="item"
          effect="dark"
          :content="scope.row.message"
          placement="top-start"
        >
          <i class="el-icon-warning"></i>
        </el-tooltip>
        <span class="success" v-if="scope.row.statusName == '同步成功'">
          <el-tooltip
            v-if="scope.row.statusName == '同步成功'"
            class="item"
            effect="dark"
            :content="'Facebook创意编号：' + scope.row.fbCreativeId"
            placement="top-start"
          >
            <svg-icon svgname="Facebook" svgclass="facebookIcon"></svg-icon>
          </el-tooltip>
          {{scope.row.statusName}}
        </span>
        <span class="fail" v-else-if="scope.row.statusName == '同步失败'">{{scope.row.statusName}}</span>
        <span class="other" v-else>{{scope.row.statusName}}</span>
      </template>
    </el-table-column>

    <el-table-column prop="synTime" label="同步时间" width="120">
      <template slot-scope="scope">
        <span class="time">{{scope.row.synTime | timeFormat('yyyy-MM-dd')}}</span>
        <span class="time">{{scope.row.synTime | timeFormat('HH:mm:ss')}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["synclist"])
  },
  methods: {
    ifChecked(row, index) {
      if (row.statusName == "同步成功") return false;
      else return true;
    },
    handleSelectionChange(sel) {
      if (sel.length > 0) {
        this.$emit("multiSelect", sel);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.createTime {
  display: block;
}

.headpic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  background-color: #f5f5f5;
  position: relative;
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  img {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    height: 100%;
  }
}
.time {
  display: block;
}
.success {
  color: #67c23a;
  display: flex;
  align-items: center;
  .facebookIcon {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
}
.fail {
  color: #f56c6c;
}
.other {
  color: #409eff;
}
</style>
