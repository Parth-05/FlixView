import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from '../utils/api';

export const authenticateUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await loginUser(email, password);
            console.log(response)
            if (response.status !== 200) {
                return rejectWithValue({ message: 'Invalid Credentials!' });
            }
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await logoutUser();
            console.log(response);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoading: false,
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            // Login Handlers
            .addCase(authenticateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null; // Resetting error on new login attempt
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload// Assuming userInfo is returned
                state.error = null;
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || 'Could not log in. Please try again later.';
            })

            // Logout Handlers
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message || "Error logging out!";
            })
    },
});

// export const { logout } = authSlice.actions;
export default authSlice.reducer;
