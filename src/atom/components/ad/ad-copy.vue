<template>
  <el-dialog :title="`复制${typeData.name}`" :visible.sync="dialogFormVisible" @close="hideCopy">
    <el-form v-if="type == 'campaignName'" label-position="left">
      <el-form-item label="目标广告账户" label-width="170px">
        <el-select
          v-model="account"
          class="accountselect"
          filterable
          placeholder="选择广告账户，可搜索"
          @change="selectAccount"
        >
          <el-option-group v-for="group in adaccountOption" :key="group.label" :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.fbAccountId"
              :label="item.name + (item.fbAccountId != -1?'('+item.fbAccountId+')':'')"
              :value="item.fbAccountId"
              :disabled="item.accountStatus != 1"
            ></el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="每个广告系列副本数量" label-width="170px">
        <el-input-number v-model="everyCount" :min="1" :step="1" :disabled="ifstride" label="描述文字"></el-input-number>
        <p v-show="ifstride">跨广告账户复制暂只支持1个副本</p>
      </el-form-item>
    </el-form>
    <el-form v-if="type == 'adSetName'" label-position="left">
      <el-form-item label="复制到" label-width="80px">
        <div class="target">
          <el-radio v-model="targetArea" :label="1">原广告系列</el-radio>
          <p v-show="targetArea == 1">{{originName}}</p>
          <p v-show="originId && targetArea == 1">ID:{{originId}}</p>
        </div>
        <div class="target">
          <el-radio v-model="targetArea" :label="2">其他已有广告系列</el-radio>
          <p v-show="targetArea == 2">
            <el-select
              v-model="state"
              class="alreadyHas"
              filterable
              placeholder="请输入广告系列名称/编号搜索，包含所有广告账户内的"
              remote
              :remote-method="searchCampaign"
              @change="selectCampaignAdset"
            >
              <el-option
                v-for="item in copyCampaign"
                :key="item.campaignId"
                :label="`${item.campaiggName}(${item.campaignId})`"
                :value="item.campaignId+'|'+item.fbAccount.replace('act_', '')"
              ></el-option>
            </el-select>
          </p>
        </div>
        <div class="target">
          <el-radio v-model="targetArea" :label="3">新广告系列</el-radio>
          <p v-show="targetArea == 3">
            <el-input v-model="newName" class="alreadyHas" placeholder="请输入内容"></el-input>
            <el-form-item label="目标广告账户" label-width="100px">
              <el-select
                v-model="account"
                class="accountselect"
                filterable
                placeholder="选择广告账户，可搜索"
                @change="selectAccount"
              >
                <el-option-group
                  v-for="group in adaccountOption"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.fbAccountId"
                    :label="item.name + (item.fbAccountId != -1?'('+item.fbAccountId+')':'')"
                    :value="item.fbAccountId"
                    :disabled="item.accountStatus != 1"
                  ></el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="每个广告组副本数量" label-width="155px">
        <el-input-number v-model="everyCount" :min="1" :step="1" :disabled="ifstride" label="描述文字"></el-input-number>
        <p v-show="ifstride">跨广告账户复制暂只支持1个副本</p>
      </el-form-item>
    </el-form>
    <el-form v-if="type == 'adName'" label-position="left">
      <el-form-item label="复制到" label-width="80px">
        <div class="target">
          <el-radio v-model="targetArea" :label="1">原广告组</el-radio>
          <p v-show="targetArea == 1">{{originName}}</p>
          <p v-show="originId && targetArea == 1">ID:{{originId}}</p>
        </div>
        <div class="target">
          <el-radio v-model="targetArea" :label="2">其他已有广告组</el-radio>
          <p v-show="targetArea == 2">
            <el-select
              v-model="state"
              class="alreadyHas"
              filterable
              placeholder="请输入广告组名称/编号搜索，包含所有广告账户内的"
              remote
              :remote-method="searchAdset"
              @change="selectCampaignAdset"
            >
              <el-option
                v-for="item in copyAdset"
                :key="item.adsetId"
                :label="`${item.adSetName}(${item.adSetId})`"
                :value="item.adSetId+'|'+item.fbAccountId.replace('act_', '')"
              ></el-option>
            </el-select>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="每个广告副本数量" label-width="140px">
        <el-input-number v-model="everyCount" :min="1" :step="1" :disabled="ifstride" label="描述文字"></el-input-number>
        <p v-show="ifstride">跨广告账户复制暂只支持1个副本</p>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hideCopy">取 消</el-button>
      <el-button type="primary" @click="saveCopy">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Msgwarning } from "../../js/message";
