<template>
  <ul class="menu">
    <li class="special">
      <router-link to="/pandect">总览</router-link>
    </li>
    <li>我的项目
      <i></i>
      <div class="list">
        <p v-for="(l,index) in itemlist" :key="index">
          <router-link :to="'/project/' + l.id" :title="l.projectName">{{l.projectName}}</router-link>
        </p>
        <p class="manage">
          <router-link to="/manage">管理项目</router-link>
        </p>
        <p @click="toAdd" style="padding-left: 20px">
          创建项目
        </p>
      </div>
    </li>
    <li>Facebook同步
      <i></i>
      <div class="list">
        <p>
          <router-link to="/bm">BM同步</router-link>
        </p>
        <p>
          <router-link to="/app">APP同步</router-link>
        </p>
      </div>
    </li>
    <li v-if="ifSuperAdmin">规则中心
      <i></i>
      <div class="list">
        <p>
          <router-link to="/regular">规则列表</router-link>
        </p>
        <p>
          <router-link to="/reguform">规则报表</router-link>
        </p>
      </div>
    </li>
    <li>工具箱
      <i></i>
      <div class="list">
        <p style="padding-left: 20px" @click="videoTranslate">
          视频转换
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1"
    };
  },
  mounted() {
    this.$store.dispatch("getItemList");
  },
  computed: {
    ...mapState(["itemlist"]),
    ifSuperAdmin() {
      return localStorage.getItem("atom_roleId") &&
        localStorage.getItem("atom_roleId") == "1"
        ? true
        : false;
    }
  },
  methods: {
    videoTranslate() {
      this.$emit('showVideoBox');
    },
    toAdd() {
      this.$emit("showAddBox");
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="less" scoped>
.menu {
  float: left;
  margin-right: 20px;
  li {
    line-height: 60px;
    float: left;
    color: #fff;
    font-size: 14px;
    padding: 0 30px;
    cursor: pointer;
    position: relative;

    &.special {
      padding: 0;
      & > a {
        color: #fff;
        display: block;
        padding: 0 30px;
      }
    }
    i {
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top-color: #fff;
      position: absolute;
      right: 14px;
      top: 29px;
    }
    .list {
      position: absolute;
      width: 160px;
      top: 55px;
      border-radius: 5px;
      overflow: hidden;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      display: none;
      z-index: 999;
      p {
        line-height: 30px;
        background-color: #fff;
        color: #333;
        cursor: pointer;
        display: block;
        &.manage {
          border-top: 1px solid #ebeef5;
        }
        &:hover {
          background-color: #deedfd;
          color: #3297ff;
        }
        a {
          color: #333;
          display: block;
          padding: 0 20px 0 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:hover {
            background-color: #deedfd;
            color: #3297ff;
          }
        }
      }
    }
    &:hover {
      .list {
        display: block;
      }
    }
  }
}
</style>