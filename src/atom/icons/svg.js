import Vue from 'vue'
import SvgIcon from './svg.vue'

Vue.component('svg-icon', SvgIcon);
const reqAll = requireContext => requireContext.keys().map(requireContext);
const allSvg = require.context('./svg', false, /\.svg$/) // 文件目录，是否包含子目录中的文件，引入文件匹配的正则表达式
reqAll(allSvg)