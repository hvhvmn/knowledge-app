import axios from "axios"
let api=axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "https://knowledge-app-40by.onrender.com"}/api/auth`,
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
export let logout=async () => {
    let res=await api.post("/logout")
    return res.data // return res.data
}