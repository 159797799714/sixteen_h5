<template>
  <v-page class="pledgeRonqi">
	
	<v-header  :border="false" :title="$t('common.service')" :leftClick="()=>_router.replace('/pages/base/index')" >
	</v-header>


	<view class="page-inner">
		<web-view :src="kefu" :webview-styles="webviewStyle" style="margin-top: 88rpx;"></web-view>
	</view>
  </v-page>	  

</template>
<script>
import { mapState } from "vuex";
export default {
  name: "kefu",
  props: ["isShow"],
  computed: {
    ...mapState({
      logoMap: "logoMap",
    }),
  },
  data() {
    return {
      kefu: '',
	  webviewStyle: {
	    height: "300px",
	  },
    };
  },
  created() {
	this.getkefu()
  },
  mounted() {
    // #ifdef APP-PLUS
    var currentWebview = this.$scope.$getAppWebview(); //获取当前web-view
    var wv = currentWebview.children()[0];
    wv.setStyle({
      top: uni.getSystemInfoSync().statusBarHeight, //此处是距离顶部的高度，应该是你页面的头部
      zindex: 1,
      scalable: false, //webview的页面是否可以缩放，双指放大缩小
    });
    // #endif
  },
  methods: {
	  getkefu(){
	  	this.kefu = this.logoMap.kefu;
		console.log(this.kefu)
	  }
  },
};
</script>
<style lang="scss" scoped>

</style>