<template>
	<v-page>
		<v-header class="nav-head" :title="$t('base.e9')">
			<template #right>
				<v-link to="/pages/transfer/record">
					<van-icon class="fn-20 m-t-xs" name="todo-list-o" />
				</v-link>
			</template>
		</v-header>
		<main class="">
			<view style="height: var(--status-bar-height)"></view>
			<view class="top">
				<view style="height: var(--status-bar-height)"></view>
			</view>
			<view class="panel-box m-x-md rounded p-md bg-panel-3 box-shadow">
				<view class="int-item">
					<view class="tit">
						{{$t('base.e11')}}
					</view>
					<view class="d-flex">
						<input type="digit" placeholder="0.0000" v-model="consume" @input="onInput">
						<view class="max" @click="intMax">
							{{$t('base.e13')}}
						</view>
						<view class="currency">
							<uni-imgSelect :data='coinList' @choseCoin='choseCoin' @openCoin='openCoin'
								:current='form.from_account' :isShowCoin='isShowCoin'></uni-imgSelect>
						</view>
					</view>
				</view>
				<view class="info-item d-flex">
					<view class="account">
						{{$t('assets.a9')}} {{curAmount}}
						{{coinList[form.from_account] ? coinList[form.from_account].coin_name : ''}}
					</view>
					<v-link to="/pages/assets/recharge" style='color: #5A7BEF;'>
						{{$t('assets.e5')}}
					</v-link>
				</view>
				<view class="int-item">
					<view class="tit">
						{{$t('base.e12')}}
					</view>
					<view class="d-flex">
						<input type="digit" placeholder="0.0000" v-model="uget" disabled="true">
						<view class="currency">
							<uni-toCoin :data="coinList" @choseCoin="choseToCoin" @openCoin='openToCoin'
								:current="form.to_account" :isShowCoin="isShowToCoin"></uni-toCoin>
						</view>
					</view>
				</view>
				<view class="exchange d-flex justify-center align-center bg-panel-3 box-shadow link-active"
					@click="swap">
					<van-icon style="transform:rotateZ(90deg)" class="fn-22 color-light" name="exchange" />
				</view>
			</view>



		</main>
		<view class="m-x-md">
			<view class=" mg-20 rounded-md ">
				<v-button class="w-max rounded-md" block type="blue" ref="btn" @click="exChange">
					{{ $t("common.confirm") }}
				</v-button>
			</view>
		</view>
		<view class="rate m-x-md" v-if="coinList[form.from_account]">
			1{{coinList[form.from_account].coin_name}} ≈ {{rate}} {{coinList[form.to_account].coin_name}}
		</view>
	</v-page>
