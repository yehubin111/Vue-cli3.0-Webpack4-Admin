<template>
  <el-dialog title="新增应用" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-form :model="form" class="form" label-position="left" :label-width="formLabelWidth">
      <el-table id="addApp" height="500" ref="multipleTable" :data="addapplist" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="picture" label="应用LOGO" width="120">
          <template slot-scope="scope">
            <span class="headpic"><img :src="scope.row.picture" alt=""></span>
          </template>
        </el-table-column>
        <el-table-column prop="applicationId" label="应用ID" width="160">
        </el-table-column>

        <el-table-column prop="name" label="应用名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="category" label="平台" width="120">
          <template slot-scope="scope">
            <span class="marketType" v-for="(l, index) in scope.row.applicationPlatformVO" :key="index">{{l.marketType}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="saveApp" type="primary">确 定</el-button>
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
      form: {},
      formLabelWidth: "100px",
      multipleSelection: []
    };
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;

      let loadDom = "addApp";
      if (n == true) {
        this.$store.dispatch("getAddApplist", { loadDom });
      }
    }
  },
  computed: {
    ...mapState(["addapplist", "disbmid"])
  },
  methods: {
    saveApp() {
      if (this.multipleSelection.length == 0) {
        Msgwarning("请选择需要添加的应用");
        return;
      }

      let app = [];

      this.multipleSelection.forEach(v => {
        let obj = {};
        obj.applicationId = v.applicationId;
        obj.applicationPlatformVO = v.applicationPlatformVO;
        obj.category = v.category;
        obj.id = v.id;
        obj.name = v.name;
        obj.picture = v.picture;
        obj.uid = v.uid;

        app.push(obj);
      });

      this.$store.dispatch("saveApp", { app });

      this.dialogFormVisible = false;
    },
    toCancel() {
      this.$emit("cancelAddapp", "status1");
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
  background-color: #f5f5f5;
  img {
    width: 100%;
  }
}
.marketType {
  display: block;
}
</style>
