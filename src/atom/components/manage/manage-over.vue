<template>
    <el-dialog
  title=""
  :visible.sync="dialogVisible"
  width="30%"
  @close="toCancel">
  <span>归档后将不可进入，确认归档？</span>
  <el-checkbox class="checkbox" v-model="checked">停用广告系列</el-checkbox>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="toOver">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
export default {
  props: ["id", "status"],
  data() {
    return {
      dialogVisible: false,
      checked: false
    };
  },
  methods: {
    toCancel() {
      this.$emit("cancelAddbm", "status2");
      this.checked = false;
    },
    toOver() {
      let id = this.id;
      let adIsOff = this.checked;

      this.$store.dispatch("overProject", { id, adIsOff });
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
