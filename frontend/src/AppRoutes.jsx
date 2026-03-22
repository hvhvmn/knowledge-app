import {createBrowserRouter} from "react-router"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
import Dashboard from "./features/items/pages/Dashboard"
import Protected from "./features/auth/Components/Protected"
import AddItems from "./features/items/components/AddItems"
export let routes=createBrowserRouter([
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/",
        element:<Protected/>,
        children:[
            {
                path:"",
                element:<Dashboard/>
            },
            {
                path:"add",
                element:<AddItems/>
            }
        ] 
    }
])