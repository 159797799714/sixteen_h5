
let config = {};
if (process.env.NODE_ENV == 'production'||true) { //生产环境
    config = {
        // ajax地址
        baseUrl: 'https://api.mufgncw.com',
        // 图片地址 （暂时无用）
        imgUrl: 'https://api.mufgncw.com/storage',
        // socket地址
        socketUrl: 'wss://api.mufgncw.com/ws1',
        socketUrl1: 'wss://api.mufgncw.com/ws2',
        // pc端地址
        pcUrl:'https://www.mufgncw.com',
        // app名称
        appName: 'MUFG',
        // 版本
        version: '1.0.0',
        // 移动端地址
        mobile: 'https://mobile.mufgncw.com'
    };
} else { //开发环境
    config = {
        baseUrl: 'http://api.mufgncw.com',
        imgUrl: 'http://api.mufgncw.com/upload',
        socketUrl: 'wss://api.mufgncw.com/ws1',
        socketUrl1: 'wss://api.mufgncw.com/ws2',
        // pc端地址
        pcUrl:'https://www.mufgncw.com',
        // app名称
        appName: '本地开发',
        // 版本 
        version: '0.0.0',
        // 移动端地址
        mobile: 'https://mobile.mufgncw.com'
    }
    // config = {
    //     // ajax地址
    //     baseUrl: 'https://server.7coin.in',
    //     // 图片地址 （暂时无用）
    //     imgUrl: 'https://server.7coin.in/upload',
    //     // socket地址
    //     socketUrl: 'wss://server.7coin.in:2346/',
    //     socketUrl1: 'wss://server.7coin.in:2348/',
    //     // pc端地址
    //     pcUrl:'https://www.7coin.in',
    //     // app名称
    //     appName: '7COIN test',
    //     // 版本
    //     version: '1.0.0',
    //     // 移动端地址
    //     mobile: 'https://h5.7coin.in'
    // };
}
export default config;