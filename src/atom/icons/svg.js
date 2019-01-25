import Vue from 'vue'
import SvgIcon from './svg.vue'

Vue.component('svg-icon', SvgIcon);
const reqAll = requireContext => requireContext.keys().map(requireContext);
const allSvg = require.context('./svg', false, /\.svg$/)
reqAll(allSvg)