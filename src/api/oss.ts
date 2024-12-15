import { axios } from '../utils/request'

export const ossUpload = (data) => {
    return axios.post("/api/oss/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}
