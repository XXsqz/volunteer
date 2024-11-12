import {axios} from '../utils/request'
import { EXCEL_MODULE } from './_prefix';
type Store_ExcelInfo = {
    store_id: number;
}
type SelectInfo = {
    order_id: number[];
}   
export const getAllExcel = () => {
    return axios.get(`${EXCEL_MODULE}/all`)
        .then(res => {
        return res.data.result;
        })
        .catch(err => {
            console.error('获取报表失败:', err);
            throw err;
        });
}

export const getAllExcel_Store = (store_ExcelInfo: Store_ExcelInfo) => {
    return axios.get(`${EXCEL_MODULE}/store`,{params: store_ExcelInfo})
        .then(res => {
        return res.data.result;
        })
        .catch(err => {
            console.error('获取报表失败:', err);
            throw err;
        });
}

export const getSelectedExcel = (selectInfo: SelectInfo) => {
    const select = Object.entries(selectInfo).flatMap(([key, values]) => 
        Array.isArray(values) ? values.map(value => `${key}=${value}`) : `${key}=${values}`
    ).join('&');
    return axios.get(`${EXCEL_MODULE}/select?${select}`)
        .then(res => {
        return res.data.result;
        })
        .catch(err => {
            console.error('获取报表失败:', err);
            throw err;
        });
}