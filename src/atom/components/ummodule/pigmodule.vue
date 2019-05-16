<template>
    
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    computed: {
        ...mapState(['_edge'])
    },
    methods: {
        ...mapMutations(['SETSTATE'])
    },
    mounted() {
        if(!this._edge) {
            this.SETSTATE({k: '_edge', v: 1});
        }
        if(this._edge != '到' && this._edge != 'author')
            console.log('%c我说母🐷你说到', 'color: red;font-size: 30px;font-weight: bold;-webkit-text-stroke-width: 1px;-webkit-text-stroke-color: black;');
        if(this._edge == '到')
            console.log('%c别看了，🐷', 'color: red;font-size: 30px;font-weight: bold;-webkit-text-stroke-width: 1px;-webkit-text-stroke-color: black;');
    },
    watch: {
        // _edge(n, o) {
        //     if(n == 'author' || n == '到') {
        //         window.reload();
        //     }
        // }
    }
}
</script>

<style>

</style>
