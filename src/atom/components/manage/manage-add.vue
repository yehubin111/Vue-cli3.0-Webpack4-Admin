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
          <el-option
            v-for="(l, index) in allusers"
            :key="index"
            :label="l.nickName"
            :value="l.nickName + '|' + l.id + '|' + l.loginName"
          ></el-option>
        </el-select>
        <p>项目创建者会自动添加到参与成员列表中，无需选择</p>
      </el-form-item>
      <el-form-item label="广告账户">
        <el-select
          class="addselect"
          v-model="form.account"
          multiple
          collapse-tags
          filterable
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
  props: {
    status: {
      type: Boolean,
      required: true
    },
    id: {
      type: String,
      default: ""
    },
    allotStatus: {
      type: Boolean,
      required: true
    }
  },
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
      myid: localStorage.getItem("atom_id"),
      next: false,
      formLabelWidth: "100px"
    };
  },
  mounted() {},
  computed: {
    ...mapState([
      "manageapplist",
      "userslist",
      "adaccountslist",
      "adpages",
      "createoption",
      "createreset"
    ]),
    ...mapGetters(["dismanage"]),
    allusers() {
      return this.userslist.filter(v => v.id != this.myid);
    }
  },
  watch: {
    async status(n, v) {
      if (n) {
        // 获取参与成员列表
        await this.$store.dispatch("getUsersList");
        // 获取广告账户列表
        await this.$store.dispatch("getAdAccount");
        // 获取主页列表
        this.$store.dispatch("getAdPages");
        // 获取应用列表
        this.$store.dispatch("manageApplist");
        // 编辑项目
        if (this.id) {
          // 获取账号分配情况
          this.$store.dispatch("getAllot", { projectId: this.id });
          // 设置编辑数据
          this.editDataSet();
        }
        // 如果有数据保存，则初始化设置
        else this.dataSet();
      }
    }
  },
  methods: {
    ...mapMutations(["SETOBJSTATE", "SETSTATE"]),
    editDataSet() {
      let proj = this.dismanage.find(v => v.id == this.id);

      this.form.projectname = proj.projectName;
      this.form.region = proj.applicationId.split(",");
      this.form.page = proj.fbPageIds.split(",");
      this.form.member = proj.participaterIds
        .split(",")
        .filter(v => v != this.myid)
        .map(v => {
          let mb = this.userslist.find(g => g.id == v);
          return mb.nickName + "|" + mb.id + "|" + mb.loginName;
        });
      this.form.account = proj.fbAccountIds.split(",").map(v => {
        let act = this.adaccountslist.find(g => g.fbAccountId == v);
        return act.name + "|" + act.fbId;
      });
    },
    dataSet() {
      for (let i in this.createoption) {
        let data;
        switch (i) {
          case "member":
            data = [];
            this.createoption[i].forEach(v => {
              if (v.id != this.myid)
                data.push(`${v.nickName}|${v.id}|${v.loginName}`);
            });
            break;
          case "account":
            data = [];
            this.createoption[i].forEach(v => {
              data.push(`${v.name}|${v.fbId}`);
            });
            break;
          default:
            data = this.createoption[i];
            break;
        }

        this.form[i] = data;
      }
    },
    dataCheck() {
      if (this.form.projectname == "") return [false, "请输入项目名称"];
      if (
        /\s/g.test(this.form.projectname) ||
        this.form.projectname.replace(/[\u0391-\uFFE5]/g, "aa").length > 50
      )
        return [false, "项目名称不能有空格，且长度不能大于50个字符"];
      if (this.form.region.length == 0) return [false, "请选择应用"];
      if (this.form.page.length == 0) return [false, "请选择主页"];
      // if (this.form.member.length == 0) return [false, "请选择参与成员"];

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
        let data, arr;
        switch (i) {
          case "member":
            data = [];
            // 先保存创建者自身
            let me = this.userslist.find(v => v.id == this.myid);
            let { loginName, id, nickName } = me;
            data.push({
              loginName,
              id,
              nickName
            });
            this.form[i].forEach(v => {
              let s = v.split("|");
              data.push({
                nickName: s[0],
                id: s[1],
                loginName: s[2]
              });
            });
            break;
          case "account":
            data = [];
            this.form[i].forEach(v => {
              let s = v.split("|");
              data.push({
                name: s[0],
                fbId: s[1],
                select: false
              });
            });
            break;
          default:
            data = this.form[i];
            break;
        }
        this.SETOBJSTATE({ obj: "createoption", name: i, v: data });
      }
      // 编辑的时候将id保存到state再跳到下一步
      if (this.id) this.SETSTATE({ k: "createeditid", v: this.id });

      // 点击下一步打开分配界面
      this.$emit("update:allotStatus", true);
      this.next = true;
      this.$emit("update:status", false);
    },
    dataReset() {
      this.form.projectname = "";
      this.form.region = [];
      this.form.page = [];
      this.form.member = [];
      this.form.account = [];
      this.next = false;
    },
    stateReset() {
      this.SETSTATE({ k: "createeditid", v: "" });
      for (let i in this.createreset) {
        this.SETOBJSTATE({
          obj: "createoption",
          name: i,
          v: this.createreset[i]
        });
      }
    },
    toCancel() {
      this.$emit("update:status", false);
      // 数据已经保存到state，无需editid
      this.$emit("update:id", "");
      // 重置state里面的数据
      if (!this.next) this.stateReset();
      // 重置数据
      this.dataReset();
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
