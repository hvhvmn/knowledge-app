import {createBrowserRouter} from "react-router"
import Register from "./features/auth/pages/Register"
import Login from "./features/auth/pages/Login"
import Dashboard from "./features/items/pages/Dashboard"
import Graph from "./features/graph/pages/Graph"
import Protected from "./features/auth/Components/Protected"
import AddItems from "./features/items/components/AddItems"
import Collection from "./features/collections/pages/Collection"
import Form from "./features/collections/components/Form"
import CollectionItems from "./features/collections/pages/CollectionItems"
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
            },
            {
                path:"collections",
                element:<Collection/>
            },
            {
                path:"collections/:collectionId",
                element:<CollectionItems/>
            },
            {
                path:"create-collection",
                element:<Form/>
            },
            {
                path:"graph",
                element:<Graph/>
            }
        ] 
    },
    {
  path: "*",
  element: <Login/>
}
])