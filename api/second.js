import Serve from '@/api/serve/index2'

class Contract {
    static getConfig(data) {
        return Serve.get(`/secondContract/configList`, data)
    }
    static getSymbol(data) {
        return Serve.get(`/secondContract/pairList`, data)
    }
    static getOrders(data) {
        return Serve.get(`/secondContract/contractList`, data)
    }
    static createOrder(data) {
        return Serve.get('/secondContract/add', data)
    }
}

export default Contract;