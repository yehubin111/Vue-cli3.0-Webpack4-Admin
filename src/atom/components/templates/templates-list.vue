<template>
  <div>
    <el-table :data="disapp" style="width: 100%">
      <el-table-column prop="applicationId" label="ID" width="200"></el-table-column>
      <el-table-column prop="name" label="封面"></el-table-column>
      <el-table-column prop="category" label="尺寸" width="180"></el-table-column>
      <el-table-column prop="name" label="行业"></el-table-column>
      <el-table-column prop="category" label="标签" width="180"></el-table-column>
      <el-table-column prop="name" label="LOGO"></el-table-column>
      <el-table-column prop="category" label="素材" width="180"></el-table-column>
      <el-table-column prop="name" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="setDetection(scope.row.applicationId, scope.row.applicationPlatformVO)"
          >编辑</el-button>
          <el-button type="text" size="small" @click="deleteTemp()">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageswitch">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageSwitch"
        :current-page="pageindex"
        :page-sizes="[20, 50, 80]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageindex: 1,
      pagesize: 20,
      total: 30
    };
  },
  methods: {
    pageSizeChange() {},
    pageSwitch() {},
    deleteTemp() {
      this.$confirm("删除模板后将不可恢复，确认删除模板吗?", "删除模板", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.pageswitch {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 100px;
}
</style>
