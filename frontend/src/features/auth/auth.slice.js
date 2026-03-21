import { createSlice } from '@reduxjs/toolkit'
export const authSlice=createSlice({
    name:"auth",
    initialState:{
        isLoading:true,
        user:null,
        error:null
    },
    reducers:{
        setIsLoading: (state, action) => {
            state.isLoading = action.payload
          },
          setIsError: (state, action) => {
            state.error = action.payload
          },
          setUser: (state, action) => {
            state.user = action.payload
          },
    }
})
export const {setIsError,setIsLoading,setUser}=authSlice.actions
export default authSlice.reducer