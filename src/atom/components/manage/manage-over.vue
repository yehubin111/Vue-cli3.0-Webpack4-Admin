<template>
  <el-dialog title :visible="status" width="30%" @close="toCancel">
    <span>归档后将不可进入，确认归档？</span>
    <el-checkbox class="checkbox" v-model="checked">停用广告系列</el-checkbox>
    <span slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="toOver">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Msgsuccess, Msgerror } from '../../js/message';
export default {
  props: ["id", "status"],
  data() {
    return {
      checked: false
    };
  },
  methods: {
    toCancel() {
      this.$emit("update:status", false);
      this.checked = false;
    },
    async toOver() {
      let id = this.id;
      let adIsOff = this.checked;

      let res = await this.$store.dispatch("overProject", { id, adIsOff });
      if (res.data) {
        Msgsuccess("归档成功");
        this.$emit("resetList");
      } else {
        Msgerror("归档失败");
      }
      this.toCancel();
    }
  },
  watch: {}
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
