<template>
  <el-dialog title="分配账户" :visible="allotStatus" class="dialog" @close="toCancel">
    <div class="content">
      <div class="member">
        <p class="title">参与成员</p>
        <el-input v-model="member" placeholder="搜索姓名/邮箱" prefix-icon="el-icon-search"></el-input>
        <div class="list">
          <p
            class="line"
            v-for="mb in memberslist"
            :key="mb.id"
            @click="selectMember(mb.nickName, mb.id)"
          >
            <span class="head">{{mb.nickName.substr(0,1)}}</span>
            <span class="name">{{mb.nickName}}</span>
          </p>
        </div>
      </div>
      <div class="account">
        <p class="title">{{presentname}}的广告账户</p>
        <el-input v-model="account" placeholder="搜索广告账户ID/名称" prefix-icon="el-icon-search"></el-input>
        <div class="list">
          <div class="line" v-for="account in accountslist" :key="account.fbId">
            <div class="accountname">
              <p :class="{name: true, on: account.select}">{{account.name}}</p>
              <p class="id">{{account.fbId.replace('act_', '')}}</p>
            </div>
            <el-checkbox v-model="account.select" @change="selectAccount"></el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="createeditid || !allotid" @click="toPrev">上一步</el-button>
      <el-button v-else @click="toCancel">取消</el-button>
      <el-button type="primary" @click="toSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { Msgsuccess, Msgerror } from "../../js/message";
export default {
  props: {
    status: {
      type: Boolean,
      required: true
    },
    allotStatus: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      member: "",
      account: "",
      presentname: "",
      presentid: "",
      memberaccount: {},
      prev: false
    };
  },
  watch: {
    members(n, v) {
      if (n.length > 0) {
        // 编辑账户分配逻辑
        if (this.projectallot.length > 0) {
          this.projectallot.forEach(g => {
            this.memberaccount[g.userId] = [];
            this.memberaccount[g.userId] = this.memberaccount[g.userId].concat(
              g.fbAccountIds.split(",").map(v => {
                return { fbId: `act_${v}`, select: true };
              })
            );
          });
        }
        this.selectMember(n[0].nickName, n[0].id);
      }
    }
  },
  computed: {
    ...mapState(["createreset", "projectallot", "createeditid", "allotid"]),
    ...mapGetters(["members", "accounts"]),
    memberslist() {
      return this.members.filter(
        v =>
          v.nickName.indexOf(this.member) != -1 ||
          v.loginName.indexOf(this.member) != -1
      );
    },
    accountslist() {
      return this.accounts.filter(
        v =>
          v.name.indexOf(this.account) != -1 ||
          v.fbId.indexOf(this.account) != -1
      );
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(["SETSTATE", "SETOBJSTATE"]),
    selectMember(name, id) {
      this.presentname = name;
      this.presentid = id;
      // 切换成员的时候重置广告账户状态
      let disaccount = this.memberaccount[id]
        ? this.memberaccount[id].map(v => v.fbId)
        : [];
      this.accounts.forEach(v => {
        v.select = disaccount.includes(v.fbId) ? true : false;
      });
    },
    selectAccount() {
      this.memberaccount[this.presentid] = [];
      this.memberaccount[this.presentid] = this.memberaccount[
        this.presentid
      ].concat(this.accounts.filter(v => v.select));
    },
    toPrev() {
      this.$emit("update:allotStatus", false);
      this.$emit("update:status", true);
      this.prev = true;
    },
    toCancel() {
      this.$emit("update:allotStatus", false);
      if (!this.prev) {
        this.stateReset();
      }
      this.prev = false;
      this.member = "";
      this.account = "";
      this.SETSTATE({ k: "projectallot", v: [] });
    },
    stateReset() {
      this.memberaccount = {};
      this.SETSTATE({ k: "createeditid", v: "" });
      this.SETSTATE({ k: "allotid", v: "" });
      // 重置state数据
      for (let i in this.createreset) {
        this.SETOBJSTATE({
          obj: "createoption",
          name: i,
          v: this.createreset[i]
        });
      }
    },
    async toSubmit() {
      let res;
      let ctrlname = "创建";
      if (this.createeditid) {
        res = await this.$store.dispatch("editProject", {
          memberaccount: this.memberaccount
        });
        ctrlname = "编辑";
      } else if (this.allotid) {
        // 单纯去分配账户
        res = await this.$store.dispatch("setAllot", {
          memberaccount: this.memberaccount
        });
        ctrlname = "分配";
      } else {
        res = await this.$store.dispatch("addProject", {
          memberaccount: this.memberaccount
        });
      }
      if (res.data) {
        Msgsuccess(`项目${ctrlname}成功`);
        this.$emit("resetList");
        this.toCancel();
      } else {
        Msgerror(`项目${ctrlname}失败`);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  display: flex;
  .member,
  .account {
    flex: 2;
    .title {
      line-height: 50px;
    }
    .list {
      height: 300px;
      overflow-y: auto;
      .line {
        line-height: 60px;
        display: flex;
        align-items: center;
        cursor: pointer;
        padding-left: 10px;
        .head {
          width: 30px;
          height: 30px;
          // border: 1px solid #ddd;
          // flex-basis: 32px;
          margin-right: 10px;
          border-radius: 50%;
          // display: flex;
          // align-items: center;
          overflow: hidden;
          text-align: center;
          line-height: 30px;
          font-size: 14px;
          color: #fff;
          background-color: #409eff;

          // img {
          //   width: 100%;
          // }
        }
        .name {
        }
        &:hover {
          background-color: #f4f4f4;
        }
      }
    }
  }
  .account {
    flex: 3;
    .list {
      border-left: 1px solid #ddd;
      .line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        padding-right: 10px;
        .accountname {
          .name {
            line-height: 20px;
            &.on {
              color: #409eff;
            }
          }
          .id {
            line-height: 20px;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
}
</style>
