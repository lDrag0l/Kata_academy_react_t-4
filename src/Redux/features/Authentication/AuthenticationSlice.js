import { createSlice } from "@reduxjs/toolkit";
import { createAccount, logInAccount, editProfileData } from './Async/asyncFetch'

const initialState = {
    loading: false,
    error: {
        username: null,
        email: null
    },
    accountData: {
        username: null,
        email: null,
        token: null,
        image: null
    },
    isUpdated: false
}

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,

    reducers: {
        logInFromLocalStorage: (state, action) => {
            state.accountData = action.payload
        },

        logOut: (state) => {
            state.accountData = initialState.accountData
        },
        isUpdatedReload: (state) => {
            state.isUpdated = false
        }
    },

    extraReducers: (builder) => {
        builder
            //create account
            .addCase(createAccount.pending, (state) => {
                state.loading = true
                state.error = initialState.error
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload.errors) {
                    state.error =
                    {
                        email: action.payload.errors.email,
                        username: action.payload.errors.username
                    }
                }
                else state.accountData = action.payload.user
            })
            .addCase(createAccount.rejected, (state) => {
                state.error = initialState.error
                state.loading = false
            })

            //authentication
            .addCase(logInAccount.pending, (state) => {
                state.loading = true
                state.error = initialState.error
            })
            .addCase(logInAccount.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload.errors) {
                    state.error = action.payload.errors
                }
                else state.accountData = action.payload.user
            })
            .addCase(logInAccount.rejected, (state) => {
                state.error = initialState.error
                state.loading = false
            })

            //edit profile
            .addCase(editProfileData.pending, (state) => {
                state.loading = true
                state.error = initialState.error
            })
            .addCase(editProfileData.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload.errors) {
                    state.error =
                    {
                        username: action.payload.errors.username ? action.payload.errors.username : null
                    }
                } else {
                    state.isUpdated = true
                    state.accountData = action.payload.user
                }


            })
            .addCase(editProfileData.rejected, (state) => {
                state.error = initialState.error
                state.loading = false
            })
    }
})
export const { logInFromLocalStorage, logOut, isUpdatedReload } = authenticationSlice.actions

export default authenticationSlice.reducer