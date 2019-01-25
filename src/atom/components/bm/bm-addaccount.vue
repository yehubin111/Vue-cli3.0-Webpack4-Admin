<template>
  <el-dialog title="新增账户" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-form :model="form" class="form" label-position="left" :label-width="formLabelWidth">
      <el-table id="addAccount" height="500" ref="multipleTable" :data="disaddaccount" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="account_id" label="账户ID" width="200">
        </el-table-column>
        <el-table-column prop="name" label="账户名称">
        </el-table-column>
        <el-table-column prop="balance" label="账户余额($)" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.balance / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="account_status" label="状态" width="120">
          <template slot-scope="scope">
            <span :class="{good: scope.row.account_status == 1, bad: scope.row.account_status != 1}">{{ scope.row.account_status == 1? '正常':'异常' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="saveAccount" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status"],
  data() {
    return {
      list: false,
      dialogFormVisible: false,
      form: {
        oldpassword: "",
        password: "",
        passwordagain: ""
      },
      formLabelWidth: "100px",
      multipleSelection: []
    };
  },
  mounted() {},
  computed: {
    ...mapState(["disaddaccount", "disbmid"])
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;

      let bmid = this.disbmid;
      let loadDom = "addAccount";
      if (n == true) {
        this.$store.dispatch("getAddAccount", { bmid, loadDom });
      }
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    saveAccount() {
      if (this.multipleSelection.length == 0) {
        Msgwarning("请选择需要添加的账户");
        return;
      }

      let account = [];

      this.multipleSelection.forEach(v => {
        let obj = {};
        obj.accountStatus = v.account_status;
        obj.balance = v.balance;
        obj.bmId = this.disbmid;
        obj.fbAccountId = v.account_id;
        obj.fbId = v.id;
        obj.name = v.name;
        obj.status = 1;

        account.push(obj);
      });

      let k = "accountkwd";
      let v = "";
      this.SETSTATE({ k, v });
      this.$emit("dataChange", "state4", "");

      this.$store.dispatch("saveAccount", { account });

      this.dialogFormVisible = false;
    },
    toCancel() {
      this.$emit("cancelAddbm", "status2");
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    }
  }
};
</script>

<style lang="less" scoped>
.headpic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: block;
}
.good {
  color: #67c23a;
}
.bad {
  color: #f56c6c;
}
</style>
