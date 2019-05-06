<template>
    <el-dialog :visible.sync="selectimagestatus" @close="toCancel">
      
    </el-dialog>
</template>

<script>
export default {
    props: {
        status: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            selectimagestatus: false
        }
    },
    watch: {
        status(n, o) {
            this.selectimagestatus = n;
        }
    },
    methods: {
        toCancel() {
            this.$emit('hideSelect');
        }
    }
}
</script>

<style>

</style>
