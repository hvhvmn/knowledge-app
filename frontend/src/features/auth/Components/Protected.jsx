import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import LoadingAnimation from './LoadingAnimation'
const Protected = ({children}) => {
    let user=useSelector(state=>state.auth.user)
    let loading=useSelector(state=>state.auth.isLoading)
    if(loading){
        return <LoadingAnimation/>
    }
    if(!user){
        return <Navigate to="/login" replace/>
    }
  return (
   children
)
}

export default Protected