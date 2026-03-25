import {useDispatch, useSelector } from 'react-redux'
import { setIsLoading, setItem } from '../items.slice'
import { deleteItem, getAllItems, getOneItem, saveAItem, updateItem, getItemsByCollection, searchItems } from '../services/items.api'
export let useItems=()=>{
    let dispatch=useDispatch()
    let handleSaveAItem=async ({title,url,tags,type,notes}) => {
        try {
            dispatch(setIsLoading(true))
        let data=await saveAItem({title,url,tags,type,notes})
        dispatch(setItem(data.item))
           return data.item 

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
    let handleDeleteItem=async (id) => {
        try {
            dispatch(setIsLoading(true))
        await deleteItem(id)
        handleGetAllItems()
        } catch (error) {
            throw new Error("Error in deleting an item");
            
        }
        finally{
            dispatch(setIsLoading(false))
        }
    }
    let handleUpdateItem=async ({iId,id}) => {
        try {
            dispatch(setIsLoading(true))
        await updateItem({iId,id})
        handleGetAllItems()
        } catch (error) {
            throw new Error("Error in updating an item");
            
        }
        finally{
            dispatch(setIsLoading(false))
        }
    }
    let handleGetItemsByCollection=async (collectionId) => {
        try {
            dispatch(setIsLoading(true))
        let data=await getItemsByCollection(collectionId)
        dispatch(setItem(data.items))
        } catch (error) {
            console.log("Error in getting items by collection", error);
            
        }
        finally{
            dispatch(setIsLoading(false))
        }
    }
    let handleSearchItems=async (query) => {
        try {
            dispatch(setIsLoading(true))
        let data=await searchItems(query)
        dispatch(setItem(data.items))
        } catch (error) {
            console.log("Error in searching items", error);
            
        }
        finally{
            dispatch(setIsLoading(false))
        }
    }
    let item = useSelector(state => state.items.item)
    return {handleSaveAItem,handleGetAllItems,handleGetOneItem,handleDeleteItem,handleUpdateItem,handleGetItemsByCollection,handleSearchItems,item}
}