import { createSlice } from "@reduxjs/toolkit";

import { fetchArticles, fetchCurrentArticle, createArticle, deleteArticle } from './Async/asyncFetch'

const initialState = {
    articles: [],

    loading: false,
    error: null,

    currentArticle: null,

    offset: 0,
    currentPage: 1,

    totalPages: null,
    isCreated: false,
    createdEditArticleSlug: null
}

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
            if (state.currentPage == 1) state.offset = 0
            else state.offset = (state.currentPage - 1) * 5
        },
        isCreatedUpdatedReload: (state) => {
            state.isCreated = false
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

            //create article
            .addCase(createArticle.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                if (action.payload.errors) {
                    state.error = action.payload.errors.message
                }
                else {
                    state.createdEditArticleSlug = action.payload.article.slug
                    state.isCreated = true
                    state.error = null
                    state.loading = false
                }
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })

            //delete article
            .addCase(deleteArticle.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteArticle.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })

    }
})

export const { setCurrentPage, isCreatedUpdatedReload } = articlesSlice.actions


export default articlesSlice.reducer