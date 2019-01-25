<template>
  <el-dialog title="受众创建详情" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
    <p class="detail">
      <span>已成功创建{{successCount.length}}个，</span>
      <span v-if="editCount.length > 0">修改{{editCount.length}}个
        <el-tooltip class="item" effect="dark" content="这些广告账户中存在一样的受众，受众的名称和描述已更改" placement="top-start">
          <i class="el-icon-warning"></i>
        </el-tooltip>，</span>
      <span>失败{{failCount.length}}个</span>
      <span v-if="failCount.length > 0">，失败广告账户和原因如下：</span>
    </p>
    <div class="faildetail">
      <p v-for="(item, index) in failCount" :key="index">
        {{item.fbAccountId.split('_')[1]}} 原因：{{item.errorMsg}}
      </p>
    </div>
    <div class="loadbox">
      <p v-loading="ifloading"></p>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
let resultrun;
export default {
  props: ["status", "newaccount"],
  data() {
    return {
      dialogFormVisible: false,
      ifloading: true
    };
  },
  computed: {
    ...mapState(["targetadddetail", "ifsame"]),
    // 新增广告账户中 成功、失败、编辑的数量
    successCount() {
      return this.targetadddetail.filter(v => v.status == 1 && this.newaccount.indexOf(v.fbAccountId) != -1);
    },
    failCount() {
      return this.targetadddetail.filter(v => v.status == 2 && this.newaccount.indexOf(v.fbAccountId) != -1);
    },
    editCount() {
      return this.targetadddetail.filter(v => v.status == 3 && this.newaccount.indexOf(v.fbAccountId) != -1);
    },
    // 总数
    totalCount() {
      return (
        this.successCount.length +
        this.failCount.length +
        this.editCount.length
      );
    }
  },
  watch: {
    /**
     * 如果成功、失败、编辑的总数等于新增数，则表示结果已全部出来
     * 取消加载中动画
     */
    totalCount(n, v) {
      if (n == this.newaccount.length) {
        this.ifloading = false;
      }
    },
    status(n, v) {
      this.dialogFormVisible = n;
      if (n) {
        // 初始化获取创建/编辑结果信息，循环获取，间隔3s
        this.ifloading = true;
        this.$store.dispatch("getAddDetail");

        resultrun = setInterval(v => {
          this.$store.dispatch("getAddDetail");
        }, 3000);
      }
    },
    /**
     * 如果为相同的受众，或者编辑的时候修改其他信息，未修改广告账户的情况
     * 关闭创建/编辑结果框，仅文字提示
     */
    ifsame(n, v) {
      if (n) {
        this.dialogFormVisible = false;

        let k = "ifsame";
        let v = false;
        this.SETSTATE({ k, v });
      }
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    toCancel() {
      clearInterval(resultrun);

      let k = "resultId";
      let v = "";
      this.SETSTATE({ k, v });

      k = "targetadddetail";
      v = [];
      this.SETSTATE({ k, v });

      this.$emit("cancelAddbm", "status3");
    }
  }
};
</script>

<style lang="less" scoped>
.loadbox {
  position: relative;
  height: 50px;
  margin-top: 50px;
}
.detail {
  text-align: center;
  line-height: 30px;
}
.faildetail {
  p {
    text-align: center;
    line-height: 24px;
  }
}
</style>
