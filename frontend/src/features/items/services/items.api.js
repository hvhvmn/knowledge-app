import axios from "axios"
let api=axios.create({
    baseURL:"http://localhost:3000/api/items",
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