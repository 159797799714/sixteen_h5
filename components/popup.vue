<template>
	<view class='popup' v-show='isShow'>
		<view class="mask" @click="$emit('close')"></view>
		<view class="wrapper">
			<view class='content'>
				<view class='tips'>
					{{$t('safe.d1')}}
				</view>
		<!-- 		<input type="password" class='bg-form-panel-4' :placeholder="$t('login.c1')" @input='input'> -->
				<input type="password" class='bg-form-panel-4' placeholder="" @input='input'>
			</view>
			<view class="btn-wrap">
				<button class='btn ' @click="$emit('confirm')">{{$t('contract.i9')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"popup",
		props:{
			isShow:{}
		},
		data() {
			return {
				
			};
		},
		methods:{
			input(e){
				this.$emit('input',e.detail.value)
			}
		}
	}
</script>

<style lang="scss">
	.popup{
		position: fixed;
		top:0;
		left:0;
		z-index: 999;
		width:100%;
		height:100vh;
		.mask{
			display: block;
			width:100%;
			height:100vh;
			background: rgba(0, 0, 0, 0.5);
		}
		.wrapper{
			position: absolute;
			top:50%;
			left:50%;
			transform: translate(-50%,-50%);
			background:#2A2A38;
			width:70%;
			border-radius:20rpx;
			overflow:hidden;
			.content{
				padding:20rpx 30rpx;
				box-sizing: border-box;
				input{
					height:70rpx;
					line-height: 70rpx;
					margin:30rpx auto;
					border-radius:10rpx;
					text-indent: 1rem;
					color:#fff;
				}
				
			}
			.btn{
				height:70rpx;
				line-height: 70rpx;
				color:#fff;
				background: linear-gradient(328deg, #2FAD66 0%, #9DE686 100%);
				border-radius: unset;
			}
		}
	}
</style>