import { setTimeout, clearTimeout } from "timers";
let timerun;
export default {
  data() {
    return {
      dialogFormVisible: false,
      targetArea: 1,
      // type: 'adName',
      state: "",
      newName: "",
      account: "",
      everyCount: 1,
      originId: "",
      originName: "",
      type: "",
      accountId: "",
      orgId: [],
      distId: [],
      adaccountOption: [], // 广告账户
      ifstride: false, // 是否为跨广告账户复制
      disAccount: "" // 目标广告账户id
    };
  },
  watch: {
    targetArea(n, v) {
      this.ifstride = false;
      this.disAccount = "";
      this.account = "";
      this.state = "";
    }
  },
  methods: {
    ...mapMutations(["SETSTATE"]),
    hideCopy() {
      this.dialogFormVisible = false;
      this.reset();
    },
    reset() {
      this.state = "";
      this.newName = "";
      this.originId = "";
      this.originName = "";
      this.everyCount = 1;
      this.orgId = [];
      this.distId = [];
      this.account = "";
      this.ifstride = false;
      this.disAccount = "";
      this.targetArea = 1;
      this.SETSTATE({ k: "copycampaignlist", v: [] });
      this.SETSTATE({ k: "copyAdset", v: [] });
    },
    showBox(type, option, accountId) {
      // option包含id, orgid, orgname
      // console.log(option);
      this.type = type;
      this.accountId = accountId;
      // // 初始化获取广告系列列表或者广告组列表
      // if (type == "adSetName") {
      //   this.$store.dispatch("adGetCampaignlist", {
      //     projectId: this.$route.params.id
      //   });
      // }
      // if (type == "adName") {
      //   this.$store.dispatch("adGetAdsetList", {
      //     projectId: this.$route.params.id
      //   });
      // }
      /**
       * 区分单个复制与多个一起复制
       * 主要显示区别
       * originId 原始显示ID ad -> adSetId
       * originName 原始显示Name
       * orgId 原始ID ad -> adId
       * distId 目标ID
       */
      if (option.length == 1) {
        this.originId = option[0].orgid;
        this.originName = option[0].orgname;
        this.orgId = [option[0].id];
        this.distId = [option[0].orgid];
      } else {
        this.originId = "";
        this.originName = "多项内容";
        this.orgId = option.map(v => v.id);
        this.distId = option.map(v => v.orgid);
      }
      /**
       * 20190319 新增逻辑，初始化的时候格式化广告账户选择器数据格式
       * 用于跨广告账户复制
       */
      this.adaccountOption = [];
      let presentaccount = [
        {
          label: "所在广告账户",
          options: this.commonaccount.filter(v => v.fbId == this.accountId)
        }
      ];
      let otheraccount = [
        {
          label: "其他",
          options: this.commonaccount.filter(v => v.fbId != this.accountId)
        }
      ];
      this.adaccountOption = presentaccount.concat(otheraccount);
      this.dialogFormVisible = true;
    },
    searchCampaign(k) {
      console.log(k);
      if (!k) {
        this.SETSTATE({ k: "copycampaignlist", v: [] });
        return;
      }
      clearTimeout(timerun);
      timerun = setTimeout(() => {
        this.$store.dispatch("adGetCampaignlist", {
          projectId: this.$route.params.id,
          keyword: k
        });
      }, 300);
    },
    selectCampaignAdset() {
      this.disAccount = this.state.split("|")[1];
      // 判断是否是跨广告账户复制
      this.setStride();
    },
    setStride() {
      if (this.disAccount != this.accountId) {
        this.ifstride = true;
        this.everyCount = 1;
      } else {
        this.ifstride = false;
      }
    },
    searchAdset(k) {
      console.log(k);
      if (!k) {
        this.SETSTATE({ k: "copyAdset", v: [] });
        return;
      }
      clearTimeout(timerun);
      timerun = setTimeout(() => {
        this.$store.dispatch("adGetAdsetList", {
          projectId: this.$route.params.id,
          keyword: k
        });
      }, 300);
    },
    selectAccount() {
      this.disAccount = this.account;
      // 判断是否是跨广告账户复制
      this.setStride();
    },
    saveCopy() {
      if (!this.everyCount) {
        Msgwarning("请输入需要复制的数量");
        return;
      }
      console.log(this.disAccount);
      /**
       * 20190320新增，广告账户选项，单选必填
       */
      if (this.type == "campaignName" && !this.account) {
        Msgwarning("请选择广告账户");
        return;
      }
      /**
       * 根据目标类型，设置distid
       * 如果是第三种情况，提交请求放在新建之后
       */
      // console.log(this.state);
      if (this.targetArea == 2) {
        if (!this.state) {
          Msgwarning("请先选择需要复制到的广告系列/广告组");
          return;
        }

        this.distId = [this.state.split("|")[0]];
      } else if (this.targetArea == 3) {
        if (!this.newName.trim()) {
          Msgwarning("请输入新广告系列名称");
          return;
        }
        if (!this.account) {
          Msgwarning("请选择广告账户");
          return;
        }

        // 复制到新的广告系列
        this.$store.dispatch("copyCreateCampaign", {
          name: this.newName,
          accountId: this.disAccount,
          orgId: this.orgId,
          // distId: this.distId,
          count: this.everyCount,
          identify: this.typeData["identify"],
          type: this.type,
          projectId: this.$route.params.id,
          ifstride: this.ifstride
        });
        this.hideCopy();
        return;
      }

      this.$store.dispatch("adCopy", {
        orgId: this.orgId,
        distId: this.distId,
        count: this.everyCount,
        identify: this.typeData["identify"],
        type: this.type,
        projectId: this.$route.params.id,
        fbAccountId: !this.ifstride ? null : this.disAccount
      });

      this.hideCopy();
    }
  },
  computed: {
    ...mapState(["copycampaignlist", "copyadsetlist", "commonaccount"]),
    copyCampaign() {
      return this.copycampaignlist.filter(v => v.campaignId != this.originId);
    },
    copyAdset() {
      return this.copyadsetlist.filter(v => v.adSetId != this.originId);
    },
    typeData() {
      let k = { name: "", effect: "", effectIds: "" };
      switch (this.type) {
        case "campaignName":
          k.name = "广告系列";
          k.identify = "campaign";
          //   k.orgKey = 'campaignId';
          //   k.distKey = '';
          break;
        case "adSetName":
          k.name = "广告组";
          k.identify = "adSet";
          //   k.orgKey = 'adSetId';
          //   k.distKey = 'campaignId';
          break;
        case "adName":
          k.name = "广告";
          k.identify = "ad";
          //   k.orgKey = 'adId';
          //   k.distKey = 'adSetId';
          break;
      }
      return k;
    }
  }
};
</script>

<style lang="less" scoped>
.target {
  p {
    line-height: 30px;
    .alreadyHas {
      width: 400px;
      margin-bottom: 10px;
    }
  }
}
.accountselect {
  width: 300px;
}
</style>
