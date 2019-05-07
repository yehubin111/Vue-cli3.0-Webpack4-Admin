<template>
  <el-dialog :visible.sync="selectimagestatus" @close="toCancel">
    <temp-list :selectall.sync="selectall" :ctrluse.sync="ctrluse"></temp-list>
    <div class="pageswitch">
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
import TempList from "../temp/temp-templist";
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
      ctrluse: false
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

<style>
</style>
