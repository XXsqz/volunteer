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

export const deleteRegistration = (eventId: number) => {
    return axios.delete(`${REGISTER_MODULE}/delete/${eventId}`)
        .then(res => {
            return res
        })
}

export const getEventRegistrations = (eventId: number) => {
    return axios.get(`${REGISTER_MODULE}/get/${eventId}`)
        .then(res => {
            return res
        })
}

export const getRegistrationsExport = (eventId: number) => {
    return axios.get(`${REGISTER_MODULE}/export/${eventId}`, { responseType: 'blob' })
        .then(res => {
            return res
        })
}
