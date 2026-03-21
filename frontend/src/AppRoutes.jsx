import {createBrowserRouter} from "react-router"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
import Dashboard from "./features/items/pages/Dashboard"
import Protected from "./features/auth/Components/Protected"
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
        element:<Protected>
            <Dashboard/>
        </Protected>
    }
])