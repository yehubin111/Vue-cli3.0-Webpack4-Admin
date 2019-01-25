<template>
    <el-dialog :title="`重命名${count}个${typeData.name}`" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="名称" label-width="120px">
          <el-input v-model="conditionName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCondtion">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { Msgwarning } from "../../js/message";
export default {
    props: ['type'],
    data() {
        return {
            dialogFormVisible: false,
            conditionName: '',
            key: ''
        }
    },
    methods: {
        showBox(key, name) {
            this.key = key;
            this.conditionName = name;
            this.dialogFormVisible = true;
        },
        saveCondtion() {
            if(this.conditionName.trim() == ''){
                Msgwarning('请输入名称');
                return;
            }

            this.$store.dispatch('resetName', { id: this.key, name: this.conditionName, type: this.type });

            this.dialogFormVisible = false;
            this.conditionName = '';
            this.key = '';
        }
    },
    computed: {
        count() {
            return this.key.split(',').length;
        },
        typeData() {
            let k = { name: "", effect: "", effectIds: "" };
            switch (this.type) {
                case "campaignName":
                k.name = "广告系列";
                break;
                case "adSetName":
                k.name = "广告组";
                break;
                case "adName":
                k.name = "广告";
                break;
            }
            return k;
        },
    }
}
</script>

<style>

</style>
