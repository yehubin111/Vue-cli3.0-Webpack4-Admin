<template>
  <el-dialog title="编辑受众" :visible="status" class="dialog" @close="toCancel">
    <el-form ref="form" :model="form" label-width="80px" class="cform">
      <el-form-item label="受众名称">
        <el-input v-model="form.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.desc" placeholder="请输入描述，选填"></el-input>
      </el-form-item>
      <el-form-item class="cbutton">
        <el-button type="primary" @click="toSubmit">保存</el-button>
        <el-button @click="toCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { Msgwarning } from "../../js/message";

export default {
  props: ["status", "editid", "audienceId"],
  data() {
    return {
      form: {
        name: "",
        desc: ""
      }
    };
  },
  methods: {
    toCancel() {
      this.$emit("hideBox");
    },
    formReset() {
      this.form.name = "";
      this.form.desc = "";
    },
    async toSubmit() {
      if (!this.form.name.trim()) {
        Msgwarning("受众名称不能为空");
        return;
      }
      let option = {
        description: this.form.desc,
        fbAudienceId: this.audienceId,
        name: this.form.name
      };
      let res = await this.$store.dispatch("addTarget", {
        option,
        type: "special"
      });
      if (res.data.status != "failed") this.toCancel();
    }
  },
  computed: {
    ...mapState(["specialtargetinfo"])
  },
  watch: {
    status(n, o) {
      if (n) {
        // 根据受众ID 获取已创建受众信息
        let audience_id = this.editid;
        this.$store.dispatch("getTargetInfo", { audience_id, type: "special" });
      }
    },
    specialtargetinfo(n, o) {
      if (n) {
        this.form.name = n.name;
        this.form.desc = n.description;
      }
    }
  }
};
</script>

<style>
</style>
