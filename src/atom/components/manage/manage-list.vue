<template>
  <el-table :data="dismanage" style="width: 100%" id="manageTable">
    <el-table-column prop="id" label="项目ID" width="140">
    </el-table-column>
    <el-table-column prop="projectName" label="项目名称">
      <template slot-scope="scope">
        <router-link class="detail" :to="'/project/' + scope.row.id + '/plan'">{{scope.row.projectName}}</router-link>
      </template>
    </el-table-column>
    <el-table-column prop="creater" label="创建人/时间" width="100">
      <template slot-scope="scope">
        <span class="marketType">{{scope.row.creater}}</span>
        <span class="marketType">{{scope.row.createTime | timeFormat}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="projectPlatform" label="投放平台" width="100">
    </el-table-column>
    <el-table-column prop="projectTarget" label="项目目标">
    </el-table-column>
    <el-table-column label="操作" width="140">
      <template slot-scope="scope">
        <el-button type="text" size="small">
          <router-link class="detail" :to="'/project/' + scope.row.id">详情</router-link>
        </el-button>
        <el-button type="text" size="small" @click="toEdit(scope.row.id)">编辑</el-button>
        <el-button type="text" size="small" @click="toOver(scope.row.id)">归档</el-button>
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
    this.$store.dispatch("getManagelist", {});
  },
  methods: {
    ...mapMutations(['SETSTATE']),
    toEdit(id) {
      this.$emit("editProject", id);
    },
    toOver(id) {
      this.$emit("overProject", id);
    }
    // switchChange(status, id) {
    //   this.$store.dispatch("accountStatus", { status, id });
    // },
    // setApp(id) {
    //   this.$store.dispatch("setApp", id);
    // }
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
