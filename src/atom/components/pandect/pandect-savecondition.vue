<template>
  <el-dialog title="保存自定义列" :visible="status" @close="toCancel">
    <el-form>
      <el-form-item label="条件名称" label-width="120px">
        <el-input v-model="conditionName" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="saveCondtion">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Msgwarning } from "../../js/message";
export default {
  props: ["status"],
  data() {
    return {
      conditionName: ""
    };
  },
  computed: {},
  methods: {
    toCancel() {
      this.$emit("update:status", false);
    },
    saveCondtion() {
      if (this.conditionName.trim() == "") {
        Msgwarning("请输入条件名称");
        return;
      }
      this.$emit("save", this.conditionName);
      this.conditionName = "";
    }
  }
};
</script>

<style>
</style>
