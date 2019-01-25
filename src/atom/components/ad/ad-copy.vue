<template>
  <el-dialog :title="`复制${typeData.name}`" :visible.sync="dialogFormVisible" @close="hideCopy">
    <el-form v-if="type == 'campaignName'" label-position="left">
      <el-form-item label="每个广告系列副本数量" label-width="170px">
        <el-input-number v-model="everyCount" :min="1" :step="1" label="描述文字"></el-input-number>
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
            <el-select v-model="state" class="alreadyHas" filterable placeholder="请选择广告系列">
              <el-option
                v-for="item in copyCampaign"
                :key="item.campaignId"
                :label="`${item.name}(${item.campaignId})`"
                :value="item.campaignId"
              ></el-option>
            </el-select>
          </p>
        </div>
        <div class="target">
          <el-radio v-model="targetArea" :label="3">新广告系列</el-radio>
          <p v-show="targetArea == 3">
            <el-input v-model="newName" class="alreadyHas" placeholder="请输入内容"></el-input>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="每个广告组副本数量" label-width="155px">
        <el-input-number v-model="everyCount" :min="1" :step="1" label="描述文字"></el-input-number>
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
            <el-select v-model="state" class="alreadyHas" filterable placeholder="请选择广告组">
              <el-option
                v-for="item in copyAdset"
                :key="item.adsetId"
                :label="`${item.name}(${item.adsetId})`"
                :value="item.adsetId"
              ></el-option>
            </el-select>
          </p>
        </div>
      </el-form-item>
      <el-form-item label="每个广告副本数量" label-width="140px">
        <el-input-number v-model="everyCount" :min="1" :step="1" label="描述文字"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hideCopy">取 消</el-button>
      <el-button type="primary" @click="saveCopy">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { Msgwarning } from "../../js/message";
export default {
  data() {
    return {
      dialogFormVisible: false,
      targetArea: 1,
      // type: 'adName',
      state: "",
      newName: "",
      everyCount: 1,
      originId: "",
      originName: "",
      type: "",
      accountId: "",
      orgId: [],
      distId: []
    };
  },
  methods: {
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

      this.targetArea = 1;
    },
    showBox(type, option, accountId) {
      // option包含id, orgid, orgname
      // console.log(option);
      this.type = type;
      this.accountId = accountId;
      // 初始化获取广告系列列表或者广告组列表
      if (type == "adSetName") {
        this.$store.dispatch("adGetCampaignlist", accountId);
      }
      if (type == "adName") {
        this.$store.dispatch("adGetAdsetList", accountId);
      }
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
      this.dialogFormVisible = true;
    },
    saveCopy() {
      if (!this.everyCount) {
        Msgwarning("请输入需要复制的数量");
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

        this.distId = [this.state];
      } else if (this.targetArea == 3) {
        if (!this.newName.trim()) {
          Msgwarning("请输入新广告系列名称");
          return;
        }

        // 复制到新的广告系列
        this.$store.dispatch("copyCreateCampaign", {
          name: this.newName,
          accountId: this.accountId,
          orgId: this.orgId,
          distId: this.distId,
          count: this.everyCount,
          identify: this.typeData["identify"],
          type: this.type
        });
        this.hideCopy();
        return;
      }
      //  else {
      //   this.distId = this.orgId;
      // }

      this.$store.dispatch("adCopy", {
        orgId: this.orgId,
        distId: this.distId,
        count: this.everyCount,
        identify: this.typeData["identify"],
        type: this.type,
        projectId: this.$route.params.id
      });

      this.hideCopy();
    }
  },
  computed: {
    ...mapState(["copycampaignlist", "copyadsetlist"]),
    copyCampaign() {
      return this.copycampaignlist.filter(v => v.campaignId != this.originId);
    },
    copyAdset() {
      return this.copyadsetlist.filter(v => v.adsetId != this.originId);
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
    }
  }
}
</style>
