import {useDispatch } from 'react-redux'
import { setIsLoading, setItem } from '../items.slice'
import { getAllItems, getOneItem, saveAItem } from '../services/items.api'
export let useItems=()=>{
    let dispatch=useDispatch()
    let handleSaveAItem=async ({title,url,tags,type,notes}) => {
        try {
            dispatch(setIsLoading(true))
        let data=await saveAItem({title,url,tags,type,notes})
        dispatch(setItem(data.item))
        } catch (error) {
            // throw new Error("Error in saving an items");
            
            console.log(error);
            
        }
        finally{
            dispatch(setIsLoading(false))
        }
    }
    let handleGetAllItems=async () => {
        try {
            dispatch(setIsLoading(true))
        let data=await getAllItems()
        dispatch(setItem(data.items))
        } catch (error) {
            throw new Error("Error in saving an items");
            
        }
        finally{
            dispatch(setIsLoading(false))
        }
    }
    let handleGetOneItem=async (id) => {
        try {
            dispatch(setIsLoading(true))
        let data=await getOneItem(id)
        dispatch(setItem(data.item))
        } catch (error) {
            throw new Error("Error in saving an items");
            
        }
        finally{
            dispatch(setIsLoading(false))
        }
    }
    return {handleSaveAItem,handleGetAllItems,handleGetOneItem}
}