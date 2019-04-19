<template>
  <div>
    <ul class="contain">
      <li v-for="item in dismanage" :key="item.id">
        <p class="title">一周花费</p>
        <el-dropdown placement="bottom-start">
          <el-button class="ctrl" icon="el-icon-more" type="text"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>编辑</el-dropdown-item>
            <el-dropdown-item>分配账户</el-dropdown-item>
            <el-dropdown-item divided>归档</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="chart"></div>
        <div class="info">
          <span class="name" :title="item.projectName">{{item.projectName}}</span>
          <div class="member">
            <p>
              <span class="head">
                <img
                  src="http://172.31.1.45/file/image/2019/01/21/e9903413-1837-4a21-b15c-2885679dbf14.jpg"
                  alt
                >
              </span>
            </p>
            <span class="more">···</span>
          </div>
        </div>
      </li>
    </ul>
    <allot-account :status.sync="allotstatus"></allot-account>
  </div>
</template>

<script>
import AllotAccount from "./manage-allotaccount";

import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    AllotAccount
  },
  data() {
    return {
      // value2: 1
      allotstatus: false
    };
  },
  computed: {
    ...mapGetters(["dismanage"])
  },
  created() {
    let v = "";
    let k = "projectkwd";

    this.SETSTATE({ k, v });
  },
  mounted() {
    this.$store.dispatch("getManagelist", {});
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    toEdit(id) {
      this.$emit("editProject", id);
    },
    toOver(id) {
      this.$emit("overProject", id);
    }
    // switchChange(status, id) {
    //   this.$store.dispatch("accountStatus", { status, id });
    // },
    // setApp(id) {
    //   this.$store.dispatch("setApp", id);
    // }
  }
};
</script>
<style>
.delete {
  color: red;
}
</style>

<style lang="less" scoped>
.contain {
  display: grid;
  height: 1000px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  li {
    border: 1px solid #ddd;
    position: relative;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 14px;
      line-height: 40px;
      padding-left: 10px;
      flex-basis: 40px;
    }
    .chart {
      flex-grow: 1;
      overflow: hidden;
    }
    .info {
      flex-basis: 50px;
      border-top: 1px solid #ddd;
      display: flex;
      .name {
        flex-basis: 100px;
        line-height: 50px;
        font-size: 14px;
        padding-left: 10px;
        height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .member {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        p {
          width: 80%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-right: 0px;
          .head {
            width: 30px;
            height: 30px;
            overflow: hidden;
            border-radius: 50%;
            border: 1px solid #ddd;
            margin-left: -10px;
            background-color: #fff;
            overflow: hidden;
            img {
              width: 100%;
            }
          }
        }
        .more {
          font-weight: bold;
          font-size: 16px;
          color: #999;
          margin-top: 20px;
        }
      }
    }
    .el-dropdown {
      position: absolute;
      right: 10px;
      top: 0px;
    }
    // .ctrl {

    // }
  }
}
</style>
