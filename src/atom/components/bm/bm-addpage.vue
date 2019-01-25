<template>
  <el-dialog title="新增主页" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <el-form :model="form" class="form" label-position="left" :label-width="formLabelWidth">
      <el-table id="addPage" ref="multipleTable" height="500" :data="disaddpage" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <!--<el-table-column type="index" width="55" index="无" v-if="permittedRoles.length == 1 && permittedRoles.indexOf('INSIGHTS_ANALYST') != -1">
           <template slot-scope="scope">
            <el-tooltip v-if="scope.row.permittedRoles.length == 1 && scope.row.permittedRoles.indexOf('INSIGHTS_ANALYST') != -1" class="item" effect="dark" content="剩余余额不足3天花费" placement="top-start">
              <el-checkbox v-model="form.check" disabled></el-checkbox>
            </el-tooltip>
            <el-checkbox v-else v-model="form['check' +　scope.row.pageId]" @change="handleSelectionChange(scope.row.pageId)"></el-checkbox>
          </template>
        </el-table-column> -->
        <el-table-column type="selection" :selectable="ifChecked" width="55">
        </el-table-column>
        <el-table-column prop="pageId" label="主页ID" width="200">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.permittedRoles.length == 1 && scope.row.permittedRoles.indexOf('INSIGHTS_ANALYST') != -1" class="item" effect="dark" content="无创建广告权限，请去FB BM修改权限" placement="top-start">
              <i class="el-icon-warning"></i>
            </el-tooltip>
            <span style="margin-left: 0px">{{ scope.row.pageId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="picture" label="主页头像" width="120">
          <template slot-scope="scope">
            <span class="headpic"><img :src="scope.row.picture" alt=""></span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="主页名称" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button @click="savePage" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status"],
  data() {
    return {
      list: false,
      check: "",
      dialogFormVisible: false,
      form: {},
      formLabelWidth: "100px",
      multipleSelection: []
    };
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;

      let bmid = this.disbmid;
      let loadDom = "addPage";
      if (n == true) {
        this.$store.dispatch("getAddPage", { bmid, loadDom });
      }
    }
  },
  computed: {
    ...mapState(["disaddpage", "disbmid"])
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    ifChecked(row, index) {
      if (
        row.permittedRoles.length == 1 &&
        row.permittedRoles.indexOf("INSIGHTS_ANALYST") != -1
      )
        return false;
      else return true;
    },
    savePage() {
      if (this.multipleSelection.length == 0) {
        Msgwarning("请选择需要添加的主页");
        return;
      }

      let page = [];

      this.multipleSelection.forEach(v => {
        let obj = {};
        obj.bmId = v.bmId;
        obj.createTime = v.createTime;
        obj.id = v.id;
        obj.insId = v.insId;
        obj.insProfilePic = v.insProfilePic;
        obj.isUsername = v.isUsername;
        obj.name = v.name;
        obj.pageId = v.pageId;
        obj.picture = v.picture;
        obj.uid = v.uid;

        page.push(obj);
      });

      let k = "pagekwd";
      let v = "";
      this.SETSTATE({ k, v });
      this.$emit("dataChange", "state5", "");

      this.$store.dispatch("savePage", { page });

      this.dialogFormVisible = false;
      this.check = false;
    },
    toCancel() {
      this.$emit("cancelAddbm", "status3");
    },
    handleSelectionChange(val) {
      // let id = val;

      // let obj = this.disaddpage.find(v => v.pageId == id);
      // let aord = this.multipleSelection.find(v => v.pageId == id);
      // this.multipleSelection = this.multipleSelection.filter(
      //   v => v.pageId != id
      // );
      // if (!aord) this.multipleSelection.push(obj);
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
</style>
