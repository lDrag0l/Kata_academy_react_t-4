import { createSlice } from "@reduxjs/toolkit";

import { fetchArticles, fetchCurrentArticle, createArticle, deleteArticle, updateArticle, favoriteUnfavoriteCurrentArticle } from './Async/asyncFetch'

const initialState = {
    articles: [],

    loading: false,
    error: null,

    currentArticle: null,

    offset: 0,
    currentPage: 1,

    totalPages: null,

    createdEditArticleSlug: null,

    isCreated: false,
    isArticleDeleted: false,
    isArticleFavoritedUnfavorited: false
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
            state.isCreated = initialState.isCreated
        },
        isArticleDeletedReload: (state) => {
            state.isArticleDeleted = initialState.isArticleDeleted
        },
        currentArticleReload: (state) => {
            state.currentArticle = initialState.currentArticle
        },
        articleIsFavoritedUnfavoritedReload: (state) => {
            state.isArticleFavoritedUnfavorited = initialState.isArticleFavoritedUnfavorited
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
            .addCase(deleteArticle.fulfilled, (state, action) => {
                if (action.payload.error === '403') {
                    state.error = '403';
                } else {
                    state.currentArticle = null;
                    state.isArticleDeleted = true;
                }
                state.loading = false;
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            //update article
            .addCase(updateArticle.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
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
            .addCase(updateArticle.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })
            //favorite / unfavorite
            .addCase(favoriteUnfavoriteCurrentArticle.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(favoriteUnfavoriteCurrentArticle.fulfilled, (state, action) => {
                state.loading = false;

                if (state.currentArticle?.slug === action.payload.article.slug) {
                    state.currentArticle = action.payload.article;
                }

                state.articles = state.articles.map(item =>
                    item.slug === action.payload.article.slug
                        ? action.payload.article
                        : item
                );

                state.isArticleFavoritedUnfavorited = true;
            })
            .addCase(favoriteUnfavoriteCurrentArticle.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })


    }
})

export const { setCurrentPage, isCreatedUpdatedReload, isArticleDeletedReload, createdEditArticleSlugReload, currentArticleReload, articleIsFavoritedUnfavoritedReload } = articlesSlice.actions


export default articlesSlice.reducer