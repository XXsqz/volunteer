import { axios } from '../utils/request'
import { REGISTER_MODULE } from './_prefix'

type AddInfo = {
    //id: number,
    eventId: number,
    userId: number,
    //status: string,
    //registrationTime: Date,
}

type UpdateInfo = {
    id: number,
    eventId: number,
    userId: number,
    status: string,
    registrationTime: Date,

}

export const addApplication = (addInfo: AddInfo) => {
    console.log(addInfo)
    return axios.post(`${REGISTER_MODULE}/register`, addInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res
        })
}

// 获取个人参与的注册
export const getPersonalRegistrations = () => {
    return axios.get(`${REGISTER_MODULE}/personal`)
        .then(res => {
            return res
        })
}
