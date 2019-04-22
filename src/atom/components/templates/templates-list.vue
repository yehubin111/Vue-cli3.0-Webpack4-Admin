<template>
  <el-table :data="templatelist" style="width: 100%">
    <el-table-column prop="id" label="ID" width="120"></el-table-column>
    <el-table-column prop="coverImage" label="封面">
      <template slot-scope="scope">
        <p class="image">
          <img :src="'http://172.31.1.76' + scope.row.coverImage" alt>
        </p>
      </template>
    </el-table-column>
    <el-table-column prop="size" label="尺寸" width="140"></el-table-column>
    <el-table-column prop="business" label="行业" width="140"></el-table-column>
    <el-table-column prop="label" label="标签" width="140"></el-table-column>
    <el-table-column prop="isLogo" label="LOGO" width="140">
      <template slot-scope="scope">
        <p>{{scope.row.isLogo == '0'? '不支持': '支持'}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="templateImage" label="素材" width="140">
      <template slot-scope="scope">
        <p>{{JSON.parse(scope.row.templateImage).length}}个</p>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="操作" width="140">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="editTemp(scope.row.id)">编辑</el-button>
        <el-button type="text" size="small" @click="deleteTemp(scope.row.id)">删除</el-button>
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
    ...mapState(["templatelist"])
  },
  methods: {
    deleteTemp(id) {
      this.$confirm("删除模板后将不可恢复，确认删除模板吗?", "删除模板", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await this.$store.dispatch("deleteTemp", { id });
          if (res.data) {
            this.$emit("templistReset");
          }
        })
        .catch(() => {});
    },
    editTemp(id) {
      this.$router.push({
        name: "addtemplates",
        params: {
          eid: id
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 1px solid #ddd;
  img {
    width: 100%;
  }
}
</style>
