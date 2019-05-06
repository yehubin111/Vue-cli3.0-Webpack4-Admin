<template>
    <el-dialog :visible.sync="bigImageVisible" @close="toCancel">
      <img width="100%" :src="bigImageUrl" alt>
    </el-dialog>
</template>

<script>
export default {
    props: {
        status: {
            type: Boolean,
            required: true
        },
        bigImageUrl: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            bigImageVisible: false
        }
    },
    watch: {
        status(n, o) {
            this.bigImageVisible = n;
        }
    },
    methods: {
        toCancel() {
            this.$emit('hideBig');
        }
    }
}
</script>

<style>

</style>
