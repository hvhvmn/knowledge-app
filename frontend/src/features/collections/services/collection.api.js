import axios from "axios"
let api=axios.create({
    baseURL:"http://localhost:3000/api/collection",
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