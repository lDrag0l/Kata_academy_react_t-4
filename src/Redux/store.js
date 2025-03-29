import { configureStore } from "@reduxjs/toolkit";

import articlesReducer from './features/Articles/ArticlesSlice'
import authenticationReducer from './features/Authentication/AuthenticationSlice'

export const store = configureStore({
    reducer: {
        articles: articlesReducer,
        authentication: authenticationReducer
    }
});