<template>
  <svg :class="iconClass" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  props: {
    svgclass: {
      type: String,
      default: ""
    },
    svgname: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.svgname}`;
    },
    iconClass() {
      if (this.svgclass) {
        return `svg-icon ${this.svgclass}`;
      } else {
        return `svg-icon`;
      }
    }
  }
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