</template>
<script>
	import Wallet from "@/api/wallet";
	import Exchange from "@/api/exchange.js";
	import {
		mapState,
		mapGetters
	} from "vuex";

	export default {
		data() {
			return {
				consume: '',
				uget: this.consume * this.rate,
				coinList: [],
				isShowCoin: false,
				rate: 0,
				isShowToCoin: false,
				isChangeCoin: false,
				isSwapCoin: false,
				curCoinName: "",
				curToCoinName: "",
				form: {
					from_account: 0,
					to_account: 1,
					amount: 0
				},
				account: [],
				curAmount: ""
			};
		},
		onLoad() {
			this.getCoinList()
			this.fundAccount()
		},
		computed: {
			...mapState({
				hideMoney: "hideMoney",
				theme: "theme",
			}),
		},
		methods: {
			swap() {
				[this.form.from_account, this.form.to_account] = [
					this.form.to_account,
					this.form.from_account,
				];
				this.isSwapCoin = true
				this.getExchangeCoinRate()
				this.fundAccount()
			},
			onInput(e) {
				this.uget = (e.detail.value * this.rate).toFixed(8)
			},
			swapchange() {
				this.consume = this.uget
			},
			getExchangeCoinRate() {
				Exchange.getExchangeCoinRate({
					from_coin_name: this.coinList[this.form.from_account].coin_name,
					to_coin_name: this.coinList[this.form.to_account].coin_name
				}).then((res) => {
					if (res.code == 200) {
						this.rate = res.data.rate
						if (this.isSwapCoin && this.consume) {
							this.consume = this.uget
							this.uget = (this.consume * this.rate).toFixed(8)
							this.isSwapCoin = false
						}
						if (this.isChangeCoin && this.consume) {
							this.uget = (this.consume * this.rate).toFixed(8)
							this.isChangeCoin = false
						}
					}
				});
			},
			// 获取币种
			getCoinList() {
				Exchange.getCoinList().then(res => {
					if (res.code == 200) {
						this.coinList = res.data
						this.getExchangeCoinRate()
					}
				})
			},
			openCoin() {
				this.isShowCoin = !this.isShowCoin
			},
			choseCoin(item, index) {
				this.form.from_account = index
				this.isShowCoin = false
				this.isChangeCoin = true
				this.curCoinName = item.coin_name
				this.getExchangeCoinRate()
				this.fundAccount()
			},
			openToCoin() {
				this.isShowToCoin = !this.isShowToCoin
			},
			choseToCoin(item, index) {
				this.form.to_account = index
				this.isShowToCoin = false
				this.isChangeCoin = true
				this.curToCoinName = item.coin_name
				this.getExchangeCoinRate()
			},
			exChange() {
				let num = this.consume
				let get = this.consume * this.rate
				let tips = this.$t('base.e14') + num + this.coinList[this.form.from_account].coin_name + this.$t('base.e15') + get + this.coinList[
					this.form.to_account].coin_name + "?"
				if (this.consume == 0) {
					uni.showToast({
						title: 'Please enter the exchange amount',
						icon: 'none'
					})
				} else {
					uni.showModal({
						cancelText: this.$t('base.e18'),
						confirmText: this.$t('base.e17'),
						title: this.$t('base.e19'),
						content: tips,
						success: (res)=> {
							if (res.confirm) {
								Exchange.submitExchange({
									from_coin_name:this.coinList[this.form.from_account].coin_name,
									to_coin_name:this.coinList[this.form.to_account].coin_name,
									amount:this.consume
								}).then(res=>{
									uni.showToast({
										title:res.message,
										icon:'none'
									})
									setTimeout(()=>{
										this.fundAccount()
									},500)
								})
							} else if (res.cancel) {
								
							}
						}
					})
				}

				
			},
			fundAccount() {
				Wallet.fundAccount().then((res) => {
					this.account = res.data.list;
					this.account.forEach((item) => {
						if (item.coin_name == this.coinList[this.form.from_account].coin_name) {
							this.curAmount = item.usable_balance
						}
					})
				});
			},
			intMax() {
				this.consume = this.curAmount
				this.uget = (this.consume * this.rate).toFixed(8)
			}
		},

	};
</script>
<style lang="scss" scoped>
	.nav-head {
		position: absolute;
		left: 0;
		width: 100%;

		// background: transparent;
		&::after {
			border: none;
		}
	}

	.top {
		// background: linear-gradient(180deg, #c86b49, $theme-1);
		height: 150px;
	}

	.panel-box {
		margin-top: -70px;
		position: relative;

		.line {
			position: absolute;
			height: 100%;
			width: 1px;
			background: $border-color;
			transform: scale(0.5);
			top: 0;

			&::before,
			&::after {
				content: "";
				display: inline-block;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				width: 12px;
				height: 12px;
				border-radius: 50%;
			}

			&::before {
				top: 0;
				background: $blue;
			}

			&::after {
				bottom: 0;
				background: $red;
			}
		}

		.exchange {
			position: absolute;
			left: 50%;
			top: 50%;
			height: 40px;
			width: 40px;
			border-radius: 50%;
			transform: translateY(-50%, -50%);
		}

		.int-item {
			border-bottom: 1px solid #9FA6B5;

			.tit {
				margin-bottom: 10px;
			}

			input {
				line-height: 30px;
				height: 30px;
				flex: 1;
			}

			.currency {
				width: 25%;
			}

			.max {
				margin-right: 20rpx;
				color: #5A7BEF;
			}
		}

		.info-item {
			justify-content: space-between;
			height: 80rpx;
			align-items: center;
			margin-bottom: 60px;
		}
	}

	.mg-20 {
		margin: 20px auto;
	}
</style>
