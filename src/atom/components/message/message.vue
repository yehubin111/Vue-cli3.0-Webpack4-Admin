<template>

  <div class="msgpage">
    <div class="ctrl">
      <p class="title">消息中心</p>
      <el-button class="add" type="primary" @click="setRead">全部已读</el-button>
    </div>
    <message-list></message-list>
    <div class="pageswitch">
      <el-pagination background @size-change="pageSizeChange" :page-sizes="[20, 200, 500]" layout="total, sizes, prev, pager, next, jumper" :current-page="pageIndex" :total="messagetotal" :page-size="pageSize" @current-change="pageSwitch">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import MessageList from "./message-list.vue";
import { mapState, mapMutations } from "vuex";
let msglist;
export default {
  components: {
    MessageList
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(msglist);
    next();
  },
  data() {
    return {
      pageSize: 20,
      pageIndex: 1
    };
  },
  computed: {
    ...mapState(["messagetotal"])
  },
  mounted() {
    this.$store.dispatch("getMessageList");

    msglist = setInterval(() => {
      this.$store.dispatch("getMessageList");
    }, 3000);
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    setRead() {
      this.SETSTATE({k: 'messagecount', v: 0})
      this.$store.dispatch("setAllRead");
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.pageIndex = 1;

      let k = "msgpagesize";
      let v = size;
      this.SETSTATE({ k, v });
      k = "msgpageindex";
      v = 1;
      this.SETSTATE({ k, v });
    },
    pageSwitch(page) {
      this.pageIndex = page;

      let k = "msgpageindex";
      let v = page;
      this.SETSTATE({ k, v });
    }
  }
};
</script>

<style lang="less" scoped>
.msgpage {
  width: 1200px;
  margin: 0 auto 50px auto;
  .ctrl {
    margin-top: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    .title {
      line-height: 60px;
      font-size: 20px;
      margin-bottom: 20px;
      float: left;
    }
    .add {
      margin-top: 10px;
      float: right;
    }
  }
}
.pageswitch {
  text-align: center;
  margin-top: 20px;
}
</style>
