import { axios } from '../utils/request'
import { NOTIFY_MODULE } from './_prefix'

export type Notification = {
    id: number,
    userId: number,
    message: string,
    read: boolean,
}

export const getPersonalNotifications = () => {
    return axios.get(`${NOTIFY_MODULE}/getMine`)
        .then(res => {
            return res
        })
}

export const markNotificationAsRead = (notificationId: number) => {
    return axios.post(`${NOTIFY_MODULE}/read/${notificationId}`)
        .then(res => {
            return res
        })
}
