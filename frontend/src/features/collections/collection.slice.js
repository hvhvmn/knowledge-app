import { createSlice } from '@reduxjs/toolkit'
export let collectionSlice=createSlice({
    name:"collection",
    initialState:{
        collection:null,
    },
    reducers:{
        setCollection:(state,action)=>{
            state.collection=action.payload
        }
    }
})
export const {setCollection} =collectionSlice.actions
export default collectionSlice.reducer

