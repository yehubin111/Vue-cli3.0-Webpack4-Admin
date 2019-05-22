<template>
  <div class="contain">
    <ul class="grid">
      <li v-for="(item, index) in dismanage" :key="item.id" @click="openProject(item.id)">
        <p class="title">一周花费</p>
        <el-dropdown placement="bottom-start" @command="manageCtrl">
          <el-button class="ctrl" icon="el-icon-more" type="text" @click.stop="showMenu" v-show="myid == item.createrId"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="`a|${item.id}`">编辑</el-dropdown-item>
            <el-dropdown-item :command="`b|${item.id}`">分配账户</el-dropdown-item>
            <el-dropdown-item :command="`c|${item.id}`" divided>归档</el-dropdown-item>
            <el-dropdown-item :command="`d|${item.id}`" style="color: red;">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="chart" :id="`Chart${index}`"></div>
        <div class="info">
          <span class="name" :title="item.projectName">{{item.projectName}}</span>
          <div class="member">
            <div>
              <p v-for="head in item.participaterNames" class="head" :key="head">
                <el-tooltip class="item" effect="dark" :content="head" placement="bottom">
                  <span class="headname">{{head.substr(0,1)}}</span>
                </el-tooltip>
              </p>
            </div>
            <span class="more" v-show="item.participaterNames && item.participaterNames.length > 5">···</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import echarts from "@echarts/js/charts.require.js";
import chart from "@/atom/js/charts";
import { mapGetters, mapMutations } from "vuex";
export default {
  props: ["allotStatus"],
  components: {},
  data() {
    return {
      mychart: {},
      myid: localStorage.getItem("atom_id")
    };
  },
  computed: {
    ...mapGetters(["dismanage"])
  },
  watch: {
    async dismanage(n, v) {
      if (n.length > 0) {
        await this.$barrageTime(500);
        n.forEach((v, i) => {
          if (v.last7DaySpends && v.last7DaySpends.length > 0) {
            let charts = echarts.init(document.getElementById(`Chart${i}`));
            let data = [
              {
                name: "花费",
                type: "bar",
                data: v.last7DaySpends.map(v => parseFloat(v.spend).toFixed(2))
              }
            ];
            let x = v.last7DaySpends.map(v =>
              this.$timeFormat(v.insightDate, "yyyy-MM-dd")
            );
            charts.setOption(chart.manageWeekSpend(x, data));
          }
        });
      }
    }
  },
  created() {
    let v = "";
    let k = "projectkwd";

    this.SETSTATE({ k, v });
  },
  mounted() {},
  methods: {
    ...mapMutations(["SETSTATE", "SETOBJSTATE"]),
    showMenu() {
    },
    openProject(id) {
      this.$router.push({
        name: "project",
        params: {
          id
        }
      });
    },
    async setAllotData(projectId) {
      this.SETSTATE({k: 'allotid', v: projectId});
      // 获取广告账户列表
      let res = await this.$store.dispatch("getAdAccount");
      // 获取成员列表
      let memberres = await this.$store.dispatch("getUsersList");
      // 获取分配信息
      await this.$store.dispatch("getAllot", { projectId });
      let project = this.dismanage.find(v => v.id == projectId);
      let projectaccount = project.fbAccountIds.split(",");
      let projectmember = project.participaterIds.split(",");
      let account = res.data.filter(v =>
        projectaccount.includes(v.fbAccountId)
      );
      let member = memberres.data.filter(v =>
        projectmember.includes(v.id.toString())
      );
      let arr = [];
      account.forEach(v => {
        let obj = {
          name: v.name,
          fbId: v.fbId,
          select: false
        };
        arr.push(obj);
      });
      this.SETOBJSTATE({ obj: "createoption", name: "account", v: arr });
      let arr2 = [];
      member.forEach(v => {
        let obj = {
          nickName: v.nickName,
          loginName: v.loginName,
          id: v.id
        };
        arr2.push(obj);
      });
      this.SETOBJSTATE({ obj: "createoption", name: "member", v: arr2 });
    },
    async manageCtrl(command) {
      let cmd = command.split("|");
      let key = cmd[0];
      let id = cmd[1];
      switch (key) {
        case "a":
          this.$emit("editProject", id);
          break;
        case "b":
          // 设置分配广告账户所需数据
          this.setAllotData(id);
          this.$emit("update:allotStatus", true);
          break;
        case "c":
          this.$emit("overProject", id);
          break;
        case "d":
          this.$emit("deleteProject", id);
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style>
.delete {
  color: red;
}
</style>

<style lang="less" scoped>
.grid {
  display: grid;
  width: 100%;
  // grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-columns: repeat(4, minmax(285px, 1fr));
  grid-gap: 20px;
  margin-bottom: 60px;
  li {
    border: 1px solid #ddd;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 235px;
    cursor: pointer;
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
        flex-basis: 130px;
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
        justify-content: flex-end;
        overflow: hidden;
        padding-right: 10px;
        &>div {
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
            border: 1px solid #fff;
            margin-left: -10px;
            background-color: #409eff;
            overflow: hidden;
            font-size: 14px;
            // font-weight: bold;
            color: #fff;
            text-align: center;
            line-height: 30px;
            .headname{
              display: block;
            }
            // img {
            //   width: 100%;
            // }
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
