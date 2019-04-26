<template>
  <el-table :data="dismanage" style="width: 100%" id="manageTable">
    <!-- <el-table-column prop="id" label="项目ID" width="140">
    </el-table-column> -->
    <el-table-column prop="projectName" label="项目名称">
    </el-table-column>
    <el-table-column prop="closer" label="归档人/时间" width="100">
      <template slot-scope="scope">
        <span class="marketType">{{scope.row.closer}}</span>
        <span class="marketType">{{scope.row.closeTime | timeFormat}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="projectPlatform" label="投放平台" width="100">
    </el-table-column>
    <el-table-column prop="projectTarget" label="项目目标">
    </el-table-column>
    <el-table-column label="操作" width="100">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="toBegin(scope.row.id)">激活</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      // value2: 1
    };
  },
  computed: {
    ...mapGetters(["dismanage"])
  },
  created() {
    let v = "";
    let k = "projectkwd";

    this.SETSTATE({ k, v });
  },
  mounted() {
    let status = 0;
    this.$store.dispatch("getManageOffList", { status });
  },
  methods: {
    ...mapMutations(['SETSTATE']),
    toBegin(id) {
      this.$emit("beginProject", id);
    }
  }
};
</script>

<style lang="less" scoped>
.headpic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  background-color: #f5f5f5;
  img {
    width: 100%;
  }
}
.detail {
  color: #66b1ff;
}
.marketType {
  display: block;
}
</style>
