<template>
  <div class="create-campaign">
    <el-form class="form" :model="form" label-width="150px" label-position="left">
      <el-form-item label="当前广告账户">
        <el-select
          class="formselect"
          filterable
          v-model="form.account"
          placeholder="请选择广告账户"
          v-if="!mutilAccount"
          :disabled="editId.length > 0"
        >
          <el-option
            v-for="item in commonaccount"
            :key="item.fbAccountId"
            :label="item.name + (item.fbAccountId != -1?'('+item.fbAccountId+')':'')"
            :value="item.fbAccountId"
            :disabled="item.accountStatus != 1"
          ></el-option>
        </el-select>
        <p v-if="mutilAccount">多项内容</p>
      </el-form-item>
      <el-form-item label="广告系列编号" v-if="editId.length > 0">
        <span class="adnum" id="copyCampaign">{{editId.length > 1? '多项内容': editId[0]}}</span>
        <el-button
          id="copyButtonCampaign"
          data-clipboard-action="copy"
          data-clipboard-target="#copyCampaign"
          type="primary"
          size="mini"
          v-show="editId.length == 1"
        >复制</el-button>
      </el-form-item>
      <el-form-item label="广告系列名称">
        <p v-if="mutil.name">
          <span v-show="mutilstatus.name">
            多项内容，
            <el-button type="text" @click="mutilstatus.name = !mutilstatus.name">编辑</el-button>
          </span>
          <span v-show="!mutilstatus.name">
            多项内容，已编辑，
            <el-button type="text" @click="mutilstatus.name = !mutilstatus.name">撤销编辑</el-button>
          </span>
        </p>
        <el-input v-model="form.name" placeholder="请输入广告系列名称" v-show="!mutilstatus.name"></el-input>
      </el-form-item>
    </el-form>
    <h1 class="secondtitle">广告系列详情</h1>
    <el-form class="form" :model="form" label-width="150px" label-position="left">
      <el-form-item label="目标">
        <p>应用安装量</p>
      </el-form-item>
      <el-form-item label="购买类型">
        <p>竞拍</p>
      </el-form-item>
      <el-form-item label="广告系列花费上限">
        <div>
          <el-tooltip
            class="conditiontip"
            effect="dark"
            content="设置广告系列总花费上限。当花费达到上限时，广告系列中的广告组就会停止"
            placement="top-start"
          >
            <i class="el-icon-warning"></i>
          </el-tooltip>
          <el-input
            class="optimizeinput"
            v-show="form.setmax"
            v-model="form.costmax"
            placeholder="请输入花费上限，不能低于100"
          ></el-input>
          <el-progress class="progress" v-show="form.setmax" :percentage="70" status="text">已花费$300</el-progress>
          <el-button type="text" @click="form.setmax = !form.setmax">{{form.setmax? '删除上限': '设置上限'}}</el-button>
        </div>
      </el-form-item>
      <el-form-item label="广告系列预算优化">
        <div>
          <el-tooltip
            class="conditiontip"
            effect="dark"
            content="根据你选择的优化投放方案和竞价策略，预算优化功能将为广告系列中的各广告组分配预算，力求获得更多成效。你可以控制每个广告组的花费。"
            placement="top-start"
          >
            <i class="el-icon-warning"></i>
          </el-tooltip>
          <el-switch
            v-model="form.campaignoptimize"
            active-color="#13ce66"
            inactive-color="#d7dae2"
          ></el-switch>
          <p class="optimizetip" v-show="form.campaignoptimize">
            广告系列不符合广告系列预算优化要求。
            <el-tooltip
              effect="dark"
              content="未满足 - 所有广告组均使用相同的预算类型（总预算或单日预算）"
              placement="top-start"
            >
              <el-button type="text" class="checkbutton">查看资格要求</el-button>
            </el-tooltip>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="广告系列预算" v-show="form.campaignoptimize">
        <div>
          <el-radio-group v-model="form.moneytype">
            <el-radio label="day_budget">单日预算</el-radio>
            <el-radio label="total_budget">总预算</el-radio>
          </el-radio-group>
          <div class="moneyinput">
            <span class="moneyus">$</span>
            <el-input class="minput" v-model="form.money" placeholder="请输入预算金额（单位：美元）"></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="广告系列竞价策略" v-show="form.campaignoptimize">
        <div>
          <el-tooltip class="conditiontip" effect="dark" placement="top-start">
            <div slot="content">
              每种竞价策略适合不同的业务目标，需要你权衡利弊。如果你更希望从预算获得最大价值，请使用最低费用竞价策略。如果你更关心稳定的单次优化事件平均费用，请使用目标费用竞价策略。
              <br>你将在每个广告组中设置竞价上限。详细了解。
              <br>你在广告组层级中设置的广告投放优化方式将影响你所获得的成效。如果你选择设置竞价上限或目标费用，请在每个广告组中输入具体金额。
            </div>
            <i class="el-icon-warning"></i>
          </el-tooltip>
          <el-select class="formselect" v-model="form.bidmethod" placeholder="请选择竞价策略">
            <el-option
              v-for="item in bidmethodlist"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
          <p>
            <el-button type="text" class="checkbutton" @click="setMaxCost">设置广告组{竞价上限/目标费用}</el-button>
          </p>
        </div>
      </el-form-item>
    </el-form>
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
          name: "",
          setmax: false,
          costmax: "",
          campaignoptimize: false,
          moneytype: "day_budget",
          money: "",
          bidmethod: ""
        },
        mutilstatus: {},
        mutil: {
          name: false
        }
      };
    },
    mounted() {
      // 新建编辑实例，绑定到操作按钮上
      this.$textCopy("#copyButtonCampaign");
    },
    methods: {
      setMaxCost() {
        this.$emit("setMaxCost");
      },
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
        };
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
      ...mapState([
        "commonaccount",
        "adaccountid",
        "editcampaignlist",
        "bidmethodlist"
      ])
    },
    watch: {
      editcampaignlist(n, o) {
        if (n.length > 0) {
          // 广告账户情况
          let accountIdArr = [...new Set(n.map(v => v.accountId))];
          this.form.account = accountIdArr.length > 1 ? "" : accountIdArr[0];
          this.mutilAccount = accountIdArr.length > 1 ? true : false;

          // 广告系列名称情况
          this.form.name =
            [...new Set(n.map(v => v.name))].length > 1 ? "" : n[0].name;

          this.mutil = {
            name: !this.form.name ? true : false
          };
          this.mutilstatus = Object.assign({}, this.mutil);
          // 初始化重置是否已改动状态
          setTimeout(() => {
            this.$emit("changeEdit", false);
          }, 100);
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

<style lang="less">
.progress {
  .el-progress-bar {
    padding-right: 55px;
    width: 88%;
  }
}
</style>

<style lang="less" scoped>
.secondtitle {
  font-size: 20px;
  font-weight: normal;
  line-height: 40px;
  margin-bottom: 10px;
}
.conditiontip {
  position: absolute;
  left: -36px;
  top: 14px;
}
.optimizeinput {
  margin-bottom: 15px;
}
.optimizetip {
  line-height: 24px;
  .checkbutton {
    padding: 5px 0;
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
