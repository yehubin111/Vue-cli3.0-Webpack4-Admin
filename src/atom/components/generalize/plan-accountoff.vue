<template>
    <div class="table">
        <el-table height="400" :data="nouseaccount" style="width: 100%">
            <el-table-column prop="fbAccountId" label="账户ID" width="160">
            </el-table-column>
            <el-table-column prop="name" label="账户名称">
            </el-table-column>
            <el-table-column prop="balance" label="账户余额" width="100">
                <template slot-scope="scope">
                    <span>
                        ${{scope.row.balance}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="accountStatus" label="状态" width="80">
                <template slot-scope="scope">
                    <span>
                        {{scope.row.accountStatus == 1? '正常': '异常'}}
                    </span>
                </template>
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
                    <el-button :disabled="scope.row.accountStatus != 1" @click="toSelect(scope.row.fbId, scope.row.status)" type="text" size="small">添加</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  props: ["pid"],
  computed: {
    ...mapGetters(["nouseaccount"])
  },
  methods: {
    ...mapMutations(["SELECTCREATE"]),
    toSelect(id, status) {
      let option = [];
      let obj = {
        fbAccountId: id,
        planId: this.pid,
        accountStatus: status
      };
      option.push(obj);
      this.$store.dispatch("addAccount", { option });
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
