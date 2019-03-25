<template>
  <div class="rule">
    <p class="title">项目{{projectname}}&nbsp;&nbsp;>&nbsp;&nbsp;规则管理</p>
    <div class="ctrlline">
      <el-select class="select" v-model="account" filterable placeholder="广告账户，可多选，支持编号和名称搜索" @change="selectCondition">
        <el-option :label="111" :value="111"></el-option>
      </el-select>
      <el-button type="primary" @click="addStatus = true">创建</el-button>
    </div>
    <div class="rulelist">
      <rule-list></rule-list>
    </div>
    <rule-add :status.sync="addStatus"></rule-add>
    <!-- <p class="tip">规则只对推广计划生成的对象生效</p>
    <div class="rulelist">
      <div class="box" v-for="(l, index) in rulelist" :key="index">
        <div class="con">
          <p class="id">ID:{{l.id}}</p>
          <p class="ttl">{{l.name}}</p>
          <p class="describe">{{l.description}}</p>
          <p class="ctrl">
            <span class="count">触发次数：{{l.triggerCount}}</span>
            <el-switch v-model="l.status" :active-value="true" :inactive-value="false" class="switch" active-color="#13ce66" inactive-color="#d7dae2" @change="switchChange(l.id)">
            </el-switch>
          </p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import RuleAdd from './rule-add';
import RuleList from './rule-list';
import { mapState } from "vuex";
export default {
  components: {
    RuleList,
    RuleAdd
  },
  data() {
    return {
      value2: true,
      account: '',
      addStatus: false
    };
  },
  mounted() {
    this.$store.dispatch("getRules", this.$route.params.id);
  },
  computed: {
    ...mapState(["itemlist", "rulelist"]),
    projectname() {
      if (this.itemlist.length == 0) return;
      return this.itemlist.find(v => v.id == this.$route.params.id).projectName;
    }
  },
  methods: {
    selectCondition() {

    },
    switchChange(id) {
      let status = this.rulelist.find(v => v.id == id).status;

      let projid = this.$route.params.id;
      let ruleGroupId = id;

      if (status) this.$store.dispatch("openRule", { projid, ruleGroupId });
      else this.$store.dispatch("closeRule", { projid, ruleGroupId });
    }
  }
};
</script>

<style lang="less" scoped>
.rule {
  flex-grow: 1;
  .title {
    line-height: 60px;
    font-size: 20px;
    margin-bottom: 20px;
    margin-left: 40px;
    .back {
      color: #333;
    }
  }
  .ctrlline{
    margin-left: 40px;
    margin-bottom: 30px;
    .select{
      width: 300px;
      margin-right: 20px;
    }
  }
  .rulelist{
    margin-left: 40px;
  }
  // .tip{
  //   margin-bottom: 20px;
  //   font-size: 14px;
  //   margin-left: 40px;
  // }
  // .rulelist {
  //   overflow: hidden;
  //   margin-left: 25px;
  //   margin-right: -15px;
  //   .box {
  //     width: 33.3%;
  //     float: left;
  //     box-sizing: border-box;
  //     padding: 0 15px 30px 15px;
  //     .con {
  //       height: 200px;
  //       border: 1px solid #e6e6e6;
  //       box-sizing: border-box;
  //       position: relative;
  //       .id {
  //         font-size: 16px;
  //         font-weight: bold;
  //         margin: 15px 0 0 20px;
  //       }
  //       .ttl {
  //         margin-left: 20px;
  //         margin-right: 20px;
  //         height: 30px;
  //         text-overflow: ellipsis;
  //         overflow: hidden;
  //         white-space: nowrap;
  //         line-height: 30px;
  //         font-size: 14px;
  //       }
  //       .describe {
  //         margin-left: 20px;
  //         margin-right: 20px;
  //         height: 60px;
  //         // text-overflow: ellipsis;
  //         overflow: hidden;
  //         // white-space: nowrap;
  //         line-height: 20px;
  //         font-size: 12px;
  //         text-align: justify;
  //         color: #999;
  //       }
  //       .ctrl {
  //         position: absolute;
  //         bottom: 0;
  //         left: 0px;
  //         color: #666;
  //         overflow: hidden;
  //         width: 100%;
  //         .count {
  //           line-height: 50px;
  //           font-size: 12px;
  //           float: left;
  //           margin-left: 20px;
  //         }
  //         .switch {
  //           float: right;
  //           margin-right: 20px;
  //           margin-top: 13px;
  //         }
  //       }
  //     }
  //   }
  // }
}
</style>
