<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form>
      <el-form-item label="条件名称" label-width="120px">
        <el-input v-model="conditionName" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveCondtion">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Msgwarning } from "../../js/message";
import { mapState } from 'vuex';
export default {
  props: ["savetype"],
  data() {
    return {
      dialogFormVisible: false,
      conditionName: ""
    };
  },
  computed: {
    ...mapState(['saveoption']),
    title() {
      switch (this.savetype) {
        case "1":
          return "保存筛选条件";
          break;
        case "2":
          return "保存自定义列";
          break;
      }
    }
  },
  methods: {
    showBox() {
      this.dialogFormVisible = true;
    },
    saveCondtion() {
      if (this.conditionName.trim() == "") {
        Msgwarning("请输入条件名称");
        return;
      }
      if(this.saveoption.find(v => v.name == this.conditionName.trim())) {
        Msgwarning("已存在同名自定义列，请重新命名");
        return;
      }
      this.$emit("save", this.conditionName, this.savetype);
      this.dialogFormVisible = false;
      this.conditionName = "";
    }
  }
};
</script>

<style>
</style>
