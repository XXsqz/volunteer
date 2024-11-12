import Mock from "mockjs";
let data = Mock.mock({
    "data|6": [ //生成6条数据 数组
        {
            "id|+1": 1, //生成商品id，自增1
            "name": "@cname", //生成商品名 ， 都是中国人的名字
            "type": 'FOOD',
            "price|30-1000": 30, //随机生成商品价格 在30-1000之间
            "storeId": "@id", //生成随机storeId
            "description": "@ctitle(20)", //生成商品描述，长度为20个汉字
            "imageUrl": ['https://blue-whale28.oss-cn-beijing.aliyuncs.com/PicsArt_05-28-11.56.00.png','https://blue-whale28.oss-cn-beijing.aliyuncs.com/PicsArt_04-23-03.29.19.png'], //生成1-5个随机图片，大小/背景色/字体颜色/文字信息
            "stock|1-100": 20, //生成1-100的随机库存数
            "score|1-5": 1, //随机生成1-5的评分
        }
    ]
})
// Mock.mock(/api\/products\/storeAll\/1/, 'get', () => {
//      //三个参数。第一个：路径，第二个：请求方式post/get，第三个：回调，返回值
//     return data
// })

//mock测试商店商品列表