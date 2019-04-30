<template>
    <div class="breadtitle">
      <span :class="{'el-icon-s-unfold': !menushow,'el-icon-s-fold': menushow, 'icon': true}" @click="showMenu"></span>
      <el-breadcrumb class="bread" separator=">">
        <el-breadcrumb-item>项目{{projectname}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageName}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    props: {
        pageName: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapState(['menushow', 'itemlist']),
        projectname() {
            if (this.itemlist.length == 0) return;
            return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
        }
    },
    methods: {
        ...mapMutations(['SETSTATE']),
        showMenu() {
            this.SETSTATE({k: 'menushow', v: !this.menushow});
        }
    }
}
</script>

<style lang="less" scoped>
.breadtitle {
  height: 60px;
  align-item: center;
  margin-bottom: 20px;
  display: flex;;
  padding-top: 10px;
  .back {
    color: #333;
  }
  .bread {
    font-size: 20px;
    line-height: 60px;
  }
  .icon {
    font-size: 26px;
    line-height: 60px;
    margin-right: 3px;
    color: #409eff;
    cursor: pointer;
  }
}

</style>
