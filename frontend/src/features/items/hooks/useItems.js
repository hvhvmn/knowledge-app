import {useDispatch, useSelector } from 'react-redux'
import { setIsLoading, setItem, setResurfacedItems, setIsResurfacingLoading } from '../items.slice'
import { deleteItem, getAllItems, getOneItem, saveAItem, updateItem, getItemsByCollection, searchItems, getItemStatus, getResurfacedItems, uploadFile } from '../services/items.api'
import { useEffect, useState } from 'react'

export let useItems=()=>{
    let dispatch=useDispatch()
    let [processingItems, setProcessingItems] = useState(new Set())

    // Auto-refresh processing items
    useEffect(() => {
        if (processingItems.size === 0) return;

        const interval = setInterval(async () => {
            for (const itemId of processingItems) {
                try {
                    const data = await getItemStatus(itemId);
                    if (!data.processing) {
                        // Processing complete, remove from set and refresh items
                        setProcessingItems(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(itemId);
                            return newSet;
                        });
                        // Refresh all items to get updated data
                        handleGetAllItems();
                    }
                } catch (error) {
                    console.log("Error checking item status:", error);
                }
            }
        }, 2000); // Check every 2 seconds

        return () => clearInterval(interval);
    }, [processingItems]);

    let handleSaveAItem=async ({title,url,tags,type,notes}) => {
        try {
            dispatch(setIsLoading(true))
            const data = await saveAItem({title,url,tags,type,notes})

            dispatch(setItem(data.item))

            // Add to processing items set (safe immutable update)
            setProcessingItems(prev => {
              const newSet = new Set(prev)
              if (data?.item?._id) newSet.add(data.item._id)
              return newSet
            })

            return data.item
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(setIsLoading(false))
        }
    }

    let handleGetAllItems=async () => {
        try {
            dispatch(setIsLoading(true))
            const data = await getAllItems()
            dispatch(setItem(data.items))

            // Sync processing set with latest state
            setProcessingItems(() => {
                const loadingSet = new Set()
                if (Array.isArray(data.items)) {
                    data.items.forEach(item => {
                        if (item.processing) loadingSet.add(item._id)
                    })
                }
                return loadingSet
            })
        } catch (error) {
            throw new Error("Error in saving an items")
        } finally {
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

    let handleUploadFile = async (formData) => {
        try {
            dispatch(setIsLoading(true))
            const data = await uploadFile(formData)
            // Refresh item list after upload
            await handleGetAllItems()
            return data
        } catch (error) {
            console.log('Error in file upload', error)
            throw error
        } finally {
            dispatch(setIsLoading(false))
        }
    }

    let handleGetResurfacedItems=async () => {
        try {
            dispatch(setIsResurfacingLoading(true))
        let data=await getResurfacedItems()
        dispatch(setResurfacedItems(data.resurfacedItems))
        } catch (error) {
            console.log("Error in getting resurfaced items", error);
        }
        finally{
            dispatch(setIsResurfacingLoading(false))
        }
    }
    let item = useSelector(state => state.items.item)
    let resurfacedItems = useSelector(state => state.items.resurfacedItems)
    return {handleSaveAItem,handleGetAllItems,handleGetOneItem,handleDeleteItem,handleUpdateItem,handleGetItemsByCollection,handleSearchItems,handleGetResurfacedItems,handleUploadFile,item,resurfacedItems}
}