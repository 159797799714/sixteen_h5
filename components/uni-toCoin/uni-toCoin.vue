<template>
	<view>
		<view class="value-wrap ">
			<view class="selected d-flex align-center" @click="$emit('openCoin')" v-if="data[current]">
				<image :src="data[current].coin_icon" mode="widthFix"></image>
				<view class="coin-name">
					{{data[current].coin_name}}
				</view>
				<van-icon class="fn-middle" name="arrow" size="16" />
			</view>
			<view class="mask-wrap" v-show="isShowCoin">
				<view class="item" v-for="(item,index) in data" :key="index" @click="$emit('choseCoin',item,index)">
					<image :src="item.coin_icon" mode="widthFix"></image>
					<view class="coin-name">
						{{item.coin_name}}
					</view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		name:"uni-imgSelect",
		props:{
			data:{},
			current:{},
			isShowCoin:{}
		},
		data() {
			return {
			};
		},
		methods:{
			
			
		}
	}
</script>

<style lang='scss'>
	.value-wrap{
		position: relative;
		.selected{
			justify-content: space-between;
			image{
				width: 40rpx;
			}
		}
		.mask-wrap{
			position: absolute;
			top: 60rpx;
			right: 0;
			z-index: 1024;
			width: 240rpx;
			max-height: 480rpx;
			overflow-y: scroll;
			padding: 20rpx;
			box-sizing: border-box;
			background: var(--panel-3, #393948);
			box-shadow: var(--shadow, 0px 0px 33px 0px rgba(34, 34, 44, 0.25));
			border-radius:20rpx;
			.item{
				height: 80rpx;
				display: flex;
				align-items: center;
				image{
					margin-right: 20rpx;
					width:40rpx;
				}
			}
			
		}
	}
	
</style>