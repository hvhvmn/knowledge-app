import axios from "axios"
let api=axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "https://knowledge-app-40by.onrender.com"}/api/collection`,
    withCredentials:true
})
export let createCollection=async ({collectionName}) => {
    let res=await api.post("/save",{collectionName})
    return res.data
}
export let getAllCollections=async () => {
    let res=await api.get("/get-all-collection")
    return res.data
}
export let openACollection=async ({collectionName}) => {
    let res=await api.get("/open/collection",{collectionName})
    return res.data
}
export let deleteACollection=async (id) => {
    let res=await api.delete(`/delete/collection/${id}`)
    return res.data
}