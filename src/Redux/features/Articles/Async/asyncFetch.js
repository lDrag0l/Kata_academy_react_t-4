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