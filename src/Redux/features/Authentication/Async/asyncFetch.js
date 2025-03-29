import { createAsyncThunk } from "@reduxjs/toolkit"

export const createAccount = createAsyncThunk(
    'Authentication/createAccount',
    async (user, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/users`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user: {
                            username: user.username,
                            email: user.email,
                            password: user.password
                        }
                    })
                })
            if (!response.ok) console.log('Registration failed')

            const data = await response.json()

            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const logInAccount = createAsyncThunk(
    'Authentication/logInAccount',
    async (user, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/users/login`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user: {
                            email: user.email,
                            password: user.password
                        }
                    })
                })
            if (!response.ok) console.log('Login failed')
            const data = await response.json()

            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const editProfileData = createAsyncThunk(
    'Authentication/editProfileData',
    async ([updatedUserData, token], { rejectWithValue }) => {
        try {
            const response = await fetch(`https://blog-platform.kata.academy/api/user`,
                {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify({
                        user: {
                            username: updatedUserData.username,
                            email: updatedUserData.email,
                            password: updatedUserData.password,
                            image: updatedUserData.image
                        }
                    })
                })
            if (!response.ok) console.log('Editing failed')

            const data = await response.json()

            if (!data.errors) {
                localStorage.setItem('user', JSON.stringify(data.user))
            }

            return data

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)