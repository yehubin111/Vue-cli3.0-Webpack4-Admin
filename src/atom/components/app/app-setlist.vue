<template>
  <el-table height="400" id="setList" :data="list" style="width: 100%">
    <el-table-column prop="fbAccountId" label="账户ID" width="180">
    </el-table-column>
    <el-table-column prop="name" label="账户名称">
    </el-table-column>
    <el-table-column prop="balance" label="账户余额($)" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.balance / 100}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="stateName" label="是否启用" width="120"></el-table-column>
    <el-table-column prop="address" label="操作" width="100">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="toCancel(scope.row.fbId)">取消</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["id", 'keyword'],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["setapplist"]),
    list() {
      let k = this.keyword.trim().toLowerCase();
      return this.setapplist.filter(v => v.fbAccountId.toLowerCase().indexOf(k) != -1 || v.name.toLowerCase().indexOf(k) != -1)
    }
  },
  methods: {
    toCancel(id) {
      let { fbAccountId, applicationId } = {
        fbAccountId: id,
        applicationId: this.id
      };
      this.$store.dispatch("delSet", {
        option: [{ fbAccountId, applicationId }]
      });
    }
  }
};
</script>

<style>
</style>
