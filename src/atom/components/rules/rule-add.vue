<template>
  <el-dialog title="创建规则" :visible="status" @close="hideBox">
    <el-form label-position="left">
      <el-form-item label="广告账户" label-width="110px">
        <el-select
          class="select"
          v-model="account"
          filterable
          placeholder="请选择广告账户，可搜索"
          @change="toSort"
        >
          <el-option :label="111" :value="222"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规则应用对象" label-width="110px">
        <el-select
          class="select"
          v-model="ruleobject"
          filterable
          placeholder="选择对象"
          @change="toSort"
        >
          <el-option :label="111" :value="222"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作" label-width="110px">
        <div>
          <el-cascader
            class="select"
            :options="ctrlOption"
            :show-all-levels="false"
            v-model="ctrlmethod"
            @change="toSort"
          ></el-cascader>
          <el-input change="ctrlnum" v-model="ctrlnum" placeholder=""></el-input>
        </div>
      </el-form-item>
      <el-form-item label="排期" label-width="110px">
        <el-select class="select" v-model="schedule" filterable placeholder="选择排期" @change="toSort">
          <el-option :label="111" :value="222"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="条件" label-width="110px">
        <el-button type="primary" icon="el-icon-plus" circle></el-button>
        <el-form-item label="时间范围" label-width="110px">
          <el-select
            class="select"
            v-model="timerange"
            filterable
            placeholder="选择时间范围"
            @change="toSort"
          >
            <el-option :label="111" :value="222"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计时间窗" label-width="110px">
          <el-radio-group v-model="timewindow">
            <el-radio :label="3">账号默认设置</el-radio>
            <el-radio :label="6">自定义</el-radio>
          </el-radio-group>
          <div class="windowdeploy">浏览广告后</div>
        </el-form-item>
      </el-form-item>
      <el-form-item label="规则名称" label-width="110px">
        <el-input class="select" v-model="rulename" placeholder="请输入名称"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveRule">确 定</el-button>
      <el-button @click="hideBox">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      ctrlOption: [
        {
          value: "close",
          label: "关闭",
          children: null
        },
        {
          value: "open",
          label: "开启",
          children: null
        },
        {
          value: "tzys",
          label: "调整预算",
          children: [
            {
              value: "1",
              label: "将单日预算增加"
            },
            {
              value: "2",
              label: "将单日预算减少"
            },
            {
              value: "3",
              label: "将总预算增加"
            },
            {
              value: "4",
              label: "将总预算减少"
            },
            {
              value: "5",
              label: "根据目标调整单日预算"
            },
            {
              value: "6",
              label: "根据目标调整总预算"
            }
          ]
        },
        {
          value: "tzsdjj",
          label: "调整手动竞价",
          children: [
            {
              value: "7",
              label: "将竞价提高"
            },
            {
              value: "8",
              label: "将竞价降低"
            },
            {
              value: "9",
              label: "根据目标调整竞价"
            }
          ]
        }
      ],
      status: true,
      account: "",
      ruleobject: "",
      ctrlmethod: [],
      ctrlnum: '',
      schedule: "",
      rulename: "",
      timerange: "",
      timewindow: ""
    };
  },
  methods: {
    hideBox() {},
    toSort() {
      console.log(this.ctrlmethod);
    },
    saveRule() {}
  }
};
</script>

<style lang="less" scoped>
.select {
  width: 300px;
}
.dialog-footer {
  text-align: center;
  margin-bottom: 30px;
}
.ctrlnum{
  width: 100px;
}
</style>
