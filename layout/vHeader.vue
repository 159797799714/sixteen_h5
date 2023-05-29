<template>
  <van-nav-bar @click-left="onClickLeft" :border="border" :title="title" :left-arrow="leftArrow">
    <template #left>
      <slot name="left"></slot>
    </template>
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #right>
      <slot name="right"></slot>
    </template>
  </van-nav-bar>
</template>
<script>
export default {
  name: "vHeader",
  props: {
    title: {
      default: "",
      type: String,
      required: false,
    },
    leftArrow: {
      default: true,
      type: Boolean,
      required: false,
    },
    leftClick: {
      default: undefined,
      type: Function,
      required: false,
    },
    border:{
      default:true,
      type:Boolean,
      required:false
    }
  },
  methods: {
    onClickLeft() {
		
      if (this.leftClick) {
        this.leftClick();
      } else {
		  const pages = getCurrentPages()
		  if (pages.length === 1) {//如果只有一个调用原生js
			history.back()
		  } else {
			this.$back();
		  }
      }
    },
  },
};
</script>