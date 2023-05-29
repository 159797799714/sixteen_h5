<style>
	._time_cells{ padding: 5px 0 20px; }
	._time_cells ._cell{ display: inline-block; width: 33%; }
	._time_cells ._wrap{ margin: 5px 5px 0 0; height: 28px; line-height: 28px; text-align: center; font-size: 12px; border: 1px solid #484859; border-radius: 3px; }
	._time_cells ._current{ color: #fff; border-color: #fff; }
	td /deep/ .van-count-down{font-size: 12px !important;}
</style>
<template>
  <view>
    <view class="d-flex p-md justify-between align-center fn-18 color-light">
      <view @click="$emit('symbol')">
        <i class="iconfont color-theme-1">&#xe655;</i>
        {{ symbol }}
      </view>
      <view class="d-flex fn-20 color-theme-1">
        <!-- foucs -->
        <view class="m-r-xs" @click="$emit('option')">
          <van-icon v-if="isCoolect" name="star" />
          <van-icon v-else class="color-light" name="star-o" />
        </view>
        <v-link
          v-if="symbol"
          tag="div"
          class="m-r-sm"
          :to="{
            path: '/pages/exchange/index',
            query: { code: symbol, contract: 1 },
          }"
        >
          <van-icon name="chart-trending-o" />
        </v-link>
        <!-- <van-icon name="weapp-nav" @click="show = true" /> -->
      </view>
    </view>
    <!-- <view
      class="m-b-md p-md bg-form-panel-3 fn-sm m-x-md rounded-sm d-flex justify-between"
    >
      <view class="item">
        <view class="label">{{ $t("contract.d4") }}(USDT)</view>
        <view class="num fn-md color-light m-t-md">{{
          accountInfo.account_equity || "--"
        }}</view>
      </view>
      <view class="item">
        <view class="label">{{ $t("contract.d5") }}(USDT)</view>
        <view class="num fn-md color-light m-t-md">{{
          accountInfo.totalUnrealProfit
        }}</view>
      </view>
      <view class="item fn-right">
        <view class="label">
          {{ $t("contract.d6") }}
          <van-icon class="fn-xs color-theme-1 m-l-xs" name="info-o" />
        </view>
        <view class="num fn-md color-light m-t-md">{{
          accountInfo.riskRate || "0%"
        }}</view>
      </view>
    </view> -->
    <view class="d-flex">
      <view class="w-6/12 p-l-md box-size">
		  
        <view class="m-b-xs">
          <view class="label fn-sm m-b-xs">{{ $t("second.amount") }}</view>
        </view>
        <view>
          <v-input
            :placeholder="$t('second.amount')"
            v-model="secondFormValue.price"
            class="h-30 p-x-xs rounded-xs bg-form-panel-4"
			/>
        </view>
		
        <view class="m-b-xs" style="margin-top: 20px;">
          <view class="label fn-sm m-b-xs">{{ $t("second.time") }}</view>
        </view>
        <view>
          <v-input
            :placeholder="$t('second.time')"
            v-model="secondFormValue.seconds"
            class="h-30 p-x-xs rounded-xs bg-form-panel-4"
			/>
        </view>
		
		<view class="_time_cells">
			<view class="_cell" v-for="(time,index) in timeItems" :key="index">
				<view v-if="time.status" class="_wrap" :class="secondFormValue.seconds==time.seconds?'_current':''" @click="timeIndex=index;secondFormValue.seconds=time.seconds;profitRate=time.profitRate;">{{time.seconds}}</view>
			</view>
		</view>
		
		
        <view class="d-flex fn-sm m-b-xs color-light justify-between">
          <span class="color-default">1={{ $t("second.price") }}</span>
          <span>{{ newPrice.price }}</span>
        </view>
        <view class="d-flex fn-sm m-b-xs color-light justify-between">
          <span class="color-default">{{ $t("second.balance") }}</span>
          <span>{{ balance }}</span>
        </view>
        <view class="d-flex fn-sm m-b-xs color-light justify-between">
          <span class="color-default">{{ $t("second.wlratio") }}</span>
          <span>{{ profitRate }}%</span>
        </view>
		
		
        <view class="m-b-xs" style="margin-top: 20px;">
          <v-button
            type="green"
            ref="btn1"
            @click="doSecondSubmit(1)"
            size="small"
            block
            class="w-max rounded-xs"
          >
            {{ $t("second.buyUp") }}
          </v-button>
        </view>
        <view class="m-b-xs">
          <v-button
            type="red"
            ref="btn2"
            @click="doSecondSubmit(-1)"
            size="small"
            block
            class="w-max rounded-xs"
          >
            {{ $t("second.buyDown") }}
          </v-button>
        </view>

      </view>
      <view class="w-6/12 p-r-md p-l-md box-size">
        <sell-and-buy
          @price="form.entrust_price = $event"
          :sellList="sellList"
          :buyList="buyList"
        >
          <view class="fn-lg color-buy">{{ newPrice.price }}</view>
        </sell-and-buy>
      </view>
    </view>
    <view class="h-20"></view>
    <!-- <trade-list :tradeList="tradeList" /> -->

	

<!-- 订单 -->
<view class="p-md">
<view class="color-light fn-16">
	<text :style="orderTabIndex==0?'':'opacity: .6;'" @click="orderTabIndex=0;orderCloseStatus=0;getOrders();">{{$t('second.orderTitle')}}</text>
	<text :style="orderTabIndex==1?'':'opacity: .6;'" @click="orderTabIndex=1;orderCloseStatus=1;getOrders();" style="margin-left: 40px;">{{$t('second.orderTitle2')}}</text>
</view>
<table class="w-max">
  <thead class="fn-xs">
	<tr style="text-align: center;">
	  <td class="p-y-xs">{{$t('second.orderSymbol')}}</td>
	  <td class="p-y-xs ">{{$t('second.orderType')}}</td>
	  <td class="p-y-xs">{{$t('second.orderAmount')}}</td>
	  <td class="p-y-xs">{{$t('second.orderPrice')}}</td>
	  <td v-if="orderTabIndex==1" class="p-y-xs">{{$t('second.closePrice')}}</td>
	  <td class="p-y-xs">{{$t('second.orderWlratio')}}</td>
	  <td v-if="orderTabIndex==0" class="p-y-xs">{{$t('second.orderTimer')}}</td>
	</tr>
  </thead>
  <tbody class="color-light trade-list">
	<tr v-if="!orderItems.length">
		<td colspan="6">
			<van-empty :description="$t('contract.d0')" />
		</td>
	</tr>
	<tr v-else v-for="(item,index) in orderItems" :key="index" style="text-align: center; font-size: 12px;" @click="showOrder(item)">
	  <td class="p-y-xs">{{filterOrderSymbol(item.symbol)}}<text style="font-size: 10px; margin-left: 4px;">{{item.seconds}}s</text></td>
	  <td class="p-y-xs">
		  <text class="color-buy" v-if="item.direction == 1">{{$t("second.buyUp")}}</text>
		  <text class="color-sell" v-if="item.direction == -1">{{$t("second.buyDown")}}</text>
	  </td>
	  <td class="p-y-xs">{{item.price}}</td>
	  <td class="p-y-xs">{{item.openPrice}}</td>
	  <td v-if="orderTabIndex==1" class="p-y-xs">{{item.closePrice}}</td>
	  
	  <td v-if="orderTabIndex==0" class="p-y-xs">{{item.estimateProfit}}</td>
	  <td v-if="orderTabIndex==1" class="p-y-xs">
		   <text class="color-buy" v-if="item.status == 1">+{{item.profit}}</text>
		   <text class="color-sell" v-if="item.status == -1">{{item.profit}}</text>
	  </td>
	  
	  <td v-if="orderTabIndex==0" class="p-y-xs">
		  <van-count-down :time="item.timer" format="mm:ss" @finish="countDownFinish" />
	  </td>
	</tr>
  </tbody>
</table>
</view>

<view style="height: 80px;"></view>


<!-- 订单详细 -->
<van-dialog
  use-slot
  :title="filterOrderSymbol(orderDetail.symbol)"
  :show="orderDetailVisible"
  :showConfirmButton="false"
>


	<view style="margin: 20px auto 0; text-align: center; color: #fff; position: relative;">
		<!-- <van-circle v-if="orderDetailVisible"
		  v-model="orderDetail.surplus"
		  :rate="orderDetail.seconds"
		  stroke-width="5"
		  layer-color="#eeeeee"
		  color="#F15887"
		  size="150"
		>
		</van-circle> -->

	<cmd-circle type="circle" :percent="orderDetail.surplus / orderDetail.seconds * 100" :showInfo="false" :width="150" :stroke-width="5" stroke-shape="round" stroke-color="#F15887" stroke-background="#eeeeee"></cmd-circle>
		
		<!-- orderDetail.surplus -->
		<view style="width: 150px; height: 150px; line-height: 24px; text-align: center; color: #fff; position: absolute; top: 50%;  left: 50%; margin: -75px 0 0 -72px; ">
			<view style="padding:35px 0 5px;">	
				<van-count-down v-if="orderDetailVisible" use-slot :time="orderDetail.timer" format="yyyy/mm/dd hh:mm:ss" @change="timerChange" @finish="timerFinish">
				  <text class="item">{{ orderDetail.timerM }}:</text>
				  <text class="item">{{ orderDetail.timerS }}</text>
				</van-count-down>
			</view>
			<view>{{$t("second.nowPrice")}}</view>
			<view style="color: #2FAD66; font-size: 18px; font-weight: bold;">{{orderDetail.nowPrice||orderDetail.openPrice}}</view>
		</view>
	</view>

    <view style="margin: 20px; padding: 0 20px; line-height: 40px; color: #fff; font-size: 14px; background-color: rgba(0,0,0,.15); border-radius: 10px;">
      <view class="d-flex justify-between">
		  <view>{{$t('second.orderType')}}</view>
		  <view v-if="orderDetail.direction == 1" class="color-buy">{{$t("second.buyUp")}}</view>
		  <view v-if="orderDetail.direction == -1" class="color-sell">{{$t("second.buyDown")}}</view>
	  </view>
      <view class="d-flex justify-between">
		  <view>{{$t('second.orderAmount')}}</view>
		  <view>{{orderDetail.price}}</view>
	  </view>
      <view class="d-flex justify-between">
		  <view>{{$t('second.orderPrice')}}</view>
		  <view>{{orderDetail.openPrice}}</view>
	  </view>
      <view class="d-flex justify-between">
		  <view>{{$t('second.orderWlratio')}}</view>
		  <view>{{orderDetail.estimateProfit}}</view>
	  </view>
	</view>

	<v-button type="green" block @click="orderDetailVisible = false">{{$t('second.close')}}</v-button>
</van-dialog>


  </view>
</template>
<script>
import sellAndBuy from "@/pages/exchange/sell-and-buy";
import tradeList from "@/pages/exchange/trade-list";
import Contract from "@/api/contract";
import Second from "@/api/second";
import Wallet from "@/api/wallet";
import math from "@/utils/class/math";
import { mapState } from "vuex";
import lodash, { forEach, set } from "lodash";
// import bingProgress from "@/components/bing-progress/bing-progress.vue";
import cmdCircle from "@/components/cmd-circle/cmd-circle.vue"
export default {
  name: "open-position",
  components: {
    sellAndBuy,
    tradeList,
    // bingProgress,
	cmdCircle,
  },
  props: {
    query: {
      default: () => {},
      type: Object,
      required: false,
    },
    collect: {
      default: () => [],
      type: Array,
      required: false,
    },
    isShow: {
      default: false,
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      sellList: [],
      buyList: [],
      tradeList: [],
      show: false,
      accountInfo: {},
      // 杠杆倍数
      lever_rage: [],
      // 最多可开张数
      maxNum: 0,
      form: {
        type: 2,
        entrust_price: "",
        amount: "",
        lever_rate: "",
      },
      unSymbol: "",
      newPrice: {},
      dtime: null,
      unit_amount: 1,
	  
	  timeIndex:0,
	  timeItems:[],

	  secondFormValue:{
		  seconds:'',
		  direction:1, // 方向：1 买涨 -1 买跌
		  openPrice:'', // 下单时的币币价格
		  price:'', // 开仓数量
		  symbol:'', // btcusdt
		  userId:'',
	  },
	  
	  balance:0,
	  profitRate:0,
	  
	  orderTabIndex:0,
	  orderCloseStatus:0, // 0未平仓 1已平仓
	  orderItems:[],
	  
	  differSecond:0, //服务器与本地相差的毫秒秒数
	  
	  orderDetailVisible:false,
	  orderDetail:{},
    };
  },
  computed: {
    commissionTypes() {
      return [
        { label: this.$t("contract.f5"), value: 1 },
        { label: this.$t("contract.f6"), value: 2 },
      ];
    },
    ...mapState({
      ws: "ws1",
    }),
    symbol() {
      return this.query.symbol;
    },
    symbolLeft() {
      if (!this.symbol) return "";
      return this.symbol.split("/")[0];
    },
    // 是否为自选
    isCoolect() {
      return this.collect.map((item) => item.pair_name).includes(this.symbol);
    },
    // 选中的委托类型
    activeCommission() {
      return this.commissionTypes.find((item) => this.form.type == item.value);
    },
    // 保证金
    margin() {
      return math.omitTo(
        (this.form.amount * this.unit_amount) / this.form.lever_rate,
        4
      );
    },
    // 所占百分比
    activeStep() {
      return (this.form.amount / this.maxNum) * 100;
    },
    isLogin() {
      return Boolean(uni.getStorageSync("token"));
    },
  },
  watch: {
    symbol() {
      if (this.unSymbol) {
        this.unLink(this.unSymbol);
      }
      this.getMarketInfo();
      this.contractAccount();
      this.getSymbolDetail();
    },
    // 当前页面显示就订阅
    isShow(n) {
      if (n) {
        this.getMarketInfo();
        this.openNum();
      } else {
        if (this.unSymbol) {
          this.unLink(this.unSymbol);
        }
      }
    },
  },
  methods: {
	  countDownFinish(){
          setTimeout(()=>{
             this.getOrders() 
          },1500)
	  },
	  filterOrderSymbol(symbol){
		  if (!symbol){
			  return  symbol
		  }
		  
		  let _symbol = symbol.toUpperCase()
		  return _symbol.replace("USDT","/USDT")
	  },
    getConfig() {
      Second.getConfig().then((res) => {
        if (res&&res.rows&&res.rows.length){
			this.timeItems=res.rows
			
			this.timeIndex=0;
			this.secondFormValue.seconds=res.rows[0].seconds;
			this.profitRate=res.rows[0].profitRate;
		}
      });
    },
	getBalance() {
	  Wallet.getBalance({
	    account: 1,
	    coin_name: 'USDT',
	  }).then((res) => {
	    if (res&&res.data&&res.data.usable_balance){
			this.balance=res.data.usable_balance
		}
	  });
	},
	doSecondSubmit(direction){
		// 最小值判断
		if (this.secondFormValue.price < this.timeItems[this.timeIndex].minAmount){
			this.$toast(this.$t("second.amountConfirm")+this.timeItems[this.timeIndex].minAmount);
			return false;
		}

      this.$dialog.confirm({
        title:direction==1?this.$t("second.buyUp"):this.$t("second.buyDown"),
        message:this.$t('second.amount')+'：'+this.secondFormValue.price+'\n'+this.$t("second.time")+'：'+this.secondFormValue.seconds+'\n'+this.$t('second.confirmOrder'),
		cancelButtonText: this.$t('common.cancelButtonText'),
		confirmButtonText:this.$t('common.confirmButtonText')
      }).then(()=>{
		this.doSecond(direction)
      })
	},
	doSecond(direction){
		this.secondFormValue.direction=direction;
		this.secondFormValue.symbol=this.symbol.replace("/","");
		this.secondFormValue.userId=this.$store.getters.user.user_id;
		this.secondFormValue.openPrice=this.newPrice.price
		
		Second.createOrder(this.secondFormValue).then((res) => {
			if (res&&res.data){
				this.$toast(this.$t("second.success"));
				this.showOrder(res.data)
				this.getOrders()
			}
		});
	},
	getOrders(){
	  Second.getOrders({
		  userId:this.$store.getters.user.user_id,
		  closeStatus:this.orderCloseStatus,
	  }).then((res) => {
		  this.orderItems=[]
		  if(res&&res.rows&&res.rows.length){
			  res.rows.forEach((item)=> {
			   item.timer = this.countTimerSecond(item)
			  })
			  this.orderItems=res.rows
		  }
	  });
	},
	showOrder(order){
		if (order.closeStatus == 1){
			return
		}
		
		order.timer = this.countTimerSecond(order)
		this.orderDetail=order;
		this.orderDetailVisible=true;
		this.getMarketList(order)
	},
	getMarketList(order){
		if (this.orderDetailVisible && order.closeStatus != 1){
			setTimeout(()=>{
				Contract.getMarketList().then((res) => {
					if (res&&res.data&&res.data.length&&res.data[0].marketInfoList&&res.data[0].marketInfoList.length){
						let item = res.data[0].marketInfoList.find((val) => val.pair_name.replace("/","") == order.symbol);
						if (item&&item.id){
							this.orderDetail.nowPrice=item.price
						}
					}
				});
				this.getMarketList(order)
			},1000)
		}
	},
	countTimerSecond(item){
	   if (item.closeStatus == 1){
		   return 0
	   } else {
		   // 先计算differSecond是因为弹框倒计时需要
		   var nowDate=new Date().getTime()
		   if (this.differSecond == 0){
			   var serDate=new Date(item.serverTime.replace(/-/g,'/')).getTime();
			   this.differSecond = Math.floor((nowDate-serDate))
		   }
		   
		  var creDate=new Date(item.createdTime.replace(/-/g,'/')).getTime()+(item.seconds*1000)+this.differSecond;
		  var times=Math.floor((creDate-nowDate));
		  return times
	   }
	},
	timerChange(value){
		this.$set(this.orderDetail, 'timerM', value.detail.minutes)
		this.$set(this.orderDetail, 'timerS', value.detail.seconds)
		this.$set(this.orderDetail, 'surplus', value.detail.minutes*60+value.detail.seconds)
	},
	timerFinish(){
		this.orderDetailVisible=false;
		// this.countDownFinish()
	},
    // 获取买卖盘
    getMarketInfo() {
      let data = {
        symbol: this.symbolLeft,
      };
      Contract.getMarketInfo(data,{loading:true}).then((res) => {
        this.sellList = res.data.swapSellList;
        this.buyList = res.data.swapBuyList;
        this.tradeList = res.data.swapTradeList;
        this.newPrice = this.tradeList[0] || {};
        this.form.entrust_price = this.newPrice.price;
		this.secondFormValue.openPrice = this.newPrice.price;
        this.linkSocket(data.symbol);
      });
    },
    // 获取合约账户信息
    contractAccount(boo) {
      if (!this.isLogin) return;
      if (!this.isShow) return;
      let data = {
        symbol: this.symbolLeft,
      };
      Contract.contractAccount(data, { loading: !boo,toast:false }).then((res) => {
        this.accountInfo = res.data;
        if (!boo) {
          this.form.lever_rate = res.data.lever_rate;
          if (this.form.lever_rate) {
            this.openNum();
          }
        }
      });
    },
    // 获取合约详情
    getSymbolDetail() {
      if (!this.symbolLeft) return;
      let data = {
        symbol: this.symbolLeft,
      };
      Contract.getSymbolDetail(data).then((res) => {
        this.unit_amount = res.data.unit_amount;
        if (!this.lever_rage.length) {
          this.lever_rage = res.data.lever_rage.map((item) => ({
            label: item,
            value: item,
          }));
        }
        this.$emit("getSymbolDetail", res.data);
        if (!this.form.lever_rate) {
          this.form.lever_rate = this.lever_rage[0].value;
          this.openNum();
        }
      });
    },
    // 获取可开启张数
    openNum() {
      if (!this.isLogin) return;
      let data = {
        symbol: this.symbolLeft, //ETH
        lever_rate: this.form.lever_rate, //10
      };
      Contract.openNum(data,{toast:false}).then((res) => {
        this.maxNum = res.data;
      });
    },
    // 开仓提示
    ifOpenPosition(side) {
    //   this.$dialog
    //     .confirm({
    //       title: this.$t("contract.c4"),
    //       message: `${this.$t("contract.f7")}${
    //         this.form.type == 1
    //           ? this.form.entrust_price
    //           : this.$t("contract.d7")
    //       }${this.$t("contract.f8")}${this.form.lever_rate}${this.$t(
    //         "contract.f9"
    //       )}${this.form.amount}${this.$t("contract.d8")}${
    //         side == 1 ? this.$t("contract.g0") : this.$t("contract.g1")
    //       }?`,
		  // // leftText:"a",
		  // // rightText:"b",
		  // // cancelText:"s", // 取消按钮的文字  
		  // // confirmText:"b", // 确认按钮文字 
		  // // okText:"a",
		  // // cancelText:"b"
    //     })
    //     .then(() => {
          this.openPosition(side);
        // });
    },
    // 开仓
    openPosition(side) {
      let data = {
        side,
        symbol: this.symbolLeft,
        ...this.form,
      };
      let btn;
      if (side == 1) {
        //开多
        btn = this.$refs.btn1;
      } else {
        // 开空
        btn = this.$refs.btn2;
      }
      Contract.openPosition(data, { btn }).then(() => {
        this.contractAccount();
        this.$toast(this.$t("contract.g2"));
      });
    },
    sliderChange($ev) {
      this.form.amount = Math.round((this.maxNum * $ev.value) / 100);
    },
    // 链接socket
    linkSocket(symbol) {
      this.unSymbol = symbol;
      // 订阅买线
      this.ws.send({
        cmd: "sub",
        msg: `swapBuyList_${symbol}`,
      });
      // 订阅卖线
      this.ws.send({
        cmd: "sub",
        msg: `swapSellList_${symbol}`,
      });
      // 订阅成交
      this.ws.send({
        cmd: "sub",
        msg: `swapTradeList_${symbol}`,
      });
    },
    // 取消订阅
    unLink(symbol) {
      // 取消买线
      this.ws.send({
        cmd: "unsub",
        msg: `swapBuyList_${symbol}`,
      });
      // 取消卖线
      this.ws.send({
        cmd: "unsub",
        msg: `swapSellList_${symbol}`,
      });
      // 取消成交
      this.ws.send({
        cmd: "unsub",
        msg: `swapTradeList_${symbol}`,
      });
    },
    socketMessage() {
      // 节流防抖
      let buyFun = lodash.throttle((data) => {
        this.buyList = data;
      }, 500);
      let sellFun = lodash.throttle((data) => {
        this.sellList = data.sort((a, b) => b.price - a.price);
      }, 500);
      this.ws.on("message", (res) => {
        if (!this.isShow) return;
        let symbol = this.symbolLeft;
        let { data, sub } = res;
        switch (sub) {
          case `swapBuyList_${symbol}`:
            buyFun(data);
            break;
          case `swapSellList_${symbol}`:
            sellFun(data);
            break;
          case `swapTradeList_${symbol}`:
            this.tradeList.unshift(data);
            this.tradeList.pop();
            this.newPrice = data;
            break;
        }
      });
    },
  },
  mounted() {
	  this.getConfig();
	  this.getBalance();
	  this.getOrders();
	  
    if (this.symbol) {
      this.getMarketInfo();
      this.contractAccount();
      this.getSymbolDetail();
    }
    this.socketMessage();
    this.dtime = setInterval(() => {
      this.contractAccount(true);
    }, 3000);
  },
  destroyed() {
    clearInterval(this.dtime);
    this.unLink(this.unSymbol);
  },
};
</script>
<style lang="scss" scoped>
::v-deep .van-step--horizontal {
  .van-step__circle-container {
    background-color: transparent;
    .van-icon-checked {
      width: 14px;
      height: 14px;
      position: relative;
      background: rgba($green, 0.7);
      font-size: 0;
      display: block;
      border-radius: 20px;
      bottom: 9px;
      &::after {
        content: "";
        display: block;
        font-size: 0;
        width: 8px;
        height: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: $green;
        border-radius: 20px;
      }
    }
  }
  .van-step__line {
    bottom: 8px;
  }
}
/deep/ .van-stepper {
  display: flex;
  justify-content: space-between;
  .minus-class,
  .input-class,
  .plus-class {
    background: $form-panel-4;
  }
}
</style>