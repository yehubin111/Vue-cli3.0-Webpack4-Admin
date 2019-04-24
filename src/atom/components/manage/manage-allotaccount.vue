<template>
  <el-dialog title="分配账户" :visible="status" class="dialog" @close="toCancel">
    <div class="content">
      <div class="member">
        <p class="title">参与成员</p>
        <el-input v-model="member" placeholder="搜索姓名/邮箱" prefix-icon="el-icon-search"></el-input>
        <div class="list">
          <p class="line">
            <span class="head">
              <img
                src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
                alt
              >
            </span>
            <span class="name">周文熙</span>
          </p>
          <p class="line">
            <span class="head">
              <img
                src="http://172.31.1.45/file/image/2019/01/21/a2a167f0-4220-4d52-9abe-f2c9e1d3f7a4.jpg"
                alt
              >
            </span>
            <span class="name">周文熙</span>
          </p>
        </div>
      </div>
      <div class="account">
        <p class="title">周文熙的广告账户</p>
        <el-input v-model="account" placeholder="搜索广告账户ID/名称" prefix-icon="el-icon-search"></el-input>
        <div class="list">
          <div class="line">
            <div class="accountname">
              <p class="name">installApp Unitymob API</p>
              <p class="id">21243432534645765756</p>
            </div>
            <el-checkbox v-model="checked"></el-checkbox>
          </div>
          <div class="line">
            <div class="accountname">
              <p class="name">installApp Unitymob API</p>
              <p class="id">21243432534645765756</p>
            </div>
            <el-checkbox v-model="checked"></el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="toCancel">取 消</el-button>
      <el-button type="primary" @click="toSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["status"],
  data() {
    return {
      member: "",
      account: ""
    };
  },
  methods: {
    toCancel() {},
    toSubmit() {}
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
          border: 1px solid #ddd;
          flex-basis: 32px;
          margin-right: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          overflow: hidden;
          img {
            width: 100%;
          }
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
