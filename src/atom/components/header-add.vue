<template>
  <el-dialog title="创建项目" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-form :model="form" class="form" label-position="left" :label-width="formLabelWidth">
      <el-form-item label="项目名称">
        <el-input class="input" v-model="form.projectname" auto-complete="off" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="投放平台">
        <el-radio-group v-model="form.radio1">
          <el-radio label="Facebook"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="项目目标">
        <el-radio-group v-model="form.radio2">
          <el-radio label="安装应用"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择应用">
        <el-select class="addselect" v-model="form.region" placeholder="请选择应用">
          <el-option v-for="(l, index) in manageapplist" :key="index" :label="l.name" :value="l.applicationId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="toAdd" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { Msgwarning } from "../js/message";
export default {
  props: ["status"],
  data() {
    return {
      dialogFormVisible: false,
      form: {
        projectname: "",
        radio1: "Facebook",
        radio2: "安装应用",
        region: ""
      },
      formLabelWidth: "100px"
    };
  },
  mounted() {},
  computed: {
    ...mapState(["manageapplist"]),
    ...mapGetters(["dismanage"])
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;
      if (n) {
        this.$store.dispatch("manageApplist");
      }
    }
    // id(n, v) {
    //   if (n != "") {
    //     let proj = this.dismanage.find(v => v.id == n);

    //     this.form.projectname = proj.projectName;
    //     this.form.region = proj.applicationId;
    //   }
    // }
  },
  methods: {
    toAdd() {
      if (this.form.projectname == "") {
        Msgwarning("请输入项目名称");
        return;
      }
      if (this.form.region == "") {
        Msgwarning("请选择应用");
        return;
      }

      let pname = this.form.projectname;
      let appid = this.form.region;
      let pplat = 0;
      let ptag = 0;
      let route = this.$router;
      //   let id = this.id;

      //   if (!this.id)
      this.$store.dispatch("headerAddProject", {
        appid,
        pname,
        pplat,
        ptag,
        route
      });
      //   else
      //     this.$store.dispatch("editProject", { appid, pname, pplat, ptag, id });

      this.dialogFormVisible = false;
      this.form.projectname = "";
      this.form.region = "";
    },
    toCancel() {
      this.$emit("cancelAddbm", "status");
      this.form.projectname = "";
      this.form.region = "";
    }
  }
};
</script>

<style lang="less" scoped>
.dialog {
  width: 1200px;
  margin: auto;
  overflow-y: hidden;
  .form {
    margin-top: -20px;
    margin-left: 20px;
    .input {
      width: 400px;
    }
  }
  .dialog-footer {
    margin-top: -20px;
  }
}
.addselect {
  width: 400px;
}
</style>
