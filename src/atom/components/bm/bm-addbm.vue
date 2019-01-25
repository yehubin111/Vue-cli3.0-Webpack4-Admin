<template>
  <el-dialog title="新增BM" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-form :model="form" class="form" label-position="left" :label-width="formLabelWidth">
      <el-table id="addBM" height="500" ref="multipleTable" :data="addbmlist" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="id" label="BMID" width="140">
        </el-table-column>
        <el-table-column prop="name" label="BM名称" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="saveBm" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
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
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;

      let loadDom = "addBM";
      if (n == true) {
        this.$store.dispatch("getAddBmlist", { loadDom });
      }
    }
  },
  computed: {
    ...mapState(["addbmlist"])
  },
  mounted() {
    // this.$store.dispatch("getAddBmlist");
  },
  methods: {
    saveBm() {
      if (this.multipleSelection.length == 0) {
        Msgwarning("请选择需要添加BM账户");
        return;
      }

      let bm = [];

      this.multipleSelection.forEach(v => {
        let obj = {};
        obj.bmId = v.id;
        obj.bmName = v.name;

        bm.push(obj);
      });

      this.$store.dispatch("saveBm", { bm });

      this.dialogFormVisible = false;
    },
    toCancel() {
      this.$emit("cancelAddbm", "status1");
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

<style>
</style>
