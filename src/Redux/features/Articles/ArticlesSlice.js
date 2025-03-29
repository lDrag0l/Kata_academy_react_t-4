import { createSlice } from "@reduxjs/toolkit";

import { fetchArticles, fetchCurrentArticle } from './Async/asyncFetch'

const initialState = {
    articles: [],
    loading: false,
    error: null,
    currentArticle: null,
    offset: 0,
    currentPage: 1,
    totalPages: null
}

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
            if (state.currentPage == 1) state.offset = 0
            else state.offset = (state.currentPage - 1) * 5
        }
    },

    extraReducers: (builder) => {
        builder
            //all
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.articles = [...action.payload.articles]
                state.totalPages = action.payload.articlesCount
                state.loading = false
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })

            //current
            .addCase(fetchCurrentArticle.pending, (state) => {
                state.loading = true
                state.error = null
                state.currentArticle = null
            })
            .addCase(fetchCurrentArticle.fulfilled, (state, action) => {
                state.currentArticle = action.payload.article
                state.loading = false
            })
            .addCase(fetchCurrentArticle.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })

    }
})

export const { setCurrentPage } = articlesSlice.actions


export default articlesSlice.reducer