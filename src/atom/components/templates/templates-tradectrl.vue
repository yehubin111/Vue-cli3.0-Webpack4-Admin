<template>
  <el-dialog title="行业管理" :visible="status" width="50%" @close="handleClose">
    <el-form ref="form" :model="form" label-width="80px" label-position="left">
      <el-form-item label="当前行业">
        <el-tag
          class="size"
          v-for="tag in temptrade"
          :key="tag"
          closable
          @close="deleteTrade(tag)"
        >{{tag}}</el-tag>
      </el-form-item>
      <el-form-item label="新增行业">
        <div>
          <el-input class="smallinput" v-model="form.trade" size="mini" placeholder="行业"></el-input>
        </div>
        <el-button type="primary" size="mini" @click="addTrade">新增</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["status"],
  data() {
    return {
      form: {
        trade: ""
      }
    };
  },
  mounted() {},
  computed: {
    ...mapState(["temptrade"])
  },
  methods: {
    addTrade() {
      if (!this.form.trade) {
        Msgwarning("行业不能为空");
        return;
      }

      let business = this.form.trade;
      this.$store.dispatch("addSort", {
        key: "template_business",
        value: business
      });
      this.reset();
    },
    reset() {
      this.form.trade = "";
    },
    deleteTrade(tag) {
      let value = tag;
      this.$store.dispatch("deleteSizeTrade", {
        key: "template_business",
        value
      });
    },
    handleClose() {
      this.$emit("update:status", false);
      this.reset();
    }
  }
};
</script>

<style lang="less" scoped>
.smallinput {
  display: inline-block;
  width: 80px;
}
.between {
  width: 10px;
  text-align: center;
  margin: 0 5px;
  display: inline-block;
  font-size: 12px;
}
.size {
  margin-right: 10px;
}
</style>
