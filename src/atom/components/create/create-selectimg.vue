<template>
  <el-dialog title="选择图片" :visible.sync="selectimagestatus" @close="toCancel" class="imgdialog">
    <temp-list @change="selectChange"></temp-list>
    <div class="pageswitch">
      <span>已选0/{{tempimagestotal}}</span>
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageSwitch"
        :current-page="pageindex"
        :page-sizes="[20, 50, 80]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tempimagestotal"
      ></el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import TempList from "./create-imagelist";
import { mapState } from "vuex";
export default {
  components: {
    TempList
  },
  props: {
    status: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      selectimagestatus: false,
      pageindex: 1,
      pagesize: 20,
      selectall: false,
      ctrluse: false,
      selectcount: 0
    };
  },
  computed: {
    ...mapState(["tempimagestotal", "tempimages"])
  },
  watch: {
    status(n, o) {
      this.selectimagestatus = n;
      if (n) {
        this.$store.dispatch("getTempImages", {
          pageIndex: this.pageindex,
          pageSize: this.pagesize
        });
      }
    }
  },
  methods: {
    selectChange() {
      console.log(this.tempimages);
    },
    pageSizeChange() {},
    pageSwitch() {},
    toCancel() {
      this.$emit("hideSelect");
    }
  }
};
</script>

<style lang="less">
.imgdialog{
  .el-dialog{
    width: 70%;
  }
}
</style>
<style lang="less" scoped>
.pageswitch{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

