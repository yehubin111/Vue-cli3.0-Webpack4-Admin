<template>
  <div class="msglist">
    <el-collapse v-model="activeNames" accordion @change="handleChange">
      <el-collapse-item title :name="l.id" v-for="(l, index) in list" :key="index">
        <template slot="title">
          <p class="dot">
            <span v-show="l.status == 0"></span>
          </p>
          <p :class="{msgtitle: true, read: l.status != 0}" v-html="l.title"></p>
          <p
            :class="{time: true, read: l.status != 0}"
          >{{l.createTime | timeFormat('yyyy-MM-dd HH:mm')}}</p>
        </template>
        <div class="msgdesc" v-if="l.busiType == 'asyncTask'" v-html="l.message" @click="taskDetail(l.extraInfo, l.message)"></div>
        <div class="msgdesc" v-else v-html="l.message"></div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      activeNames: ""
    };
  },
  computed: {
    ...mapState(["messagelist", "msgpagesize", "msgpageindex"]),
    list() {
      let begin = (this.msgpageindex - 1) * this.msgpagesize;
      let end = begin + this.msgpagesize;

      return this.messagelist.slice(begin, end);
    }
  },
  mounted() {
    
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    handleChange(id) {
      if (!id) return;
      let obj = this.list.find(v => v.id == id);

      if (obj.status == 0) {
        let ids = obj.id;
        this.$store.dispatch("updateMessage", { ids });
      }
    },
    taskDetail(requestId, message) {
      // alert(1);
      this.SETSTATE({ k: "jobfailkey", v: requestId });
      this.SETSTATE({ k: "jobfaildetail", v: true });

      let taskDetailindex = message.indexOf("taskDetail");
      if (taskDetailindex == -1) return;

      let str = message.substr(taskDetailindex + 11);
      let khindex = str.lastIndexOf(")");
      let str2arr = str.substring(0, khindex - 1).split(",");

      console.log(str2arr);

      this.SETSTATE({ k: "taskfaildetail", v: str2arr[1].trim().replace(',', '') });
      this.SETSTATE({ k: "tasksuccessdetail", v: str2arr[2].trim() });
      this.SETSTATE({ k: "tasknamedetail", v: str2arr[3].trim().substr(1) });
    }
  }
};
</script>

<style lang="less">
.msgdesc a {
  color: #409eff;
}
.el-collapse-item.is-active {
  .el-collapse-item__header,
  .el-collapse-item__wrap {
    background-color: #f9f9f9;
  }
}
.el-collapse-item__header {
  padding-right: 10px;
}
</style>

<style lang="less" scoped>
.msglist {
  .dot {
    width: 28px;
    float: left;
    height: 100%;
    span {
      width: 8px;
      height: 8px;
      background-color: red;
      margin: 19px 10px 0 10px;
      border-radius: 50%;
      display: block;
    }
  }
  .msgtitle {
    float: left;
    max-width: 700px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &.read {
      color: #999;
    }
    a {
      color: #409eff;
    }
  }
  .time {
    float: right;
    margin-right: 30px;
    &.read {
      color: #999;
    }
  }
  .msgdesc {
    color: #666;
    margin-left: 28px;
    a {
      color: #409eff;
    }
  }
}
</style>
