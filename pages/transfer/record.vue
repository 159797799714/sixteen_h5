<template>
	<div class="layout-page" :style="themeStyle">
		<v-header :title="$t('base.e10')"></v-header>
		<v-scroll class="layout-main" @ref="ref" @load="load">
			<ul class="list">
				<div class="item bg-panel-4 m-x-md m-y-xs rounded-sm box-shadow " v-for="item in list"
					:key="item.datetime">
					<div class="wrap d-flex align-center">
						<div class="coin d-flex align-center">
							<img :src="item.coin_icon" alt="">
							{{item.coin_name}}
						</div>
						<div class="type">
							{{item.log_type == 'exchange_coin_out' ? $t('base.e20') : $t('base.e21')}}
						</div>
					</div>
					<div class="time">
						{{item.created_at}}
					</div>
					<div class="number">
						{{item.amount}}
					</div>
				</div>
			</ul>
		</v-scroll>
	</div>
</template>
<script>
	import Exchange from "@/api/exchange.js";
	import date from "@/utils/class/date.js";
	import {
		mapGetters
	} from "vuex";
	export default {
		name: "bill",
		data() {
			return {
				list: [],
				page: 0,
				accountMap: {
					UserWallet: this.$t('transfer.a4'),
					ContractAccount: this.$t('transfer.a5'),
					FinancialAccount: this.$t('transfer.a7'),
				},
			};
		},
		computed: {
			...mapGetters(['themeStyle'])
		},
		methods: {
			parseTime: date.parseTime,
			ref(over) {
				this.page = 1;
				this.transferRecord(over);
			},
			load(over) {
				this.page++;
				this.transferRecord(over);
			},
			transferRecord(over) {
				let data = {
					page: this.page,
				};
				Exchange.getExchangeRecord(data).then((res) => {
					if (res.data.current_page == 1) this.list = [];
					this.list = [...this.list, ...res.data.list];
					over && over({
						finished: res.data.list.length < res.data.per_page
					});
				});
			},
		},
		created() {},
	};
</script>
<style lang="scss">
	.item{
		padding: 20rpx;
		position: relative;
		box-sizing: border-box;
		.wrap{
			// justify-content: space-between;
			.coin{
				width: 40%;
				img{
					width: 40rpx;
					margin-right: 20rpx;
				}
			}
			.type{
				width: 30%;
			}
		}
		.number{
			position: absolute;
			right: 20rpx;
			top: 50%;
			transform: translateY(-50%);
			font-size: 36rpx;
		}
		.time{
			margin-top: 20rpx;
			font-size: 24rpx;
		}
	}
</style>