import {axios} from '../utils/request'
import {REGISTER_MODULE} from './_prefix'
type AddInfo = {
    eventId: number,
    userId: number,
}
export const addApplication = (addInfo: AddInfo) => {
    return axios.post(`${REGISTER_MODULE}/register`,addInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}