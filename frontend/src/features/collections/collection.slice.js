import { createSlice } from '@reduxjs/toolkit'
export let collectionSlice=createSlice({
    name:"collection",
    initialState:{
        collection:null,
        isLoading:false,
        items:null
    },
    reducers:{
        setCollection:(state,action)=>{
            state.collection=action.payload
        },
        setIsLoading:(state,action)=>{
            state.isLoading=action.payload
        },
        setItems:(state,action)=>{
            state.items=action.payload
        }
    }
})
export const {setCollection,setIsLoading,setItems} =collectionSlice.actions
export default collectionSlice.reducer

