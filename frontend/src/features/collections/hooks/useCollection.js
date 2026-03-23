import {useDispatch } from 'react-redux'
import { setCollection, setIsLoading, setItems } from '../collection.slice'
import { createCollection, deleteACollection, getAllCollections, openACollection } from '../services/collection.api'
export let useCollections=() => {
    let dispatch=useDispatch()
    let handleCreateCollection= async ({collectionName}) => {
        try {
            dispatch(setIsLoading(true))
            await createCollection({collectionName})
        } catch (error) {
            throw new Error("Error in creating collection");
            
        }
        finally{
            dispatch(setIsLoading(false))
        }
    }
    let handleGetAllCollection=async () => {
        try {
            dispatch(setIsLoading(true))
            let data=await getAllCollections()
            dispatch(setCollection(data.collections))
        } catch (error) {
            throw new Error("Error in getting your collections");
            
        }finally{
            dispatch(setIsLoading(false))
        }
    }
    let handleOpenCollection=async ({collectionName}) => {
        try {
            dispatch(setIsLoading(true))
            let data=await openACollection({collectionName})
            dispatch(setItems(data.items))
        } catch (error) {
            throw new Error("Error in opening a collection");
        }
        finally{
            dispatch(setIsLoading(false))
        }
    }
    let handleDeleteCollection=async (id) => {
        try {
            dispatch(setIsLoading(true))
            await deleteACollection(id)
            handleGetAllCollection()
        } catch (error) {
            throw new Error("Error in deleting collection");
        }
        finally{
            dispatch(setIsLoading(false))
        }
    }
    return {handleCreateCollection,handleGetAllCollection,handleOpenCollection,handleDeleteCollection}
}