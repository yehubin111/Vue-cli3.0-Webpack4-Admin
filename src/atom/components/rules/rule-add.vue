<template>
  <el-dialog title="创建规则" :visible="status" @close="hideBox">
    <el-form v-if="type == 'campaignName'" label-position="left">
      <el-form-item label="广告账户" label-width="170px">
        <el-select
          class="select"
          v-model="account"
          filterable
          placeholder="请选择广告账户，可搜索"
          @change="toSort"
        >
          <el-option :label="111" :value="222"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则应用对象" label-width="170px">
        <el-select
          class="select"
          v-model="ruleobject"
          filterable
          placeholder="选择对象"
          @change="toSort"
        >
          <el-option :label="111" :value="222"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      status: true,
      account: "",
      ruleobject: ""
    };
  },
  methods: {
    hideBox() {},
    toSort() {}
  }
};
</script>

<style>
</style>
