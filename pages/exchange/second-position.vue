<style>
	._time_cells{ padding: 5px 0 20px; }
	._time_cells ._cell{ display: inline-block; width: 33%; }
	._time_cells ._wrap{ margin: 5px 5px 0 0; height: 28px; line-height: 28px; text-align: center; font-size: 12px; border: 1px solid rgba(0, 0, 0, .4); border-radius: 3px; }
	._time_cells ._current{ color: rgba(255, 255, 255, .8); border-color: rgba(0, 0, 0, .4); background-color:  rgba(0, 0, 0, .4); }
	td /deep/ .van-count-down{font-size: 12px !important;}
</style>
<template>
  <view>
    <view class="d-flex p-md justify-between align-center fn-16 color-light">
      <view @click="$emit('symbol')">
        <i class="iconfont color-theme-1 fn-18">&#xe655;</i>
        {{ symbol }}
      </view>
      <view class="d-flex fn-20 color-theme-1">
        <!-- foucs -->
        <view class="m-r-xs" @click="$emit('option')">
          <van-icon v-if="isCoolect" name="star" />
          <van-icon v-else class="color-default" name="star-o" />
        </view>
        <v-link
          tag="div"
          v-if="symbol"
          :to="{ path: '/pages/exchange/index', query: { code: symbol } }"
        >
          <van-icon name="chart-trending-o" />
        </v-link>
      </view>
    </view>
    <view class="d-flex p-x-md p-b-md">
      <!-- 买卖表单 -->
      <view class="w-6/12">


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
          <span class="color-default">{{ $t("second.price") }}</span>
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
      <!-- 深度列表 -->
      <view class="w-6/12 p-l-md d-flex flex-col dep-list">
        <sell-and-buy :buyList="buyList" :max="symbol=='ABK/USDT'?14:7" :sellList="sellList" :symbol="symbol">
          <view
            class="fn-md row"
            :class="newPrice.increase < 0 ? 'color-sell' : 'color-buy'"
          >
            {{ newPrice.price }}
          </view>
          <view class="fn-xs" v-if="newPrice.price && price_cny">
            ≈{{ omitTo(newPrice.price * price_cny, 2) }}CNY
          </view>
        </sell-and-buy>
      </view>
    </view>

    

	

