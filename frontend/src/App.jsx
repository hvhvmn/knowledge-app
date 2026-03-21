import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { routes } from './AppRoutes'
import { useAuths } from './features/auth/hooks/useAuth'

const App = () => {
  let auth=useAuths()
  useEffect(()=>{
  auth.handleGetMe()
  },[])
  return (
   <RouterProvider router={routes}/>
  )
}

export default App