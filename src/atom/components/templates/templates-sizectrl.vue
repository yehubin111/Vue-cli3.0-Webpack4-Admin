<template>
  <el-dialog title="尺寸管理" :visible="status" width="50%" @close="handleClose">
    <el-form ref="form" :model="form" label-width="80px" label-position="left">
      <el-form-item label="当前尺寸">
        <el-tag
          class="size"
          v-for="tag in tempsize"
          :key="tag"
          closable
          @close="deleteSize(tag)"
        >{{tag}}</el-tag>
      </el-form-item>
      <el-form-item label="新增尺寸">
        <div>
          <el-input class="smallinput" v-model="form.sizewidth" size="mini" placeholder="宽"></el-input>
          <span class="between">x</span>
          <el-input class="smallinput" v-model="form.sizeheight" size="mini" placeholder="高"></el-input>
        </div>
        <el-button type="primary" size="mini" @click="addSize">新增</el-button>
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
        sizewidth: 0,
        sizeheight: 0
      }
    };
  },
  mounted() {},
  computed: {
    ...mapState(["tempsize"])
  },
  methods: {
    addSize() {
      if (!this.form.sizewidth || !this.form.sizeheight) {
        Msgwarning("尺寸不可为0或为空");
        return;
      }

      let size = this.form.sizewidth * 1 + "x" + this.form.sizeheight * 1;
      this.$store.dispatch("addSort", {
        key: "template_size",
        value: size
      });
      this.reset();
    },
    reset() {
      this.form.sizewidth = 0;
      this.form.sizeheight = 0;
    },
    deleteSize(tag) {
      let value = tag;
      this.$store.dispatch("deleteSizeTrade", { key: "template_size", value });
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
