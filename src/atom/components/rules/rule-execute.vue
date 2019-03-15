<template>
  <el-dialog title="规则执行预览" :visible="status" class="deletedialog" @close="toCancel">
    <p class="fonttip important">
      <b>如果现在运行规则，{选中的/以下}{广告系列/广告组/广告}{都不符合/符合}你的条件，设置的条件是：</b>
    </p>
    <div class="fonttip important" style="margin-bottom: 20px;">
      <p>· {指标名称}{运算符}$50.00</p>
      <p>· 已花费大于$50.00</p>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="date" label="名称"></el-table-column>
      <el-table-column prop="name" label="详情"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="submitExecute">执 行</el-button>
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
        this.$emit('update.status', false);
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
