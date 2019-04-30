<template>
  <div class="contain">
    <el-breadcrumb class="title" separator=">">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="bindlist">
      <div class="line">
        <p class="pic">
          <img
            src="http://atom.unitymob.com/file/image/2019/04/29/1143712a-40b5-459a-b3f0-fbbef36e2e2f.png"
            alt
          >
        </p>
        <span class="name">AppsFlyer</span>
        <span class="tip" v-if="afstate">已绑定，若密钥重置请重新绑定</span>
        <span class="tip" v-else>获取各应用各投放平台的监测数据，以分析优化广告</span>
        <el-button type="primary" size="small" @click="setDetection">{{afstate?'重新绑定':'绑定'}}</el-button>
      </div>
    </div>
    <setting-detection :status.sync="status"></setting-detection>
  </div>
</template>

<script>
import SettingDetection from "./setting-detection";
import { mapState } from "vuex";
export default {
  components: {
    SettingDetection
  },
  data() {
    return {
      status: false
    };
  },
  mounted() {
    // 初始化获取af绑定状态
    this.$store.dispatch("getAfState");
  },
  computed: {
    ...mapState(["afstate"])
  },
  methods: {
    setDetection() {
      this.status = true;
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
  .bindlist {
    .line {
      display: flex;
      align-items: center;
      font-size: 14px;
      .pic {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 1px solid #ddd;
        overflow: hidden;
        margin-right: 20px;
        img {
          width: 100%;
        }
      }
      .name {
        margin-right: 20px;
      }
      .tip {
        color: #999;
        margin-right: 20px;
      }
    }
  }
}
</style>
