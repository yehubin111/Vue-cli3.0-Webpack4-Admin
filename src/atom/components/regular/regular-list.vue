<template>
  <el-table :data="regularlist" style="width: 100%">
    <el-table-column prop="id" label="规则ID" width="140">
    </el-table-column>
    <el-table-column prop="name" label="规则名称" width="300">
    </el-table-column>
    <el-table-column prop="description" label="描述">
    </el-table-column>
    <el-table-column prop="statusName" label="状态" width="140">
    </el-table-column>
    <el-table-column label="操作" width="120">
      <template slot-scope="scope">
        <el-button type="text" size="small" v-if="scope.row.ruleStatus != 0" @click="setApp(scope.row.id, 0)">测试</el-button>
        <el-button type="text" size="small" v-if="scope.row.ruleStatus != 1" @click="setApp(scope.row.id, 1)">上架</el-button>
        <el-button type="text" size="small" v-if="scope.row.ruleStatus != 2" @click="setApp(scope.row.id, 2)">下架</el-button>
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
    ...mapState(["regularlist"])
  },
  methods: {
    switchChange(status, id) {
      this.$store.dispatch("accountStatus", { status, id });
    },
    setApp(id, status) {
      this.$store.dispatch("setRegularStatus", { status, id });
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
.marketType {
  display: block;
}
</style>
