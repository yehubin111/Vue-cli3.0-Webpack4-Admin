<template>
    <div class="table">
        <el-table :data="nousecreate" height="400" style="width: 100%">
            <el-table-column prop="id" label="创意ID" width="80">
            </el-table-column>
            <el-table-column prop="creativityText" label="文本">
            </el-table-column>
            <el-table-column prop="creativityTypeName" label="类型" width="100">
            </el-table-column>
            <el-table-column prop="picture" label="缩略图" width="120">
                <template slot-scope="scope">
                    <span class="headpic"><img :src="scope.row.img" alt=""></span>
                </template>
            </el-table-column>
            <el-table-column prop="classify" label="分类" width="160">
            </el-table-column>
            <el-table-column prop="status" label="启用/停用" width="100">
                <template slot-scope="scope">
                    <span>
                        {{scope.row.status == 0? '已停用': '已启用'}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                    <el-button @click="toSelect(scope.row.id, scope.row.status)" type="text" size="small">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageswitch">
            <el-pagination background layout="prev, pager, next" :total="nousetotal" :page-size="20" @current-change="pageSwitch">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  props: ["pid"],
  computed: {
    ...mapState(["nousecreate", "nousetotal"])
  },
  methods: {
    ...mapMutations(["SELECTCREATE"]),
    toSelect(id, status) {
      let option = [];
      let obj = {
        creativeId: id,
        planId: this.pid,
        creativeStatus: status
      };
      option.push(obj);
      this.$store.dispatch("addCreate", { option });
    },
    pageSwitch(page) {
      let plan_id = this.pid;
      let pageIndex = page;
      this.$store.dispatch("getNouseCreate", { plan_id, pageIndex });
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
    height: 100%;
  }
}
.pageswitch {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
