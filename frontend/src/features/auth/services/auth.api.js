import axios from "axios"
let api=axios.create({
    baseURL:"http://localhost:3000/api/auth",
    withCredentials:true
})
export let register=async ({username,email,password}) => {
    let res=await api.post("/register",{username,email,password})
    return res.data
}
export let login=async ({email,password}) => {
    let res=await api.post("/login",{email,password})
    return res.data
}
export let getMe=async () => {
    let res=await api.get("/me")
    return res.data
}