import { createSlice } from '@reduxjs/toolkit'
export let itemsSlice=createSlice({
    name:"items",
    initialState:{
        isLoading:false,
        item:null,
    },
    reducers:{
        setIsLoading:(state,action)=>{
            state.isLoading = action.payload
        },
        setItem:(state,action)=>{
            state.item = action.payload
        },
    }
})
export const {setIsLoading,setItem}=itemsSlice.actions
export default itemsSlice.reducer
