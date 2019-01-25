<template>
  <div class="cardtable">
    <el-table id="dataTableCard" ref="dataCard" @sort-change="sortChange" :data="createcardlist" style="width: 960px">
      <el-table-column prop="creativeId" fixed label="创意ID" width="100">
      </el-table-column>
      <el-table-column prop="adCreativeName" fixed label="创意名称">
      </el-table-column>
      <el-table-column prop="creativeCardId" fixed label="卡片ID" width="100">
      </el-table-column>
      <el-table-column prop="creativeCardName" fixed label="卡片名称">
      </el-table-column>
      <!-- <el-table-column prop="creativeCardImage" label="缩略图" width="90">
      <template slot-scope="scope">
        <span class="headpic"><img :src="scope.row.creativeCardImage" alt=""></span>
      </template>
    </el-table-column> -->
      <el-table-column prop="country" label="国家" width="90">
      </el-table-column>
      <el-table-column prop="clicksNum" label="点击" sortable="custom" width="90">
      </el-table-column>
    </el-table>
    <el-tooltip class="item" effect="dark" content="Facebook中轮播卡片只能获取到点击量" placement="top-start">
      <i class="el-icon-warning"></i>
    </el-tooltip>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    sortChange({ column, prop, order }) {
      let sort = "";

      if (order == "ascending") sort = "clicks_num asc";
      else sort = "clicks_num desc";

      this.$emit("tableSort", sort);
    }
  },
  computed: {
    ...mapState(["createcardlist"])
  }
};
</script>

<style>
.cardtable .el-table .caret-wrapper{
    margin-left: 15px;
  }
</style>

<style lang="less" scoped>
.headpic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  background-color: #f5f5f5;
  position: relative;
  img {
    // width: 100%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    height: 100%;
  }
}
.cardtable{
  position: relative;
  .item{
    position: absolute;
    right: 35px;
    top: 23px;
  }
  
}
</style>