<!-- 订单 -->
<view class="p-md" style="margin-top: -30px;">
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
	  
	  <td v-if="orderTabIndex==0 && item.timer > 0" class="p-y-xs">
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


	<view style="margin: 20px auto 0; text-align: center; position: relative;">
		<!-- <van-circle v-if="orderDetailVisible"
		  v-model="orderDetail.surplus"
		  :rate="orderDetail.seconds"
		  stroke-width="5"
		  layer-color="#eeeeee"
		  color="#F15887"
		  size="150"
		>
		</van-circle> -->
	<view style="display: flex;justify-content: center;position: relative;">
	  <cmd-progress type="circle" :percent="orderDetail.surplus / orderDetail.seconds * 100" stroke-color="#F15887" :stroke-width="6" :width="150" :showInfo="false" stroke-background="#eeeeee"></cmd-progress>
	  <view style="position: absolute;text-align: center;top: 30%;">
		<view style="font-size:36rpx;">
			<van-count-down v-if="orderDetailVisible" use-slot :time="orderDetail.timer" format="yyyy/mm/dd hh:mm:ss" @change="timerChange" @finish="timerFinish">
			  <text class="item">{{ orderDetail.timerM }}:</text>
			  <text class="item">{{ orderDetail.timerS }}</text>
			</van-count-down>
		</view>
		<view style="">{{$t("second.nowPrice")}}</view>
	   <view style="color: #2FAD66; font-size: 18px; font-weight: bold;">{{newPrice.price}}</view>
	  </view>
	</view>
	</view>


	
	

    <view style="margin: 20px; padding: 0 20px; line-height: 40px; font-size: 14px; background-color: rgba(0,0,0,.08); border-radius: 10px;">
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
import timeSharing from "@/pages/exchange/time-sharing";
import Exchange from "@/api/exchange";
import Market from "@/api/market";
import Second from "@/api/second";
import Wallet from "@/api/wallet";
import date from "@/utils/class/date";
import math from "@/utils/class/math";
import { mapState } from "vuex";
import sellAndBuy from "@/pages/exchange/sell-and-buy";
import bingProgress from '@/components/bing-progress/bing-progress.vue'
import cmdCircle from "@/components/cmd-circle/cmd-circle.vue"
import cmdProgress from "@/components/cmd-progress/cmd-progress.vue"
export default {
  props: {
    collect: {
      default() {
        return [];
      },
      type: Array,
      required: false,
    },
    marketList: {
      defalut() {
        return [];
      },
      type: Array,
      required: false,
    },
    query: {
      default: {},
      type: Object,
      required: false,
    },
    isShow: {
      default: true,
      type: Boolean,
      required: false,
    },
  },
  components: {
    timeSharing,
    sellAndBuy,
    bingProgress
  },
  name: "second-position",
  data() {
    return {
      buyList: [],
      sellList: [],
      tradeList: [],
      form: {
        direction: "buy",
        type: 1,
        symbol: this.symbol,
        entrust_price: "",
        amount: "",
        trigger_price: undefined,
        total: "",
      },
      balanceMap: {},
      unSymbol: "",
      newPrice: {},
      price_cny: 0,
	  
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
	  balanceTimer:true,
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
    ...mapState({
      ws: "ws",
    }),
    isLogin() {
      return Boolean(uni.getStorageSync("token"));
    },
    symbol() {
      return this.query.symbol;
    },
    // 是否为自选
    isCoolect() {
      return this.collect.map((item) => item.pair_name).includes(this.symbol);
    },
    typeList() {
      return [
        {
          value: 1,
          label: this.$t("exchange.d6"),
        },
        {
          value: 2,
          label: this.$t("exchange.d7"),
        },
      ];
    },
    activeType() {
      return this.typeList.find((item) => item.value == this.form.type);
    },
    // 当前选中的coin
    activeCoin() {
      if (!this.marketList.length) return {};
      let list = [];
      this.marketList.forEach((parentItem) => {
        parentItem.marketInfoList.forEach((item) => {
          list.push(item);
        });
      });
      return list.find((item) => item.pair_name == this.symbol);
    },
    // 当前币种
    currentCoin() {
      if (!this.symbol) return "";
      return this.symbol.split("/")[0];
    },
    // 目标币种
    targetCoin() {
      if (!this.symbol) return "";
      return this.symbol.split("/")[1];
    },
    // 当前余额
    currentBalance() {
      return this.balanceMap[this.currentCoin] || {};
    },
    // 目标余额
    targetBalance() {
      return this.balanceMap[this.targetCoin] || {};
    },
    // 计算交易额
    totalMoney() {
      // todo
      let totalMoney = 0;
      if (this.form.type == 1) {
        totalMoney = math.multiple(this.form.amount, this.form.entrust_price);
      } else {
        totalMoney = this.form.amount;
      }
      return totalMoney;
    },
    // 显示百分比
    activeStep() {
      let num = 0;
      if (this.form.direction == "buy") {
        if (!this.targetBalance.usable_balance) return 0;
        num = this.totalMoney / this.targetBalance.usable_balance;
      } else if (this.form.direction == "sell") {
        if (!this.currentBalance.usable_balance) return 0;
        num = this.form.amount / this.currentBalance.usable_balance;
      }
      if (!isNaN(num)) {
        num = num.toFixed(3);
      }
      return num*100
    },
    // 可用数量
    usable() {
      if (this.form.direction == "buy") {
        if (!this.targetBalance.usable_balance) return 0;
        return this.omitTo(
          this.targetBalance.usable_balance,
          this.activeCoin.price_decimals
        );
      } else {
        if (!this.currentBalance.usable_balance) return 0;
        return this.omitTo(
          this.currentBalance.usable_balance,
          this.activeCoin.qty_decimals
        );
      }
    },

    // 可用单位
    usableUnit() {
      if (this.form.direction == "buy") {
        return this.targetCoin;
      } else {
        return this.currentCoin;
      }
    },
  },
  watch: {
    symbol(n, o) {
      this.getBooks();
      this.getUserBalance();
      if (o) {
        this.unLink(o.replace("/", "").toLocaleLowerCase());
      }
    },
    isShow(n) {
      if (n) {
        this.linkSocket(this.activeCoin.symbol);
      } else {
        this.unLink(this.activeCoin.symbol);
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
		
		if (this.balanceTimer){
			setTimeout(()=>{
			   this.getBalance() 
			},3000)
		}
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
	  	className:'_van_dialog',
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
				this.getBalance();
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

	  
	  
    parseTime: date.parseTime,
    omitTo: math.omitTo,
    // 计算滑动出来的金额
    sliderChange($ev) {
      let num = $ev.value/100;
   
      if (this.form.direction == "buy") {
        if (!this.targetBalance.usable_balance) return;
        if (this.form.type == 1) {
          this.form.amount = math.multiple(
            this.targetBalance.usable_balance / this.form.entrust_price,
            num,
            4
          );
        } else if (this.form.type == 2) {
          this.form.amount = this.form.amount = math.multiple(
            this.targetBalance.usable_balance,
            num,
            4
          );
        }
      } else if (this.form.direction == "sell") {
        if (!this.currentBalance.usable_balance) return;
        this.form.amount = math.multiple(
          this.currentBalance.usable_balance,
          num,
          4
        );
      }
    },
    // 提交订单
    storeEntrust() {
      let data = this.form;
      if (this.form.type == 1) {
        //限价
        if (!this.form.entrust_price) {
          this.$toast(this.$t("exchange.d8"));
          return;
        }
        if (!this.form.amount) {
          this.$toast(this.$t("exchange.d9"));
          return;
        }
      } else if (this.form.type == 2) {
        //市价
        this.form.total = this.form.amount;
        if (!this.form.total) {
          if (this.form.direction == "buy") {
            this.$toast(this.$t("exchange.e0"));
          } else {
            this.$toast(this.$t("exchange.d9"));
          }
          return;
        }
      }
      this.form.symbol = this.symbol;
      Exchange.storeEntrust(data, {
        btn: this.$refs.btn,
      })
        .then(() => {
          this.form.amount = "";
          this.form.total = "";
          this.$toast.success(this.$t("exchange.e1"));
          this.getUserBalance();
        })
        .catch(() => {});
    },
    // 获取列表
    getBooks() {
      if (!this.symbol) return;
      Market.getBooks({
        symbol: this.symbol,
      }).then((res) => {
        this.buyList = res.data.buyList;
        this.sellList = res.data.sellList;
        this.tradeList = res.data.tradeList;
        this.linkSocket(this.activeCoin.symbol);
        this.setChartData(this.tradeList);
        this.getDefaultPrice();
        this.newPrice = this.tradeList[0]||{};
      });
    },
    // 获取默认价格
    getDefaultPrice() {
      if (this.form.direction == "buy") {
        this.form.entrust_price = Math.min(
          ...this.tradeList.map((item) => item.price)
        );
      } else {
        this.form.entrust_price = Math.max(
          ...this.buyList.map((item) => item.price)
        );
      }
    },
    // 计算深度
    getValue(amount) {
      const arr = this.buyList.concat(this.sellList).map((item) => item.amount);
      let max = Math.max(...arr);
      return math.division(amount, max, 2) * 100;
    },
    selectType() {
      this.$picker(this.typeList, { value: this.form.type }).then((res) => {
        this.form.type = res;
      });
    },
    // 获取余额
    getUserBalance() {
      if (!this.symbol || !this.isLogin) return;
      Exchange.getUserBalance({
        symbol: this.symbol,
      }).then((res) => {
        this.balanceMap = { ...this.balanceMap, ...res.data };
      });
      this.getCurrencyExCny();
    },
    // 获取汇率
    getCurrencyExCny() {
      Exchange.getCurrencyExCny({
        coin_name: this.targetCoin,
      }).then((res) => {
        this.price_cny = res.data.price_cny;
      });
    },
    // 链接socket
    linkSocket(symbol) {
      this.unSymbol = symbol;
      // 订阅买线
      this.ws.send({
        cmd: "sub",
        msg: `buyList_${symbol}`,
      });
      // 订阅卖线
      this.ws.send({
        cmd: "sub",
        msg: `sellList_${symbol}`,
      });
      // 订阅成交
      this.ws.send({
        cmd: "sub",
        msg: `tradeList_${symbol}`,
      });
    },
    // 取消订阅
    unLink(symbol) {
      // 取消买线
      this.ws.send({
        cmd: "unsub",
        msg: `buyList_${symbol}`,
      });
      // 取消卖线
      this.ws.send({
        cmd: "unsub",
        msg: `sellList_${symbol}`,
      });
      // 取消成交
      this.ws.send({
        cmd: "unsub",
        msg: `tradeList_${symbol}`,
      });
    },
    socketMessage() {
      this.ws.on("message", (res) => {
        let symbol = this.activeCoin && this.activeCoin.symbol;
        let { data, sub } = res;

        switch (sub) {
          case `buyList_${symbol}`:
            this.buyList = data;
            break;
          case `sellList_${symbol}`:
            this.sellList = data.sort((a, b) => b.price - a.price);
            break;
          case `tradeList_${symbol}`:
            if(this.tradeList.length>20){
              this.tradeList.unshift(data);
              this.tradeList.pop();
            }else{
              this.tradeList.unshift(data)
            }
            this.addChartPoint(data);
            this.newPrice = data;
            break;
        }
      });
    },

    // 设置highChart
    setChartData(arr) {
      if (!this.$refs.highChart) return;
      let list = arr.map((item) => {
        return [item.ts, item.price];
      });
      this.$nextTick(() => {
        this.$refs.highChart.resetData(list);
      });
    },
    // 添加highChart点
    addChartPoint(obj) {
      if (!this.$refs.highChart) return;
      this.$refs.highChart.addPoint([obj.ts, obj.price]);
    },
  },
  mounted() {
	  this.getConfig();
	  this.getBalance();
	  this.getOrders();
	  
    this.getBooks();
    this.getUserBalance();
    this.socketMessage();
    if (this.query.direction) {
      this.form.direction = this.query.direction;
    }
  },
  destroyed() {
	  this.balanceTimer=false
    // this.unLink(this.unSymbol);
  },
};
</script>
<style lang="scss" scoped>
.custom-button {
  min-width: 26px;
  color: #fff;
  line-height: 18px;
  text-align: center;
  border-radius: 100px;
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
.dep-list {
  height: 440px;
  .row {
    position: relative;
    .proagess {
      position: absolute;
      right: 0;
      top: 0;
      transition: width 0.3s;
    }
  }
}
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
      &::after{
        content: '';
        display: block;
        font-size: 0;
        width: 8px;
        height: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        background: $green;
        border-radius: 20px;
      }
    }
  }
  .van-step__line {
    bottom: 8px;
  }
}
.trade-list{
  tr:nth-of-type(2n-1){
    box-shadow: $shadow;
    border-radius: $border-radius-xs;
    td{
      background: $panel-3;
    }
  }
}
</style>