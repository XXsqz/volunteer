import { axios } from '../utils/request'
import { ARTICLE_MODULE } from './_prefix'

type AddInfo = {
    title: string,
    author: string,
    content: any,
    abstracts: string,
    eventId: number, // 示例 EventId，可根据实际需求动态获取
    mainImage: string,
    images: string[], // 图片 URL 列表
    isDraft: boolean
}

type UpdateInfo = {
    id: number,
    userId: number,
    title: string,
    author: string,
    content: any,
    abstracts: string,
    eventId: number, // 示例 EventId，可根据实际需求动态获取
    mainImage: string,
    images: string[], // 图片 URL 列表
    isDraft: boolean
}
// 如果有“Vue: This may be converted to an async function”警告，可以不管


// 新建文章
export const addArticle = (addInfo: AddInfo) => {
    return axios.post(`${ARTICLE_MODULE}/add`, addInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res
        })
}

export const updateArticle = (updateInfo: UpdateInfo) => {
    return axios.post(`${ARTICLE_MODULE}/update`, updateInfo,
        { headers: { 'Content-Type': 'application/json' } })
        .then(res => {
            return res
        })
}

export const deleteArticle = (articleId: number) => {
    return axios.delete(`${ARTICLE_MODULE}/delete/${articleId}`)
        .then(res => {
            return res
        })
}

export const getAllArticle = () => {
    return axios.get(`${ARTICLE_MODULE}/all`)
        .then(res => {
            return res
        })
}

export const getArticle = (articleId: number) => {
    return axios.get(`${ARTICLE_MODULE}/get/${articleId}`)
        .then(res => {
            return res
        })
}

export const adminGetArticle = () => {
    return axios.get(`${ARTICLE_MODULE}/getMine`)
        .then(res => {
            return res
        })
}

export const adminGetDraft = () => {
    return axios.get(`${ARTICLE_MODULE}/getDrafts`)
        .then(res => {
            return res
        })
}

