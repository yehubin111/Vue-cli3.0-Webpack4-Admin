<template>
  <div class="contain">
    <p class="title">上传模板</p>
    <div class="ctrl">
      <el-button class="add" type="primary" @click="addTemplates">新增应用</el-button>
    </div>
    <templates-list></templates-list>
  </div>
</template>

<script>
import TemplatesList from './templates-list';
export default {
    components: {
        TemplatesList
    },
    data() {
        return {

        }
    },
    methods: {
      addTemplates() {
        this.$router.push({
          name: 'addtemplates'
        })
      }
    }
};
</script>

<style lang="less" scoped>
.contain {
  width: 1200px;
  margin: 0 auto 50px auto;
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
  }
  .ctrl {
    overflow: hidden;
    margin-bottom: 10px;
    .add {
      float: left;
    }
  }
}
</style>
