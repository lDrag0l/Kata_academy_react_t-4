import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchArticles = createAsyncThunk(
    'articles/fetchArticles',
    async (offset, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/articles?limit=5&offset=${offset}`)

            const data = await response.json()

            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchCurrentArticle = createAsyncThunk(
    'articles/fetchCurrentArticle',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`)

            const data = await response.json()

            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createArticle = createAsyncThunk(
    'articles/createArticle',
    async ([article, token], { rejectWithValue }) => {
        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/articles`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify({
                        article: {
                            title: article.title,
                            description: article.description,
                            body: article.body,
                            tagList: article.tags
                        }
                    })
                })
            if (!response.ok) console.log('Creating article failed')

            const data = await response.json()
            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteArticle = createAsyncThunk(
    'articles/deleteArticle',
    async ([articleSlug, token], { rejectWithValue }) => {
        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/articles${articleSlug}`,
                {
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                })
            if (!response.ok) console.log('Delete article failed')

            const data = await response.json()
            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)