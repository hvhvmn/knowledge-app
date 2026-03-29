import axios from "axios"
let api=axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api/items",
    withCredentials:true
})
export let saveAItem=async ({title,url,tags,type,notes}) => {
    let res=await api.post("/save",{title,url,notes,tags,type})
    return res.data
}
export let getAllItems=async () => {
    let res=await api.get("/all-items")
    return res.data
}
export let getOneItem=async (id) => {
    let res=await api.get(`/get-one/${id}`)
    return res.data
}
export let deleteItem=async (id) => {
    let res=await api.delete(`/delete/item/${id}`)
    return res.data
}
export let updateItem=async ({iId,id}) => {
    let res=await api.put(`/update/item/collection/${iId}/${id}`)
    return res.data
}
export let getItemsByCollection=async (collectionId) => {
    let res=await api.get(`/collection/${collectionId}`)
    return res.data
}
export let searchItems=async (query) => {
    let res=await api.get(`/search?q=${query}`)
    return res.data
}
export let getItemStatus=async (id) => {
    let res=await api.get(`/status/${id}`)
    return res.data
}
export let uploadFile=async (formData) => {
    let res=await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
}
export let getResurfacedItems=async () => {
    let res=await api.get("/resurface")
    return res.data
}