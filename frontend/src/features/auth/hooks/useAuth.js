import { useDispatch } from "react-redux"
import { setIsError, setIsLoading, setUser } from "../auth.slice"
import { getMe, login, register } from "../services/auth.api"

export let useAuths=()=>{
    let dispatch=useDispatch()
    let handleRegister=async ({username,email,password}) => {
        try {
            dispatch(setIsLoading(true))
        let data=await register({username,email,password})
        dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setIsError(error.response?.data?.message || "Registration failed"))
        }finally{
        dispatch(setIsLoading(false))
        }
    }
    let handleLogin=async ({email,password}) => {
        try {
            dispatch(setIsLoading(true))
        let data=await login({email,password})
        dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setIsError(error.response?.data?.message || "Login failed"))
        }finally{
        dispatch(setIsLoading(false))
        }
    }
    let handleGetMe=async () => {
        try {
            dispatch(setIsLoading(true))
        let data=await getMe()
        dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setIsError(error.response?.data?.message || "Can't get you"))
        }finally{
        dispatch(setIsLoading(false))
        }
    }
    return {handleGetMe,handleRegister,handleLogin}
}