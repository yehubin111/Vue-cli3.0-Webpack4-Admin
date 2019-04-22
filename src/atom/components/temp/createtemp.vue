<template>
  <div>
    <p class="step">
      <el-steps :active="step" finish-status="success" align-center style="margin-top: 20px">
        <el-step title="选择模板"></el-step>
        <el-step title="上传物料"></el-step>
      </el-steps>
    </p>
    <select-temp v-if="$route.params.tempid === undefined" @selectTemp="selectTemp"></select-temp>
    <export-image v-else @goBack="goBack"></export-image>
  </div>
</template>

<script>
import SelectTemp from "./createtemp-step1";
import ExportImage from "./createtemp-step2";
export default {
  components: {
    SelectTemp,
    ExportImage
  },
  data() {
    return {
      step: this.$route.params.tempid ? 1 : 0
    };
  },
  mounted() {},
  methods: {
    selectTemp(id) {
      this.step = 1;
      this.$router.push({
        name: "createtemp",
        params: {
          tempid: id
        }
      });
    },
    goBack() {
      this.step = 0;
      this.$router.push({
        name: "createtemp"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.step {
  width: 500px;
  margin: 0 auto 50px auto;
}
</style>
