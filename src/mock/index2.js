import Mock from "mockjs";
function generatePhoneNumbers(n) {
    let phoneNumbers = [];
    for (let i = 0; i < n; i++) {
        phoneNumbers.push(Mock.mock('@integer(13000000000, 13999999999)').toString());
    }
    return phoneNumbers;
}
function generateAddresses(n) {
    let addresses = [];
    for (let i = 0; i < n; i++) {
        addresses.push(Mock.mock('@county(true)'));
    }
    return addresses;
}
let data = Mock.mock({
    "data|6": [ //生成6条数据 数组
        {
                "name": "@cname", //生成用户名，都是中国人的名字
                "role": 'CUSTOMER',
                "phone": "@integer(13000000000, 13999999999)", //生成电话号码
                "address": "@county(true)", //生成地址
                "receivePhone": generatePhoneNumbers(10), //生成接收电话的字符串列表
                "receiveAddress": generateAddresses(5), //生成接收地址的字符串列表
                "storeId": "@id", //生成随机storeId
                "createTime": "@datetime", //生成创建时间
            
        }
    ]
})
// Mock.mock(/api\/users/, 'get', () => {
//      //三个参数。第一个：路径，第二个：请求方式post/get，第三个：回调，返回值
//     return data.data 
// })


//个人页面