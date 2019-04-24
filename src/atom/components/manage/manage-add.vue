<template>
  <el-dialog :title="id?'编辑项目':'创建项目'" :visible="status" class="dialog" @close="toCancel">
    <el-form :model="form" class="form" label-position="left" :label-width="formLabelWidth">
      <el-form-item label="项目名称">
        <el-input class="input" v-model="form.projectname" auto-complete="off" placeholder="输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="投放平台">
        <el-radio-group v-model="form.radio1">
          <el-radio label="Facebook ADS"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="项目目标">
        <el-radio-group v-model="form.radio2">
          <el-radio label="安装应用"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="应用">
        <el-select
          class="addselect"
          v-model="form.region"
          multiple
          collapse-tags
          placeholder="请选择此项目的应用，多选"
        >
          <el-option
            v-for="(l, index) in manageapplist"
            :key="index"
            :label="l.name"
            :value="l.applicationId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主页">
        <el-select
          class="addselect"
          v-model="form.page"
          multiple
          collapse-tags
          placeholder="请选择此项目的主页，多选"
        >
          <el-option v-for="(l, index) in adpages" :key="index" :label="l.name" :value="l.pageId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参与成员">
        <el-select
          class="addselect"
          v-model="form.member"
          multiple
          collapse-tags
          placeholder="请选择此项目的成员，多选"
        >
          <el-option v-for="(l, index) in userslist" :key="index" :label="l.nickName" :value="l.name + '|' + l.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告账户">
        <el-select
          class="addselect"
          v-model="form.account"
          multiple
          collapse-tags
          placeholder="请选择此项目的广告账户，多选"
        >
          <el-option
            v-for="(l, index) in adaccountslist"
            :key="index"
            :label="l.name + '('+l.fbAccountId+')'"
            :value="l.name + '|' + l.fbId"
            :disabled="l.accountStatus == 0"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button @click="toAdd" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status", "id", "allotStatus"],
  data() {
    return {
      form: {
        projectname: "",
        radio1: "Facebook ADS",
        radio2: "安装应用",
        region: [],
        page: [],
        member: [],
        account: []
      },
      formLabelWidth: "100px"
    };
  },
  mounted() {},
  computed: {
    ...mapState(["manageapplist", "userslist", "adaccountslist", "adpages"]),
    ...mapGetters(["dismanage"])
  },
  watch: {
    status(n, v) {
      if (n) {
        // 获取参与成员列表
        this.$store.dispatch("getUsersList");
        // 获取广告账户列表
        this.$store.dispatch("getAdAccount");
        // 获取主页列表
        this.$store.dispatch("getAdPages");
        // 获取应用列表
        this.$store.dispatch("manageApplist");
      }
    },
    id(n, v) {
      if (n != "") {
        let proj = this.dismanage.find(v => v.id == n);

        this.form.projectname = proj.projectName;
        this.form.region = proj.applicationId;
      }
    }
  },
  methods: {
    ...mapMutations(["SETOBJSTATE"]),
    dataCheck() {
      if (this.form.projectname == "") return [false, "请输入项目名称"];
      if (
        /\s/g.test(this.form.projectname) ||
        this.form.projectname.replace(/[\u0391-\uFFE5]/g, "aa").length > 50
      )
        return [false, "项目名称不能有空格，且长度不能大于50个字符"];
      if (this.form.region.length == 0) return [false, "请选择应用"];
      if (this.form.page.length == 0) return [false, "请选择主页"];
      if (this.form.member.length == 0) return [false, "请选择参与成员"];

      return [true];
    },
    toAdd() {
      let check = this.dataCheck();
      if (!check[0]) {
        Msgwarning(check[1]);
        return;
      }

      // 跳转下一步之前，保存数据
      for (let i in this.form) {
        switch(i) {
          case 'member':
          break;
          case 'account':
          break;
          default:
          break;
        }
          this.SETOBJSTATE({ obj: "createoption", name: i, v: this.form[i] });
      }

      // 点击下一步打开分配界面
      this.$emit("update:allotStatus", true);
      this.toCancel();
    },
    toCancel() {
      this.$emit("update:status", false);

      this.form.projectname = "";
      this.form.region = [];
      this.form.page = [];
      this.form.member = [];
      this.form.account = [];
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
