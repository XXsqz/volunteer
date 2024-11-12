// Lab2新增
// 开发时请解除3-4行的注释
import {axios} from '../utils/request'
import {PAY_MODULE} from './_prefix'

type Keyinfo = {
    id: number,
    totalPrice: number,
    couponIds: number[],
}
export const getAlipay = (keyinfo: Keyinfo) => {
    const params = Object.entries(keyinfo).flatMap(([key, values]) => 
        Array.isArray(values) ? values.map(value => `${key}=${value}`) : `${key}=${values}`
    ).join('&');
    return axios.get(`${PAY_MODULE}/pay?${params}`)
    .then(res => {
        return res.data;
    })
    .catch(error => {
        console.error('获取支付页面失败', error);
        throw error;
    });
}
export const backAlipay = (keyinfo: {id: any}) => {
    return axios.get(`${PAY_MODULE}/refund`,{ params: keyinfo})
    .then(res => {
        console.log(res);
        return res.data;
    })
    .catch(error => {
        console.error('获取退款页面失败', error);
        throw error;
    });
}