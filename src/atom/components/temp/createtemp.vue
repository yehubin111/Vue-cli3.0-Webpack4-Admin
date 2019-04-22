<template>
  <div>
    <p class="step">
      <el-steps :active="step" finish-status="success" align-center style="margin-top: 20px">
        <el-step title="选择模板"></el-step>
        <el-step title="上传物料"></el-step>
      </el-steps>
    </p>
    <select-temp v-if="step == 0"></select-temp>
    <export-image v-else></export-image>
  </div>
</template>

<script>
import SelectTemp from "./createtemp-step1";
import ExportImage from './createtemp-step2';
export default {
  components: {
    SelectTemp,
    ExportImage
  },
  data() {
    return {
      step: 0
    };
  },
  mounted() {
    
  },
  methods: {
    
  }
};
</script>

<style lang="less" scoped>
.step {
  width: 500px;
  margin: 0 auto 50px auto;
}

</style>
