import { createSlice } from '@reduxjs/toolkit'
export let itemsSlice=createSlice({
    name:"items",
    initialState:{
        isLoading:false,
        item:[],
        resurfacedItems:[],
        isResurfacingLoading:false,
    },
    reducers:{
        setIsLoading:(state,action)=>{
            state.isLoading = action.payload
        },
        setItem:(state,action)=>{
            state.item = action.payload
        },
        setResurfacedItems:(state,action)=>{
            state.resurfacedItems = action.payload
        },
        setIsResurfacingLoading:(state,action)=>{
            state.isResurfacingLoading = action.payload
        },
    }
})
export const {setIsLoading,setItem,setResurfacedItems,setIsResurfacingLoading}=itemsSlice.actions
export default itemsSlice.reducer
