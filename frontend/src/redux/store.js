import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/auth/auth.slice"
import itemsReducer from "../features/items/items.slice"
import collectionReducer from "../features/collections/collection.slice"
export const store = configureStore({
  reducer: {
    auth:authReducer,
    items:itemsReducer,
    collection:collectionReducer
  },
})