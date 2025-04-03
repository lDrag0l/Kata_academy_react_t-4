import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchArticles = createAsyncThunk(
    'articles/fetchArticles',
    async ([offset, token = false], { rejectWithValue }) => {
        const options = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Token ${token}` })
            }
        };

        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/articles?limit=5&offset=${offset}`, options)
            const data = await response.json()

            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const fetchCurrentArticle = createAsyncThunk(
    'articles/fetchCurrentArticle',
    async ([slug, token], { rejectWithValue }) => {
        const options = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Token ${token}` })
            }
        };
        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`, options)

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
            const response = await fetch(
                `https://blog-platform.kata.academy/api/articles/${articleSlug}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (response.status === 403) {
                return { error: '403' };
            }

            if (!response.ok) console.log('Delete article failed')

            return { slug: articleSlug };

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateArticle = createAsyncThunk(
    'articles/updateArticle',
    async ([article, token, slug], { rejectWithValue }) => {
        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`,
                {
                    method: "PUT",
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
            if (!response.ok) console.log('Updating article failed')

            const data = await response.json()

            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const favoriteUnfavoriteCurrentArticle = createAsyncThunk(
    'articles/favoriteCurrentArticle',
    async ([slug, favorite, token], { rejectWithValue }) => {
        const method = favorite ? 'DELETE' : 'POST'

        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}/favorite`, {
                method: `${method}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
            })

            const data = await response.json()

            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)