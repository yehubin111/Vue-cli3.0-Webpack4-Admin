<template>
  <el-table id="regularList" :data="ruleform" style="width: 1200px" @sort-change="sortChange">
    <el-table-column prop="groupId" label="规则ID" width="140">
    </el-table-column>
    <el-table-column prop="name" label="规则名称" width="400">
    </el-table-column>
    <el-table-column prop="installChange" label="安装变化" sortable="custom">
      <template slot-scope="scope">
        {{scope.row.installChange?scope.row.installChange.toFixed(2) + '%': '--'}}
      </template>
    </el-table-column>
    <el-table-column prop="costChange" label="花费变化" sortable="custom">
      <template slot-scope="scope">
        {{scope.row.costChange?scope.row.costChange.toFixed(2) + '%': '--'}}
      </template>
    </el-table-column>
    <el-table-column prop="cpiChange" label="CPI变化" sortable="custom">
      <template slot-scope="scope">
        {{scope.row.cpiChange?scope.row.cpiChange.toFixed(2) + '%': '--'}}
      </template>
    </el-table-column>
  </el-table>

</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      filters: {
        country: [],
        imporession: []
      }
    };
  },
  methods: {
    sortChange({ column, prop, order }) {
      let sort = "";
      switch (prop) {
        case "installsNum":
          if (order == "ascending") sort = "installs_num asc";
          else sort = "installs_num desc";
          break;
        case "spend":
          if (order == "ascending") sort = "spend asc";
          else sort = "spend desc";
          break;
        case "cpi":
          if (order == "ascending") sort = "cpi asc";
          else sort = "cpi desc";
          break;
      }

      this.$emit("tableSort", sort);
    }
  },
  computed: {
    ...mapState(["ruleform"])
  }
};
</script>

<style lang="less" scoped>
.tablelist {
  .download {
    font-size: 14px;
    color: #3297ff;
    text-align: right;
    line-height: 20px;
    margin-bottom: 5px;
    span {
      position: relative;
      padding-right: 24px;
      display: inline-block;
      cursor: pointer;
      .save {
        width: 16px;
        height: 16px;
        position: absolute;
        right: 0;
        top: 2px;
        cursor: pointer;
      }
    }
  }
}
</style>
