<template>
  <el-dialog :title="`2个广告系列`" :visible="status" class="deletedialog" @close="toCancel">
    <p class="fonttip important">
      <b>2个广告系列受这个规则管理：</b>
    </p>
    <p class="fonttip important" style="margin-bottom: 20px;">
      <b>降低10%总预算</b>
    </p>
    <div class="targetlist">
      <ul>
        <li>
          <p class="targetname">广告组名称</p>
          <p class="targetid">22242333442423422</p>
        </li>
      </ul>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="toCancel">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
export default {
    props: ['status'],
  data() {
    return {

    };
  },
  methods: {
    toCancel() {
        this.$emit('update:status', false);
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='less' scoped>
.fonttip {
  margin-bottom: 10px;
}
.targetlist {
  margin-bottom: 20px;
  ul {
    border: 1px solid #ebeef5;
    border-bottom: none;
    li {
      padding: 8px 15px;
      border-bottom: 1px solid #ebeef5;
      .targetname {
        line-height: 26px;
      }
      .targetid {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
