import { axios } from '../utils/request'
import { EVENT_MODULE } from './_prefix'

type AddInfo = {
    name: string,
    eventStartTime: Date,
    eventEndTime: Date,
    enrollStartTime: Date,
    enrollEndTime: Date,
    recruitNumber: number,
    location: string,
    type: string,
    contactPeople: string,
    contactPhone: string,
}

type UpdateInfo = {
    id: number,
    name: string,
    eventStartTime: Date,
    eventEndTime: Date,
    enrollStartTime: Date,
    enrollEndTime: Date,
    recruitNumber: number,
    location: string,
    type: string,
    contactPeople: string,
    contactPhone: string,
}
// 如果有“Vue: This may be converted to an async function”警告，可以不管


// 新建文章
export const addEvent = (addInfo: AddInfo) => {
    return axios.post(`${EVENT_MODULE}/add`, addInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res
        })
}

export const updateEvent = (updateInfo: UpdateInfo) => {
    return axios.post(`${EVENT_MODULE}/update`, updateInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res
        })
}

export const deleteEvent = (eventId: number) => {
    return axios.delete(`${EVENT_MODULE}/delete/${eventId}`)
        .then(res => {
            return res
        })
}

export const getAllEvent = () => {
    return axios.get(`${EVENT_MODULE}/all`)
        .then(res => {
            return res
        })
}

export const getEvent = (eventId: number) => {
    return axios.get(`${EVENT_MODULE}/get/${eventId}`)
        .then(res => {
            return res
        })
}

export const adminGetEvent = () => {
    return axios.get(`${EVENT_MODULE}/getMine`)
        .then(res => {
            return res
        })
}
