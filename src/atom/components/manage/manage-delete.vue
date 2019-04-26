<template>
  <el-dialog title="删除项目" :visible="status" width="30%" @close="toCancel">
    <span>一旦删除了项目，项目内的推广计划、创意库等都将会被永久删除，不可恢复！广告不会被删除</span>
    <el-checkbox class="checkbox" v-model="checked">暂停所有广告系列</el-checkbox>
    <span slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="toOver">删 除</el-button>
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
      let projectId = this.id;
      let pauseCampaigns = this.checked;

      let res = await this.$store.dispatch("deleteProject", { projectId, pauseCampaigns });
      if(res.data) {
          Msgsuccess("删除成功");
          this.$emit('resetList');
      } else {
          Msgerror("删除失败");
      }
      this.toCancel();
    }
  },
  watch: {
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
