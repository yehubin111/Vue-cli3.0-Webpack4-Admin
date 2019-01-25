<template>
    <el-dialog
  title=""
  :visible.sync="dialogVisible"
  width="30%"
  @close="toCancel">
  <span>确认激活此项目吗？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="toBegin">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
export default {
  props: ["id", "status"],
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    toCancel() {
      this.$emit("cancelAddbm", "status2");
    },
    toBegin() {
      let id = this.id;

      this.$store.dispatch("beginProject", { id });
      this.dialogVisible = false;
    }
  },
  watch: {
    status(n, v) {
      this.dialogVisible = n;
    }
  }
};
</script>

<style lang="less" scoped>
.checkbox {
  display: block;
  position: absolute;
  bottom: 28px;
  left: 20px;
}
</style>
