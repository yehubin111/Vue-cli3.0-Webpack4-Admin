<template>
    <el-table height="400" id="cansetapplist" :data="list" style="width: 100%">
        <el-table-column prop="fbAccountId" label="账户ID" width="180">
        </el-table-column>
        <el-table-column prop="name" label="账户名称">
        </el-table-column>
        <el-table-column prop="balance" label="账户余额($)" width="120">
            <template slot-scope="scope">
                <span>{{scope.row.balance / 100}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="是否启用" width="120">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 1">已启用</span>
                <span v-else>未启用</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="100">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="toSet(scope.row.fbId)">加入</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["id", "keyword"],
  data() {
    return {
      // loading: true
    };
  },
  computed: {
    ...mapGetters(["cansetapplist"]),
    list() {
      let k = this.keyword.trim().toLowerCase();
      return this.cansetapplist.filter(
        v =>
          v.fbAccountId.toLowerCase().indexOf(k) != -1 ||
          v.name.toLowerCase().indexOf(k) != -1
      );
    }
  },
  methods: {
    toSet(id) {
      let fbAccountId = id;
      let applicationId = this.id;
      this.$store.dispatch("saveSet", {
        option: [{ fbAccountId, applicationId }]
      });
    }
  }
};
</script>

<style>
</style>
