<template>
  <el-table :data="disapp" style="width: 100%">
    <el-table-column prop="picture" label="应用LOGO" width="120">
      <template slot-scope="scope">
        <span class="headpic"><img :src="scope.row.picture" alt=""></span>
      </template>
    </el-table-column>
    <el-table-column prop="applicationId" label="应用ID" width="200">
    </el-table-column>
    <el-table-column prop="name" label="应用名称">
    </el-table-column>
    <el-table-column prop="category" label="平台" width="180">
      <template slot-scope="scope">
        <span class="marketType" v-for="(l, index) in scope.row.applicationPlatformVO" :key="index">{{l.marketType}}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="accountNum" label="广告账户" width="180">
      <template slot-scope="scope">
        <el-button type="text" @click="setApp(scope.row.applicationId)">{{scope.row.accountNum}}</el-button>
      </template>
    </el-table-column> -->
    <!-- <el-table-column label="操作" width="120">
      <template slot-scope="scope">
        <el-button type="text" size="small" :disabled="scope.row.applicationPlatformVO.filter(v => v.marketType == 'google_play' || v.marketType == 'itunes').length == 0" @click="setDetection(scope.row.applicationId, scope.row.applicationPlatformVO)">设置监测平台</el-button>
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // value2: 1
    };
  },
  computed: {
    ...mapGetters(["disapp"])
  },
  methods: {
    switchChange(status, id) {
      this.$store.dispatch("accountStatus", { status, id });
    },
    // setApp(id) {
    //   this.$emit("editApp", id);
    // },
    // setDetection(id, platform) {
    //   this.$emit("setDetection", id, platform);
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
.marketType {
  display: block;
}
</style>
