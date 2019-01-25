<template>
  <el-table :data="dispage" style="width: 100%">
    <el-table-column prop="pageId" label="主页ID" width="200">
    </el-table-column>
    <el-table-column prop="picture" label="主页头像" width="120">
      <template slot-scope="scope">
        <span class="headpic"><img :src="scope.row.picture" alt=""></span>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="主页昵称">
    </el-table-column>
    <el-table-column prop="insId" label="instagram ID">
    </el-table-column>
    <el-table-column label="操作" width="120">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row.pageId)" type="text" size="small">同步PBIA</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["dispage"])
  },
  methods: {
    handleClick(id) {
      this.$store.dispatch("getPbia", id);
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
</style>
