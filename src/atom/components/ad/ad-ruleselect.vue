<template>
  <el-dialog :title="`应用广告账户995947930587032的规则`" :visible="status" class="deletedialog" @close="toCancel">
    <p class="fonttip important">
      <b>可选择规则并应用到已选择的对象中</b>
    </p>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" fixed width="55"></el-table-column>
      <el-table-column prop="date" label="名称"></el-table-column>
      <el-table-column prop="name" label="操作与条件"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="submitExecute">应 用</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: ["status"],
  data() {
    return {
      tableData: [{ name: "111", date: "222" }]
    };
  },
  methods: {
    toCancel() {
      this.$emit("update:status", false);
    },
    submitExecute() {}
  },
  computed: {},
  watch: {}
};
</script>

<style lang='less' scoped>
.fonttip {
  margin-bottom: 10px;
}
.targetlist {
  margin-bottom: 20px;
}
</style>
