
import Serve from '@/api/serve'

class Subscribe {
    /**
     * 请求数据
    */
    static subscribeTokenList(data){
        return Serve.post('/user/subscribeTokenList',data)
    }
   static subscribe(data){
       return Serve.post('/user/subscribe',data)
   }
    /**
     * 提交数据
     * @param {object} data
     * @param {string} data.amount
     * @param {string} data.coin_name
    */
   static subscribeNow(data){
        return Serve.post('/user/subscribeNow',data)
   }
}

export default Subscribe;