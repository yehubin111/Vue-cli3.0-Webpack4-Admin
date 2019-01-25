<template>
    <el-dialog title="调整目标出价" :visible.sync="dialogFormVisible" class="dialog" @close="toCancel">
        <el-form ref="form" :model="form" label-width="80px" class="cform">
            <el-form-item label="目标出价" class="cline">
                <div class="moneyinput">
                    <span class="moneyus">$</span>
                    <el-input class="minput" v-model="form.money" placeholder="可为空"></el-input>
                </div>
                <p class="tip">为空则涉及到目标出价的规则对此推广计划无效，调整后目标出价将适用于此推广计划下所有广告</p>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button @click="toSave" type="primary">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
  props: ["status", "manageid", 'goalBid'],
  data() {
    return {
      dialogFormVisible: false,
      form: {
        money: ''
      }
    };
  },
  methods: {
    toCancel() {
      this.$emit("cancelAddbm", "status");
    },
    toSave() {
      let goalBid = this.form.money * 100;
      let planId = this.manageid;

      this.$store.dispatch("changePrice", { goalBid, planId });

      this.dialogFormVisible = false;
      this.form.money = '';
    }
  },
  watch: {
    status(n, v) {
      this.dialogFormVisible = n;

      if(n){
        this.form.money = this.goalBid;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.moneyinput {
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
  .moneyus {
    position: absolute;
    z-index: 9;
    left: 8px;
    font-size: 18px;
  }
  .minput {
    width: 300px;
  }
}
.tip {
  line-height: 20px;
  color: #666;
  width: 320px;
}
</style> 
