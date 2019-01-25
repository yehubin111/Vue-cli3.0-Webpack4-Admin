<template>
  <el-dialog title="修改创意标题" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-form ref="form" label-width="120px" class="cform">
      <el-form-item label="创意标题" class="cline">
        <el-input class="accountinput" v-model="name" placeholder="请输入创意标题"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="toSave" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status", "oldid", "oldname"],
  components: {},
  data() {
    return {
      state: "",
      activeIndex: "1",
      dialogFormVisible: false,
      title: "",
      name: "",
      value: "",
      value2: ""
    };
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;
      if (n == true) this.name = this.oldname;
    }
    // oldname(n, v) {
    //   this.name = n;
    // }
  },
  computed: {},
  methods: {
    toSave() {
      if (this.name.trim() == "") {
        Msgwarning("请输入创意标题");
        return;
      }

      let id = this.oldid;
      let creativityName = this.name;
      this.$store.dispatch("updateSex", { id, creativityName });

      this.dialogFormVisible = false;
    },
    toCancel() {
      this.$emit("cancelAddbm", "status6");
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-demo {
  margin-bottom: 20px;
}
.loginfo {
  left: 20px;
  margin-bottom: 30px;
  margin-left: 23px;
}
.accountinput {
  width: 300px;
}
.tip {
  font-size: 14px;
  margin-right: 20px;
}
</style>
