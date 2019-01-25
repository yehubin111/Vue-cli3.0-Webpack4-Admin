<template>
  <div class="create-campaign">
    <el-form class="form" :model="form" label-width="110px" label-position="left">
      <el-form-item label="当前广告账户">
        <el-select
          class="formselect"
          v-model="form.account"
          placeholder="请选择广告账户"
          v-if="!mutilAccount"
          :disabled="editId.length > 0"
        >
          <el-option
            v-for="item in adaccountlist"
            :key="item.fbId"
            :label="item.name + (item.fbId != -1?'('+item.fbId+')':'')"
            :value="item.fbId"
          ></el-option>
        </el-select>
        <p v-if="mutilAccount">多项内容</p>
      </el-form-item>
      <el-form-item label="广告系列编号" v-if="editId.length > 0">
        <span class="adnum" id="copyCampaign">{{editId.length > 1? '多项内容': editId[0]}}</span>
        <el-button id="copyButtonCampaign" data-clipboard-action="copy" data-clipboard-target="#copyCampaign" type="primary" size="mini" v-show="editId.length == 1">复制</el-button>
      </el-form-item>
      <el-form-item label="广告系列名称">
        <p v-if="mutil.name">
          <span v-show="mutilstatus.name">多项内容，
            <el-button type="text" @click="mutilstatus.name = !mutilstatus.name">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.name">多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.name = !mutilstatus.name">撤销编辑</el-button>
          </span>
        </p>
        <el-input v-model="form.name" placeholder="请输入广告系列名称" v-show="!mutilstatus.name"></el-input>
      </el-form-item>
    </el-form>
    <h1 class="secondtitle">广告系列详情</h1>
    <div class="info">
      <p>
        <span class="theme">目标</span>
        <span>应用安装量</span>
      </p>
      <p>
        <span class="theme">购买类型</span>
        <span>竞拍</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  props: ["editId"],
  data() {
    return {
      mutilAccount: false,
      form: {
        account: "",
        name: ""
      },
      mutilstatus: {},
      mutil: {
        name: false
      }
    };
  },
  mounted() {
    // 新建编辑实例，绑定到操作按钮上
    this.$textCopy('#copyButtonCampaign');
  },
  methods: {
    extractInfo() {
      if (!this.form.account) {
        Msgwarning("请选择广告账户");
        return;
      }
      if (!this.form.name && !this.mutilstatus.name) {
        Msgwarning("请输入广告系列名称");
        return;
      }
      let obj = {
        accountId: this.form.account,
        name: this.form.name,
        campaignId: this.editId
      };
      return obj;
    },
    reset() {
      this.mutilAccount = false;
      this.form.name = "";
      this.form.account = "";
      
      this.mutilstatus = {};
      this.mutil = {
        name: false
      }
    },
    initData() {
      /**
       * 创建初始化获取已选广告账户
       * 如果已选多个，则显示为空，当前只能单选
       * 如果只选了一个，则默认当前选择广告账户
       */
      if (this.adaccountid.length > 1) {
        this.form.account = "";
      } else {
        this.form.account =
          this.adaccountid.length == 0 ? "" : this.adaccountid[0];
      }
      // 初始化重置是否已改动状态
      setTimeout(() => {
          this.$emit("changeEdit", false);
        }, 100);
    }
  },
  computed: {
    ...mapState(["adaccountlist", "adaccountid", "editcampaignlist"])
  },
  watch: {
    editcampaignlist(n, o) {
      if (n.length > 0) {
        // 广告账户情况
        let accountIdArr = [...new Set(n.map(v => v.accountId))];
        this.form.account = accountIdArr.length > 1 ? "" : accountIdArr[0];
        this.mutilAccount = accountIdArr.length > 1 ? true : false;

        // 广告系列名称情况
        this.form.name = [...new Set(n.map(v => v.name))].length > 1 ? "" : n[0].name;
        
        this.mutil = {
          name: !this.form.name ? true : false
        }
        this.mutilstatus = Object.assign({}, this.mutil);
        // 初始化重置是否已改动状态
        setTimeout(() => {
          this.$emit("changeEdit", false);
        }, 100)
      }
    },
    "form.account": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    },
    "form.name": {
      handler(n, o) {
        this.$emit("changeEdit", true);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.secondtitle {
  font-size: 20px;
  font-weight: normal;
  line-height: 40px;
  margin-bottom: 10px;
}
.info {
  p {
    overflow: hidden;
    span {
      float: left;
      font-size: 14px;
      display: block;
      line-height: 50px;
      &.theme {
        width: 110px;
        text-align: left;
        padding-right: 12px;
        box-sizing: border-box;
      }
    }
  }
}
.form {
  width: 420px;
  .formselect {
    width: 100%;
  }
  .moneyinput {
    position: relative;
    overflow: hidden;
    .moneyus {
      position: absolute;
      z-index: 9;
      left: 8px;
      font-size: 18px;
    }
    .minput {
      // width: 200px;
    }
  }
}
.adnum {
  margin-right: 10px;
}
</style>
